---
title: Declarative Quick Move Stack
---

# Declarative Quick Move Stack

Balm provides a utility for declaratively defining quick move behaviour in container menus.

`QuickMove` lets you:

- Define named slot ranges (e.g., `container`, `player`, `inventory`, `hotbar`).
- Specify routing rules for how items move between these ranges.
- Avoid having to implement your own error-prone `AbstractContainerMenu#quickMoveStack` implementation

## Usage Example

This example defines a single slot named "input" with index 1, and three water bucket slots with indices [2, 3, 4].

It then defines two routes: 

- one that makes shift-clicking items in the inventory or hotbar move into the input slot if they're obsidian
- and one that makes shift-clicking items in the inventory or hotbar move into the water bucket slots if they're water buckets

QuickMove also provides a default route for moving items from the container slots to the player slots.

```java
public class MyMenu extends AbstractContainerMenu {
    private final QuickMove.Routing quickMove;

    public MyMenu(int id, Inventory playerInv) {
        super(ModMenus.MY_MENU.get(), id);

        // ... add container slots and player slots ...

        this.quickMove = QuickMove.create(this, this::moveItemStackTo)
                .slot("input", 1)
                .slotRange("waterBuckets", 2, 5)
                .route(it -> it.is(Items.OBSIDIAN), QuickMove.PLAYER, "input")
                .route(it -> it.is(Items.WATER_BUCKET), QuickMove.PLAYER, "water")
                .build();
    }

    @Override
    public ItemStack quickMoveStack(Player player, int index) {
        return quickMove.transfer(this, player, index);
    }
}
```

The `create(AbstractContainerMenu, MoveItemStackTo)` variant assumes the last 36 slots belong to the player (27 inventory + 9 hotbar). If your layout differs, use `create(MoveItemStackTo)` and define all slot ranges manually.
