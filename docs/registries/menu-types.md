---
title: Menu Types
sidebar_position: 30
---

## Registering Menu Types

Menu types can be registered using a `BalmMenuTypeRegistrar`.

```java
public class ModMenuTypes {

    public static Holder<MenuType<YourMenu>> yourMenuType;

    public static void initialize(BalmMenuTypeRegistrar menuTypes) {
        yourMenuType = menuTypes.register("your_menu_type", new BalmMenuFactory<YourMenu, YourMenu.Data>() {
            @Override
            public YourMenu create(int syncId, Inventory inventory, YourMenu.Data data) {
                return new YourMenu(syncId, inventory, data);
            }

            @Override
            public StreamCodec<RegistryFriendlyByteBuf, YourMenu.Data> getStreamCodec() {
                return YourMenu.Data.STREAM_CODEC.cast();
            }
        }).asHolder();
    }

}
```

You can obtain a BalmMenuTypeRegistrar either through `Balm.menuTypes(MOD_ID, ModMenuTypes::initialize)` or by registering your mod as a `BalmModule`.

#### Using an Initializer

```java
public class YourMod {

    public static void initialize() {
        Balm.menuTypes(MOD_ID, ModMenuTypes::initialize);
    }

}
```

#### Using `BalmModule`

```java
public class YourMod implements BalmModule {

    @Override
    public void registerMenuTypes(BalmMenuTypeRegistrar menuTypes) {
        ModMenuTypes.initialize(menuTypes);
    }

}
```

## Using the Menu Type

You can then use the menu type in your menu class:

```java
public class YourMenu extends Menu<YourMenu.Data> {

    public YourMenu(int syncId, Inventory inventory, Data data) {
        super(ModMenuTypes.yourMenuType.value(), syncId, inventory, data);
    }

}
```

:::note
Do not try to store `MenuType` instances in your ModMenuTypes class by using `asHolder().value()` in your registration code, as that is too early to access the resolved menu type on NeoForge and Forge.

Store a `Holder<MenuType>` instead and only resolve it once you truly need a `MenuType` instance.
:::
