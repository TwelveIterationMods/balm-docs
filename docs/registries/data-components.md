---
title: Data Components
sidebar_position: 21
---

## Registering Data Components

Data components can be registered using a `BalmDataComponentTypeRegistrar`.

```java
public class ModDataComponents {

    public static Holder<DataComponentType<Unit>> yourDataComponent;

    public static void initialize(BalmDataComponentTypeRegistrar dataComponentTypes) {
        yourDataComponent = dataComponentTypes.register("your_data_component", Codec.unit(Unit.INSTANCE)).asHolder();
    }

}
```

You can obtain a BalmDataComponentTypeRegistrar either through `Balm.dataComponentTypes(MOD_ID, ModDataComponents::initialize)` or by registering your mod as a `BalmModule`.

#### Using an Initializer

```java
public class YourMod {

    public static void initialize() {
        Balm.dataComponentTypes(MOD_ID, ModDataComponents::initialize);
    }

}
```

#### Using `BalmModule`

```java
public class YourMod implements BalmModule {

    @Override
    public void registerDataComponents(BalmDataComponentTypeRegistrar dataComponentTypes) {
        ModDataComponents.initialize(dataComponentTypes);
    }

}
```
