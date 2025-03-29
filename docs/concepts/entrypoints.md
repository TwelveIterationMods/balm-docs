# Entrypoints

## Overview

In order for your mod to be loaded, you must create a mod-loader specific entrypoint inside each corresponding mod-loader subproject, and register your mod with Balm inside.

If you use the [balm-mod template repository](https://github.com/TwelveIterationMods/balm-mod), this setup should already be done for you.

If you use [Jared's MultiLoader](https://github.com/jaredlll08/MultiLoader-Template) template, you need to add the calls to `Balm.initializeMod()` so that your mod is registered with Balm.

## NeoForge

### neoforge.mods.toml

Your mod must come with a `neoforge.mods.toml` file that defines the metadata, dependencies and mixin configurations to load.

Refer to the [NeoForge documentation](https://docs.neoforged.net/docs/gettingstarted/modfiles#neoforgemodstoml) to learn more.

### Common Entrypoint

```java
@Mod(Waystones.MOD_ID)
public class NeoForgeWaystones {
    public NeoForgeWaystones(IEventBus modEventBus) {
        final var context = new NeoForgeLoadContext(modEventBus);
        // Using a BalmModule
        Balm.initializeMod(Waystones.MOD_ID, context, new Waystones());
        // or using a static initializer method
        // Balm.initializeMod(Waystones.MOD_ID, EmptyLoadContext.INSTANCE, Waystones::initialize);
    }
}
```

### Client Entrypoint

```java
@Mod(value = Waystones.MOD_ID, dist = Dist.CLIENT)
public class NeoForgeWaystonesClient {

    public NeoForgeWaystonesClient(IEventBus modEventBus) {
        final var context = new NeoForgeLoadContext(modEventBus);
        // Using a BalmClientModule
        BalmClient.initializeMod(Waystones.MOD_ID, context, new WaystonesClient());
        // or using a static initializer method
        // BalmClient.initializeMod(Waystones.MOD_ID, EmptyLoadContext.INSTANCE, WaystonesClient::initialize);
    }
}
```

## Fabric

### fabric.mod.json

Your mod must come with a `fabric.mod.json` file that defines the `main` and `client` entrypoints to your entrypoint classes as well as all other metadata.

Refer to the [Fabric documentation](https://docs.fabricmc.net/develop/getting-started/project-structure#fabric-mod-json) to learn more.

:::tip
Balm provides a default [Mod Menu](https://modrinth.com/mod/modmenu) entrypoint to automatically expose your mod's configuration through supported config screens.

You should only need to define a custom `modmenu` entrypoint if you want to provide your own configuration screen or make other changes.
:::

### Common Entrypoint

```java
public class FabricWaystones implements ModInitializer {
    @Override
    public void onInitialize() {
        // Using a BalmModule
        Balm.initializeMod(Waystones.MOD_ID, EmptyLoadContext.INSTANCE, new Waystones());
        // or using a static initializer method
        // Balm.initializeMod(Waystones.MOD_ID, EmptyLoadContext.INSTANCE, Waystones::initialize);
    }
}
```

### Client Entrypoint

```java
public class FabricWaystonesClient implements ClientModInitializer {
    @Override
    public void onInitializeClient() {
        // Using a BalmClientModule
        BalmClient.initializeMod(Waystones.MOD_ID, EmptyLoadContext.INSTANCE, new WaystonesClient());
        // or using a static initializer method
        // BalmClient.initializeMod(Waystones.MOD_ID, EmptyLoadContext.INSTANCE, WaystonesClient::initialize);
    }
}
```

## Forge

### mods.toml

Your mod must come with a `mods.toml` file that defines the metadata and dependencies to load.

Refer to the [Forge documentation](https://docs.minecraftforge.net/en/latest/gettingstarted/modfiles/#modstoml) to learn more.

Also note that Forge uses the `MixinConfigs` manifest attribute to define mixin configurations. On the template projects this is already taken care of, but otherwise you may have to adjust your gradle files to set the attribute accordingly.

### Common & Client Entrypoint

```java
@Mod(Waystones.MOD_ID)
public class ForgeWaystones {
    final var loadContext = new ForgeLoadContext(context.getModEventBus());
    // Using a BalmClientModule
    Balm.initializeMod(Waystones.MOD_ID, EmptyLoadContext.INSTANCE, new Waystones());
    // or using a static initializer method
    // Balm.initialize(Waystones.MOD_ID, loadContext, Waystones::initialize);
    if (FMLEnvironment.dist.isClient()) {
        // To use BalmClientModule, create a static initializer method on Forge where you register the module manually.
        BalmClient.initialize(Waystones.MOD_ID, loadContext, ForgeWaystonesClient::initialize);
        // or using a static initializer method
        // BalmClient.initialize(Waystones.MOD_ID, loadContext, WaystonesClient::initialize);
    }
}
```

If you're using BalmClientModule:
```java
public class ForgeWaystonesClient {
    public static void initialize() {
        Balm.registerModule(new WaystonesClient());
    }
}
```

:::info
This looks scary because it's accessing client-only code from a common context, but it's actually safe in modern Java as long as the methods involved are all static.

However, creating a new instance of `WaystonesClient` like in the other examples would load the class, so unfortunately you have to wrap the module registration into a helper class on Forge.
:::

## Third Party Mod Compatibility

The mod-loader specific entrypoints are also a good place to initialize addon compatibility classes that are only present in your mod-loader subprojects.

You can use `Balm.initializeIfLoaded` to only load the given class if the mod is present, avoiding a hard dependency on the third party mod. 

```java
Balm.initializeIfLoaded("exnihilosequentia", "net.blay09.mods.excompressum.compat.ExNihiloSequentiaIntegration");
```

:::warning
Don't use `ExNihiloSequentiaIntegration.class.getName()` as that will cause the class to be loaded even if the third party mod isn't present, which will lead to a crash if that class happens to access any classes from the third party mod.
:::