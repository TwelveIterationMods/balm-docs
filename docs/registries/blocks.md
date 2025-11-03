---
title: Blocks
---

# Registering Blocks

Blocks can be registered using a `BalmBlockFactory`.

```java
public class ModBlocks {

    public static DeferredBlock yourBlock;

    public static void initialize(BalmBlockFactory blocks) {
        yourBlock = blocks.register("your_block", YourBlock::new, it -> it.sound(SoundType.WOOD).strength(2.5f))
            .withDefaultItem()
            .asDeferredBlock();
    }
}
```

You can obtain a BalmBlockFactory either through `Balm.blocks(MOD_ID, ModBlocks::initialize)` or by registering your mod as a `BalmModule`.

#### Using an Initializer

```java
public class YourMod {

    public static void initialize() {
        Balm.blocks(MOD_ID, ModBlocks::initialize);
    }

}
```

#### Using `BalmModule`

```java
public class YourMod implements BalmModule {

    @Override
    public void registerBlocks(BalmBlockFactory blocks) {
        ModBlocks.initialize(blocks);
    }

}
```

## Custom BlockItems

When using `withDefaultItem`, Balm will automatically register an item for your block based on the `BlockItem` class.

You can specify your own class and item properties by using `withItem` instead.

```java
public class ModBlocks {

    public static DeferredBlock yourBlock;

    public static void initialize(BalmBlockFactory blocks) {
        yourBlock = blocks.register("your_block", YourBlock::new, it -> it.sound(SoundType.WOOD).strength(2.5f))
            .withItem(YourBlockItem::new)
            .asDeferredBlock();
    }
}
```

## Discriminated Blocks

Balm also provides a way to register blocks that are discriminated by a property, such as an enum like `DyeColor`. This is useful for registering multiple variants of a block that share the same properties.

```java
public class ModBlocks {

    public static DiscriminatedBlocks<DyeColor> ovens;

    public static void initialize(BalmBlockFactory blocks) {
        ovens = blocks.registerDiscriminated(DyeColor.values(),
                        it -> DiscriminatedBlocks.prefix(it, "oven"),
                        OvenBlock::new,
                        it -> it.sound(SoundType.METAL).strength(5f, 10f))
                .forEach(it -> it.withDefaultItem())
                .asDiscriminatedBlocks();
    }
}
```

You can then easily look up the blocks using the discriminator value:

```java
Block redOven = ovens.get(DyeColor.RED);
```

## Deferred Blocks

Registration of blocks is not always instant, as it may be delayed by the mod loader - that's why you can't get a proper Block instance right away.
While blocks are technically safe to instantiate early and register later (and you could do that by passing a Supplier to an instance you constructed yourself), Balm chooses to instantiate the block only at the time of registration as that seems to be the most future-proof way that avoids caveats of incomplete registry states.

Most of the time you don't actually need to store or access a block instance directly. Instead, Balm provides a `DeferredBlock` class that implements 

- `BlockLike`, a Balm interface that gives you access to `defaultBlockState()`
- `ItemLike`, which can be used in calls where an `ItemLike` is expected
- `Holder<Block>`, which can be used in calls where a `Holder<Block>` is expected
- `createStack(int count)`, a utility for creating an item stack from the block

This should cover most uses of what would otherwise be a `Block` instance. If you do need a Block instance after all (some `Level` calls and data generators expect it), you can use `asBlock()` in those calls to resolve the block.

:::note
Do not try to store `Block` instances in your ModBlocks class by using `asDeferredBlock().asBlock()` or `asHolder().value()` in your registration code, as that is too early to access the resolved block on NeoForge and Forge.

Store a `DeferredBlock` instance or `Holder<Block>` instead and only resolve it once you truly need a `Block` instance.
:::