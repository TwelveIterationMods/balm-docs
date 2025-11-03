---
title: Entities
sidebar_position: 40
---

## Registering Entities

Entities can be registered using a `BalmEntityTypeRegistrar`.

```java
public class ModEntities {

    public static Holder<EntityType<YourEntity>> yourEntity;

    public static void initialize(BalmEntityTypeRegistrar entityTypes) {
        yourEntity = entityTypes.register("your_entity", () -> EntityType.Builder.of(YourEntity::new, MobCategory.MISC))
            .withDefaultAttributes(it -> it.add(Attributes.ATTACK_DAMAGE, 2f))
            .asHolder();
    }

}
```

You can obtain a BalmEntityTypeRegistrar either through `Balm.entityTypes(MOD_ID, ModEntities::initialize)` or by registering your mod as a `BalmModule`.

#### Using an Initializer

```java
public class YourMod {

    public static void initialize() {
        Balm.entityTypes(MOD_ID, ModEntities::initialize);
    }

}
```

#### Using `BalmModule`

```java
public class YourMod implements BalmModule {

    @Override
    public void registerEntityTypes(BalmEntityTypeRegistrar entityTypes) {
        ModEntities.initialize(entityTypes);
    }

}
```
