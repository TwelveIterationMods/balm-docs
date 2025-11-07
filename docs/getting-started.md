---
sidebar_position: 1
title: Getting Started
---

# Getting Started with Balm

## Prerequisites

You should have

- an understanding of Java and Minecraft Modding
- an IDE like [IntelliJ IDEA](https://www.jetbrains.com/idea/)
- the ability to clone a [Git](https://www.git-scm.com/) repository

## Setting up a Project

Balm is just a library that you load into your project like any other dependency.

Most of the MultiLoader magic, which is just setting up a few sub-projects and sourcesets, happens in the Gradle template you use.

Balm only comes in to provide API wrappers to let you interact with mod loaders from within your common code.

### Using the Balm Mod Template (recommended)

Click `Use this template` on the [balm-mod](https://github.com/TwelveIterationMods/balm-mod) repository to create a copy of the template repository.

Make sure you select `Include all branches` if you intend to release for older versions.

Clone your new repository and follow the steps in the `README` to get set up.

:::note
In the future I would like to have a project generator so you don't have to manually rename all the files, but it's not ready yet.
:::

### Using Jared's MultiLoader Template

Balm's Mod Template is based on and closely resembles Jared's MultiLoader Template.

If you're are currently using Jared's MultiLoader Template, follow the steps below in `Adding Balm to an Existing Project`.

### Using your own Gradle Setup

If you want to use your own gradle setup instead of one of the above templates, you need to create a gradle setup that includes a `common` project for your shared code, and another project for each mod loader you want to support. Your mod loader projects need to depend on the common project and include the common code when building their jar. Then, follow the steps below in `Adding Balm to an Existing Project`.

The mod templates above already come with a gradle setup that covers all of this, so I recommend either using them as a base or reference to adapt your project.

### Adding Balm to an Existing Project

#### Add Balm to your Common Project

:::info
This example includes Kuma too, which is a library embedded in Balm to allow for easier registration of key bindings with support for key modifiers and conflict contexts.
:::

```groovy
repositories {
    maven {
        url "https://maven.twelveiterations.com/repository/maven-public/"
        content {
            includeGroup "net.blay09.mods"
        }
    }
}

dependencies {
    implementation("net.blay09.mods:kuma-api-common:${kuma_version}")
    implementation("net.blay09.mods:balm-common:${balm_version}") {
        changing = balm_version.endsWith("SNAPSHOT")
    }
}
```

#### Add Balm to your Fabric Project

```groovy
repositories {
    maven {
        url "https://maven.twelveiterations.com/repository/maven-public/"
        content {
            includeGroup "net.blay09.mods"
        }
    }
}

dependencies {
    modImplementation("net.blay09.mods:kuma-api-fabric:${kuma_version}")
    modImplementation("net.blay09.mods:balm-fabric:${balm_version}") {
        changing = balm_version.contains("SNAPSHOT")
    }
}
```

#### Add Balm to your NeoForge Project

```groovy
repositories {
    maven {
        url "https://maven.twelveiterations.com/repository/maven-public/"
        content {
            includeGroup "net.blay09.mods"
        }
    }
}

dependencies {
    implementation("net.blay09.mods:kuma-api-neoforge:${kuma_version}")
    implementation("net.blay09.mods:balm-neoforge:${balm_version}") {
        changing = balm_version.contains("SNAPSHOT")
    }
}
```

#### Add Balm to your Forge Project

```groovy
repositories {
    maven {
        url "https://maven.twelveiterations.com/repository/maven-public/"
        content {
            includeGroup "net.blay09.mods"
        }
    }
}

dependencies {
    implementation("net.blay09.mods:kuma-api-forge:${kuma_version}")
    implementation("net.blay09.mods:balm-forge:${balm_version}") {
        changing = balm_version.contains("SNAPSHOT")
    }
}
```

#### Initializing your mod with Balm

Call `Balm.initializeMod` with your mod id, the mod-loader specific load context, and a `BalmModule` or static initializer method in each of your mod-loader specific entrypoints.

```java
public class FabricTrashSlot implements ModInitializer {
    @Override
    public void onInitialize() {
        Balm.initializeMod(TrashSlot.MOD_ID, EmptyLoadContext.INSTANCE, new TrashSlot());
    }
}
```

```java
@Mod(TrashSlot.MOD_ID)
public class NeoForgeTrashSlot {
    public NeoForgeTrashSlot(IEventBus modEventBus) {
        Balm.initializeMod(TrashSlot.MOD_ID, new NeoForgeLoadContext(modEventBus), new TrashSlot());
    }
}
```

In most cases, you need to do the same for the client using `BalmClient.initializeMod` as well.

If you are making a client-side only mod, it is still recommended to call both `Balm.initializeMod` and `BalmClient.initializeMod`, as the common initializer will setup some events that run on both client and server.

For more information on this part, check the documentation on [entrypoints](./concepts/entrypoints.md).

Once everything is setup, you can get started by [registering content](./registries/blocks.md) or adding event handlers via `Balm.getEvents()`.