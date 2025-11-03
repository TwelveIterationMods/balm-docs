---
title: Items
---

# Registering Items

Items can be registered using a `BalmItemFactory`.

```java
public class ModItems {

    public static DeferredItem yourItem;

    public static void initialize(BalmItemFactory items) {
        yourItem = items.register("your_item", YourItem::new).asDeferredItem();
    }
}
```

You can obtain a BalmItemFactory either through `Balm.items(MOD_ID, ModItems::initialize)` or by registering your mod as a `BalmModule`.

#### Using an Initializer

```java
public class YourMod {

    public static void initialize() {
        Balm.items(MOD_ID, ModItems::initialize);
    }

}
```

#### Using `BalmModule`

```java
public class YourMod implements BalmModule {

    @Override
    public void registerItems(BalmItemFactory items) {
        ModItems.initialize(items);
    }

}
```

## Block Items

Block items can also be registered directly alongside the block using `withDefaultItem` or `withItem`. See [Blocks](blocks.md) for more information.

## Deferred Items

Registration of items is not always instant, as it may be delayed by the mod loader - that's why you can't get a proper Item instance right away.
While items are technically safe to instantiate early and register later (and you could do that by passing a Supplier to an instance you constructed yourself), Balm chooses to instantiate the item only at the time of registration as that seems to be the most future-proof way that avoids caveats of incomplete registry states (for example in regards to Data Components, that you would otherwise also need to ensure to be present and ready).

Most of the time you don't actually need to store or access an item instance directly. Instead, Balm provides a `DeferredItem` class that implements 

- `ItemLike`, which can be used in calls where an `ItemLike` is expected
- `Holder<Item>`, which can be used in calls where a `Holder<Item>` is expected
- `createStack(int count)`, a utility for creating an item stack from the item

:::tip
If you were using patterns like `itemStack.is(ModItems.yourItem)`, consider whether an item tag makes sense for your use case. Direct item comparisons often hardcode your mod to only your specific item and limit compatibility.
:::

This should cover most uses of what would otherwise be a `Item` instance. If you do need an Item instance after all (some data generators expect it), you can use `asItem()` in those calls to resolve the item.

:::note
Do not try to store `Item` instances in your ModItems class by using `asDeferredItem().asItem()` or `asHolder().value()` in your registration code, as that is too early to access the resolved item on NeoForge and Forge.

Store a `DeferredItem` instance or `Holder<Item>` instead and only resolve it once you truly need an `Item` instance.
:::