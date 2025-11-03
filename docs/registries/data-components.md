---
title: Data Components
sidebar_position: 22
---

## Registering Data Components

Data components can be registered using a `BalmDataComponentTypeFactory`.

```java
public class ModDataComponents {

    public static Holder<DataComponentType<Unit>> yourDataComponent;

    public static void initialize(BalmDataComponentTypeFactory dataComponentTypes) {
        yourDataComponent = dataComponentTypes.register("your_data_component", Codec.unit(Unit.INSTANCE)).asHolder();
    }

}
```

You can obtain a BalmDataComponentTypeFactory either through `Balm.dataComponentTypes(MOD_ID, ModDataComponents::initialize)` or by registering your mod as a `BalmModule`.

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
    public void registerDataComponents(BalmDataComponentTypeFactory dataComponentTypes) {
        ModDataComponents.initialize(dataComponentTypes);
    }

}
```
