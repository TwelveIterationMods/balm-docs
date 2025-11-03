---
title: Recipe Types
sidebar_position: 50
---

## Registering Recipe Types

Recipe types and their related classes can be registered using a `BalmRecipeTypeFactory`.

```java
public class ModRecipeTypes {

    public static DeferredRecipeType<SingleRecipeInput, YourRecipe> yourRecipes;

    public static void initialize(BalmRecipeTypeFactory recipeTypes) {
        yourRecipes = recipeTypes.register("your_recipes", YourRecipe.class)
            .withSerializer(YourRecipe.Serializer::new)
            .withRecipeBookCategory()
            .asDeferredRecipeType();
    }

}
```

You can obtain a BalmRecipeTypeFactory either through `Balm.recipeTypes(MOD_ID, ModRecipeTypes::initialize)` or by registering your mod as a `BalmModule`.

#### Using an Initializer

```java
public class YourMod {

    public static void initialize() {
        Balm.recipeTypes(MOD_ID, ModRecipeTypes::initialize);
    }

}
```

#### Using `BalmModule`

```java
public class YourMod implements BalmModule {

    @Override
    public void registerRecipeTypes(BalmRecipeTypeFactory recipeTypes) {
        ModRecipeTypes.initialize(recipeTypes);
    }

}
```

## Using the Recipe Type

We're storing `DeferredRecipeType<SingleRecipeInput, YourRecipe>` instead of `RecipeType<YourRecipe>` to account for delayed registration on some mod loaders. Conveniently, this object will also hold references to the serializer and recipe book category if specified.

In your recipe class, you can then use your type as follows:

```java
@Override
public RecipeSerializer<YourRecipe> getSerializer() {
    return ModRecipeTypes.yourRecipes.serializer();
}

@Override
public RecipeType<YourRecipe> getType() {
    return ModRecipeTypes.yourRecipes.type();
}

@Override
public RecipeBookCategory recipeBookCategory() {
    return ModRecipeTypes.yourRecipes.category();
}
```

DeferredRecipeType also provides convenience functions for looking up recipes of its type:

```java
Optional<YourRecipe> foundRecipe = ModRecipeTypes.yourRecipes.getRecipeFor(level, new SingleRecipeInput(itemStack))
```

Note that this will always return an `Optional.empty()` on clients, as recipes are server-side only as of recent Minecraft versions.

:::note
Do not try to store `RecipeType` instances in your ModRecipeTypes class by using `asDeferredRecipeType().type()` or `asHolder().value()` in your registration code, as that is too early to access the resolved recipe type on NeoForge and Forge.

Store a `DeferredRecipeType` instance or `Holder<RecipeType>` instead and only resolve it once you truly need a `RecipeType` instance.
:::
