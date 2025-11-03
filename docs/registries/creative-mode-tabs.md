---
title: Creative Mode Tabs
sidebar_position: 21
---

## Registering Creative Mode Tabs

Creative mode tabs can be registered using a `BalmCreativeModeTabFactory`.

```java
public class ModCreativeModeTabs {

    public static void initialize(BalmCreativeModeTabFactory creativeModeTabs) {
        creativeModeTabs.register("your_creative_mode_tab", builder ->
            builder.title(Component.translatable("itemGroup.your_mod.your_creative_mode_tab"))
                .icon(() -> ModItems.yourItem.createStack())
                .displayItems((parameters, output) -> {
                    output.accept(ModItems.yourItem);
                    output.accept(ModBlocks.yourBlock);
                })
        );
    }
}
```

You can obtain a BalmCreativeModeTabFactory either through `Balm.creativeModeTabs(MOD_ID, ModCreativeModeTabs::initialize)` or by registering your mod as a `BalmModule`.

#### Using an Initializer

```java
public class YourMod {

    public static void initialize() {
        Balm.creativeModeTabs(MOD_ID, ModCreativeModeTabs::initialize);
    }

}
```

#### Using `BalmModule`

```java
public class YourMod implements BalmModule {

    @Override
    public void registerCreativeModeTabs(BalmCreativeModeTabFactory creativeModeTabs) {
        ModCreativeModeTabs.initialize(creativeModeTabs);
    }

}
```
