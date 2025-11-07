# Runtime

## Overview

The runtime is the core of Balm. It is responsible for all the mod-loader specific functionality and provides the common interfaces that are ultimately passed to your `BalmModule` or available through the `Balm` class (or their client equivalents).

## Registrars

When calling `initializeMod` with a static initializer, you will be given a `BalmRegistrars` instance.

When using `BalmModule`, the various `register...()` methods are called automatically.

These registrar instances can be used to register content like blocks, items, and more.

## Services

Use the `Balm` or `BalmClient` helper classes to access the runtime services at any time.

The runtime covers services for

- initializing your mod (`Balm.initializeMod()`) which will give you access to registrars, 
- network communication (`Balm.networking()`), 
- configuration (`Balm.config()`),
- third party mod support (`Balm.modSupport()`),
- platform-specific methods such as mod lookups (`Balm.platform()`),
- and more

### Accessing the Balm Runtime safely as a non-Balm mod

Third Party Mods, and in some circumstances Balm mods as well, should take care not to access the Balm runtime outside of the regular mod lifecycle. 

For example, you may run into, or cause problems, if you
- access Balm services on a mixin that runs before mods are loaded
- access Balm services in a Fabric entrypoint when running on Forge via Sinytra Connector

To ensure your third party integration code only runs when Balm is ready for it, you can use `Balmstrap.onRuntimeAvailable()`, which takes a `Runnable` that is ran once Balm has loaded.

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