# Capabilities

## Overview

Balm exposes Capabilities (Forge/NeoForge) and Block APIs (Fabric) through the `BalmCapabilities` service.

```java
BalmCapabilities capabilities = Balm.getCapabilities();
```

## Default Capabilities

By default, Balm registers capabilities for Minecraft's `Container` interface as well as Balm's `FluidTank` and `EnergyStorage` interfaces.

These capabilities are automatically mapped to the mod-loader native capabilities:

- The `Container` capability is exposed as `IItemHandler` on Forge and NeoForge, and as `ItemStorage` on Fabric
- The `FluidTank` capability is exposed as `IFluidHandler` on Forge and NeoFore, and as `FluidStorage` on Fabric
- The `EnergyStorage` capability is exposed as `IEnergyStorage` on Forge and NeoForge, and as a [Reborn Energy](https://github.com/TechReborn/Energy) (third party mod) `EnergyStorage` on Fabric

:::info
This mapping is unidirectional. That means if you expose a `Container` capability, it will be available to mods supporting `IItemHandler` or `ItemStorage`, but querying the `Container` capability will not provide you with other mod's `IItemHandler`s or `ItemStorage`s.

It is recommended to use a [Mod Proxy](./mod-proxy.md) or [Platform Proxy](./platform-proxy.md) if you need to access a mod-loader specific capability.
:::

### Exposing Default Capabilities

The easiest way to provide these default capabilities is by implementing a respective provider interface on your block entity.

- `Container` → `BalmContainerProvider`
- `FluidTank` → `BalmFluidTankProvider`
- `EnergyStorage` → `BalmEnergyStorageProvider`

Block entities implementing these interfaces will automatically have them exposed as a capability.

```java
public class YourStorageBlockEntity extends BalmBlockEntity implements BalmContainerProvider {
    // ...
    @Override
    public Container getContainer() {
        return container;
    }
    // ...
}
```

## Retrieving an Existing Capability Type

Most capability-related methods operate on a `CapabilityType`.

If you are creating a capability yourself, you can use `registerType` (more on that below), otherwise you can use `getType` to lookup an already existing capability.

```java
CapabilityType<Block, YourCapability, Direction> SOME_CAPABILITY = capabilities.getType(id("some_capability"), Block.class, YourCapability.class, Direction.class)
```

:::info
Capabilities for Block Entities are registered under the `Block` scope. There is no separate `BlockEntity` scope.
:::

:::warning[Caveat: Capabilities on Forge]
On Forge, there is some additional code required before you can access a capability. See "Registering a Capability on Forge" below.
:::

## Querying a Capability

You can use `getCapability` to query for a capability on a block entity using a `CapabilityType` obtained through either `getType` or `registerType`.

```java
EnergyStorage energyStorage = capabilities.getCapability(blockEntity, direction, CommonCapabilities.ENERGY_STORAGE);
```

## Registering a Capability Provider

Capability providers are responsible for exposing capabilities from your block entities. They are registered to specific block entity types.

:::tip
If you implement `BalmContainerProvider`, `BalmFluidTankProvider` or `BalmEnergyStorageProvider` in your block entity, you do not need to worry about exposing their respective capabilities manually.
:::

```java
capabilities.registerProvider(id("your_capability_provider"),
                SOME_CAPABILITY,
                (blockEntity, context) -> blockEntity instanceof YourBlockEntity yourBlockEntity ? yourBlockEntity.getSomeCapabilityImplementation() : null,
                () -> List.of(
                        ModBlockEntities.yourBlockEntity.get()
                ));
```

## Registering a Fallback Capability Provider

You can also register a fallback capability provider. These providers will apply to **all** block entities.

For example, Balm uses a fallback provider to automatically expose capabilities from block entities that implement the default interfaces (such as `BalmContainerProvider`).

```java
capabilities.registerFallbackBlockEntityProvider(id("your_fallback_capability_provider"),
                SOME_CAPABILITY,
                (blockEntity, context) -> blockEntity instanceof YourBlockEntity yourBlockEntity ? yourBlockEntity.getSomeCapabilityImplementation() : null);
```

## Registering a Capability

If you're creating a capability for yourself or other mods to use, you need to register it.

```java title="With a nullable Direction as context"
CapabilityType<Block, YourCapability, Direction> YOUR_CAPABILITY = capabilities.registerType(id("your_capability"), Block.class, YourCapability.class, Direction.class);
```

```java title="Without a context"
CapabilityType<Block, YourCapability, Void> YOUR_CAPABILITY = capabilities.registerType(id("your_capability"), Block.class, YourCapability.class, Void.class);
```

:::warning[Caveat: Capabilities on Forge]
On Forge, there is some additional code required to register a capability. See below for more.
:::

## Caveat: Capabilities on Forge

Due to the way Forge's capabilities work, it is necessary to create a `CapabilityToken` and pre-register capabilities to Balm before calling `BalmCapabilities.registerType` or `BalmCapabilities.getType`.

This step cannot be automated by Balm because Forge uses a transformer on `CapabilityToken` that needs the generic parameter to be statically defined at compile-time.

```java title="In your Forge entrypoint, before registering capabilities"
final var forgeCapabilities = (ForgeBalmCapabilities) Balm.getCapabilities();
forgeCapabilities.preRegisterType(id("your_capability"), CapabilityManager.get(new CapabilityToken<YourCapability>() {
}));
```

:::tip
If you use `BalmModule`, consider registering an additional module in your Forge entrypoint that runs before your common module.

If you use a static intializer, simply make your `preRegisterType` calls before you call `initializeMod`.
:::