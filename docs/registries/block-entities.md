---
title: Block Entities
sidebar_position: 11
---

## Registering Block Entities

Block entities can be registered using a `BalmBlockEntityRegistrar`.

```java
public class ModBlockEntities {

    public static Holder<BlockEntityType<YourBlockEntity>> yourBlockEntity;

    public static void initialize(BalmBlockEntityRegistrar blockEntities) {
        yourBlockEntity = blockEntities.register("your_block_entity", YourBlockEntity::new, ModBlocks.yourBlock).asHolder();
    }
}
```

You can obtain a BalmBlockEntityRegistrar either through `Balm.blockEntities(MOD_ID, ModBlockEntities::initialize)` or by registering your mod as a `BalmModule`.

#### Using an Initializer

```java
public class YourMod {

    public static void initialize() {
        Balm.blockEntities(MOD_ID, ModBlockEntities::initialize);
    }

}
```

#### Using `BalmModule`

```java
public class YourMod implements BalmModule {

    @Override
    public void registerBlockEntities(BalmBlockEntityRegistrar blockEntities) {
        ModBlockEntities.initialize(blockEntities);
    }

}
```

## Using the Block Entity

We're storing `Holder<BlockEntityType<?>>` instead of `BlockEntityType<?>` to account for delayed registration on some mod loaders.

You can resolve the block entity type using `ModBlockEntities.yourBlockEntity.value()`.

:::note
Do not try to store `BlockEntityType<?>` instances in your ModBlockEntities class by using `asHolder().value()` in your registration code, as that is too early to access the resolved block entity type on NeoForge and Forge.

Store a `Holder<BlockEntityType<?>>` instance instead and only resolve it once you truly need a `BlockEntityType<?>` instance.
:::