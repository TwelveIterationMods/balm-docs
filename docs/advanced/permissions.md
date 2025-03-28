---
title: Permission System
---

## Overview

Balm's permission system provides a platform-agnostic way to handle permissions across the different mod loaders.

It integrates with each platform's native permission systems when available, and falls back to a common implementation otherwise.

## Core Concepts

### Permission Identifiers

Permissions are identified using `ResourceLocation`s in the format `modid:permission.path`.

#### Example:
```java
ResourceLocation PERMISSION_YOURCOMMAND = ResourceLocation.fromNamespaceAndPath("yourmod", "command.yourcommand");
```

### Permission Context

Permissions are resolved in a specific context, which can be:

- A player context
- A command source context (player, entity or command block)
- An offline player (UUID only)

:::warning
Note that only player contexts are fully supported on all platforms. Most permission systems do not support non-player permissions and will instead fall back to the default resolver you specify when registering your permissions. Additionally, Balm does not support offline player permissions yet.
:::

## Usage

### Registering Permissions

```java
// For commands, there is a helper method to register a permission which will use the permission system for players and fall back to the regular Vanilla permission level check for non-players like command blocks.
BalmCommands.registerPermission(
    ResourceLocation.fromNamespaceAndPath("mymod", "command.feature"),
    2 // Permission level: 2 (gamemaster), same as e.g. /gamerule command
);

// You can also register custom permissions. For example, the above helper method uses this under the hood:
Balm.getPermissions().registerPermission(
    permission,
    (context) -> context.getCommandSource().map(it -> it.hasPermission(permissionLevel)).orElse(false)
);
```

### Checking Permissions

```java
// Check if a player has a permission
boolean hasPermission = Balm.getPermissions().hasPermission(player, permission);

// Check if a command source has a permission
boolean hasPermission = Balm.getPermissions().hasPermission(commandSource, permission);
```

#### Requiring Permissions on Commands

The `BalmCommands` interface provides helper methods for command permission checks:

```java
// Require a single permission
Commands.literal("mycommand")
    .requires(BalmCommands.requirePermission(PERMISSION_ID))
    .executes(context -> { /* command logic */ });

// Require any of multiple permissions
Commands.literal("mycommand")
    .requires(BalmCommands.requireAnyPermission(PERMISSION_A, PERMISSION_B))
    .executes(context -> { /* command logic */ });

// Require all permissions
Commands.literal("mycommand")
    .requires(BalmCommands.requireAllPermissions(PERMISSION_A, PERMISSION_B))
    .executes(context -> { /* command logic */ });
```

### Platform Integrations

Balm automatically integrates with:

- [`fabric-permissions-api`](https://modrinth.com/mod/fabric-permissions-api) (third party mod) when it's present on Fabric
- `PermissionAPI` on NeoForge and Forge
- Fallback to your defined default resolvers / vanilla permission levels when no permission handler is installed