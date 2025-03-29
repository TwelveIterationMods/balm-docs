# Runtime

## Overview

The runtime is the core of Balm. It is responsible for all the mod-loader specific functionality and provides the common interfaces that are ultimately passed to your `BalmModule` or available through the `Balm` class (or their client equivalents).

## Services

Use the `Balm` or `BalmClient` helper classes to access the runtime services at any time.

The runtime covers services for

- the most common registry items (`Balm.getBlocks()`, `Balm.getItems()`, ...), 
- registry access for cases not covered above (`Balm.getRegistries()`),
- network communication (`Balm.getNetworking()`), 
- configuration (`Balm.getConfig()`),
- third party mod support (`Balm.getModSupport()`),
- some common mod loader features and event hooks (`Balm.getHooks()`),
- and more

:::warning
Generally, Balm doesn't care at what time you call any of the registration methods, as long as it's within your mod's initializer.

However, you should register configs and data components early to ensure you can access startup configs, and to be able to use your registered components inside your item registrations.

Alternatively, you can use [modules](./modules.md) so you don't have to care about the order of registration.
:::

### Using modules

If you use the new `BalmModule` class, you can simply implement the respective callback method (e.g. `registerBlocks()`) which looks a bit cleaner and is guaranteed to run at a safe time.

See the [modules](./modules.md) documentation for examples.

### Accessing the Balm Runtime safely

Third Party Mods, and in some circumstances Balm mods as well, should take care not to access the Balm runtime outside of the regular mod lifecycle. 

For example, you may run into, or cause problems, if you
- access Balm services on a mixin that runs before mods are loaded
- access Balm services in a Fabric entrypoint when running on Forge via Sinytra Connector

To ensure your third party integration code only runs when Balm is ready for it, you can use `Balm.onRuntimeAvailable()`, which takes a `Runnable` that is ran once Balm has loaded.

:::info
This only applies to third party mods. Mods that are built on Balm should use `Balm.initializeMod` in their entrypoints as normal.
:::

## Behind the Scenes

Balm's runtime is loaded using a Service Provider Interface (SPI), and there is an implementation of it for each supported mod loader.

Balm defines the class to load for the runtime in a `META-INF/services/` file. That's all!

:::tip
You can create an SPI using `ServiceLoader` yourself to create platform specific code.

But you probably don't need to since you can just use a [Platform Proxy](../advanced/platform-proxy.md) or the existing Balm services.

Just thought I'd mention it so you understand that there really isn't any magic involved in Balm at all.
:::