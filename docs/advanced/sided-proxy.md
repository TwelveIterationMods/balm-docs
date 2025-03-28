---
title: Sided Proxies
---

## Overview

Sided proxies are a way of safely calling client-only code in a common context.

:::tip
Balm provides its own sided proxy via `Balm.getProxy()` that can be used for the most common use cases, such as getting the local player.
:::

With sided proxies, you can:

- Define a common class that provides the default implementation to use (e.g. on servers)
- Define a client sub-class that provides the implementation to use on clients

:::tip
Needing a sided proxy is often a sign that something is wrong in the design of your code. Consider refactoring to better separate your client code from your common code instead.
:::

## Usage

```java
MyCommonProxy sidedProxy = Balm.sidedProxy("com.example.mymod.MyCommonProxy","com.example.mymod.client.MyClientProxy").get();
```

## Requirements for Proxy Classes

Proxy classes must

- Have a public no-argument constructor

The client proxy class must

- extend the common proxy class

## Platform Detection

If you have a `Level` available in your context, you should use `level.isClientSide` to determine whether you're acting on the client level or the server level.

:::info
Note that singleplayer has a server level too, since it is running an integrated server.
:::

For cases where you need to actually know whether the mod is running on a client or a dedicated server, you can use Balm's proxy to check:

```java
if (Balm.getProxy().isClient()) {
    // Do something that only happens on clients, but not on dedicated servers
}
```

:::warning
Be careful not to cause any client-only classes to be loaded when you use this pattern!

It is safe to call a static method of a client-only class (as long as it doesn't take any client-only class parameters), but you cannot instantiate or access any instances of client-only classes.
:::

### Comparison with Other Proxy Types

Balm also provides other proxy types:

- [Platform Proxies](./platform-proxy.md): For platform-specific code (e.g. NeoForge vs Fabric)
- [Mod Proxies](./mod-proxy.md): For mod-specific code (e.g. abstracting away different currency mods)