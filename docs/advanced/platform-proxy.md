---
title: Platform Proxies
---

## Overview

Platform proxies are a way of abstracting platform-specific code away through a common interface from your common code.

:::tip
Most features you would normally need to access are already abstracted through other means using the Balm API, and there is a good chance you do not need to use platform proxies.

They merely exist as a simple way to extend Balm's capabilities for things that are not already natively supported.
:::

With platform proxies, you can:

- Define a common interface to abstract loader-specific code into common-accessible code
- Provide implementations for your interface on each loader subproject individually
- Have Balm automatically load the appropriate implementation when accessing your proxy

## Usage

```java
// Define implementations for each platform
MyInterface instance = Balm.platformProxy()
    .withFabric("com.example.mymod.fabric.FabricImplementation")
    .withForge("com.example.mymod.forge.ForgeImplementation") 
    .withNeoForge("com.example.mymod.neoforge.NeoForgeImplementation")
    .build();
```

## Requirements for Proxy Classes

Implementation classes loaded through the platform proxy system must:

- Implement the interface you're proxying
- Have a public no-argument constructor

## Platform Detection

For the rare case where you need to handle some mod logic differently on one platform without needing to access loader-specific code, Balm also provides the current platform through `Balm.getPlatform()` and its supported platforms in the `LoaderPlatforms` class.

```java
if (Balm.getPlatform().equals(LoaderPlatforms.FABRIC)) {
    // Do something that only happens on Fabric (but obviously, without having access to Fabric APIs since you're in common code)
}
```

### Comparison with Other Proxy Types

Balm also provides other proxy types:

- [Mod Proxies](./mod-proxy.md): For mod-specific code (e.g. abstracting away different currency mods)
- [Sided Proxies](./sided-proxy.md): For client vs dedicated server code (only rarely needed nowadays)