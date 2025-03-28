# Modules

:::info[Minecraft 1.21.5+ only]
Modules are available starting in Minecraft 1.21.5. See [Entrypoints](./entrypoints.md) for how to initialize your mod on older versions.
:::

## Overview

Modules are a new method of interacting with Balm in a more structured and organized way.

Instead of a static initializer method that accesses the various Balm services, you can implement the interface `BalmModule` or `BalmClientModule` and register an instance of your class with Balm. Balm will then take care of calling the various `register...()` methods at the appropriate time.

You can use multiple modules to organize your code into functional or logical groups.

Modules are optional - you can continue to simply access the Balm services directly using the `Balm` class in your initializer.

## Defining a module

Modules need to implement at least `getId()` so they can be identified and attributed to a specific mod. The `path` is up to you to use.

The callback methods for registering things all have an empty default implementation, so you can simply override only the parts you need for your module.

```java
public class Waystones implements BalmModule {
    @Override
    public ResourceLocation getId() {
        return ResourceLocation.fromNamespaceAndPath("waystones", "common");
    }

    @Override
    public void registerConfig(BalmConfig config) {
        config.registerConfig(WaystonesConfig.class);
    }
}
```

## Initializing your mod with a module

You can pass an instance of the interface `BalmModule` to the `Balm.initializeMod()` method of your loader entrypoint to initialize your mod with a module.

```java
Balm.initializeMod(Waystones.MOD_ID, EmptyLoadContext.INSTANCE, new Waystones());
```

## Initializing your mod with multiple modules

You can also pass multiple modules to have them all registered. They will initialize in the order they were passed in.

```java
Balm.initializeMod(Waystones.MOD_ID, EmptyLoadContext.INSTANCE, new WaystonesBlocks(), new WaystonesItems());
```

## Registering a module manually

You can call `Balm.registerModule()` at any time to add an additional module.

Just make sure it's in your initializer if you're registering blocks or other registry items in your module!

```java
Balm.initializeMod(Waystones.MOD_ID, EmptyLoadContext.INSTANCE, () -> {
    Balm.registerModule(new Waystones());
});
```

## Client Modules

Client modules behave exactly the same except they use the `BalmClientModule` interface and are registered through `BalmClient`.