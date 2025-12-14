---
seo:
  title: Balm Documentation
  description: Learn how to use Balm, the Multi-Loader library for Minecraft Mods.
---

::u-page-hero{class="dark:bg-gradient-to-b from-neutral-900 to-neutral-950"}
---
orientation: horizontal
---
#top
:hero-background

#title
Build [Multi-Loader]{.text-primary} Minecraft Mods.

#description
Use a single code base to release for NeoForge, Fabric and Forge.

#links
  :::u-button
  ---
  to: /getting-started
  size: xl
  trailing-icon: i-lucide-arrow-right
  ---
  Getting Started
  :::

  :::u-button
  ---
  icon: i-simple-icons-discord
  color: neutral
  variant: outline
  size: xl
  to: https://discord.gg/36qHFMNgAh
  target: _blank
  ---
  Join the Discord
  :::

#default
  :::prose-pre
  ---
  code: |
    repositories {
      maven {
        url = 'https://maven.twelveiterations.com/repository/maven-public/'
        content {
          includeGroup 'net.blay09.mods'
        }
      }
    }

    dependencies {
      implementation("net.blay09.mods:balm-common:${balm_version}")
    }
  filename: build.gradle
  ---

  ```groovy [build.gradle]
  repositories {
    maven {
      url = 'https://maven.twelveiterations.com/repository/maven-public/'
      content {
        includeGroup 'net.blay09.mods'
      }
    }
  }

  dependencies {
    implementation("net.blay09.mods:balm-common:${balm_version}")
  }
  ```
  :::
::

::u-page-section{class="dark:bg-neutral-950"}
#title
Mod Loader Abstractions

#links
  :::u-button
  ---
  color: neutral
  size: lg
  to: /getting-started/content
  trailingIcon: i-lucide-arrow-right
  variant: subtle
  ---
  Explore Content Guides
  :::

#features
  :::u-page-feature
  ---
  icon: i-lucide-package
  ---
  #title
  Registries

  #description
  Use builder-style helpers to easily register content without having to worry about mod loader lifecycles or differences.
  :::

  :::u-page-feature
  ---
  icon: i-lucide-zap
  ---
  #title
  Events

  #description
  Balm provides mappings for the most commonly used events, hooking into native mod loaders where possible, for maximum compatibility.
  :::

  :::u-page-feature
  ---
  icon: i-lucide-settings
  ---
  #title
  Configs

  #description
  Simple annotation-based mod configs with support for synced configs and various config screen implementations.
  :::

  :::u-page-feature
  ---
  icon: i-lucide-network
  ---
  #title
  Networking

  #description
  Register packets in a single call. Seamlessly open menus with extra data. Ensure client protocols are up-to-date using network versions.
  :::

  :::u-page-feature
  ---
  icon: i-lucide-database
  ---
  #title
  Data Attachments, Capabilities, and more

  #description
  Integrate and benefit from mod loader concepts such as Data Attachments, Capabilities, Permissions and more, all through common code.
  :::

  :::u-page-feature
  ---
  icon: i-lucide-blocks
  ---
  #title
  Extensible

  #description
  Use Platform Proxies to write loader-specific code for an interface without worrying about service loaders or annotation magic.
  :::
::

::u-page-section{class="dark:bg-neutral-950"}
#title
Mod Integrations & Utilities

#links
  :::u-button
  ---
  color: neutral
  size: lg
  to: /utilities/quick-move-stack
  trailingIcon: i-lucide-arrow-right
  variant: subtle
  ---
  Explore Utilities
  :::

#features
  :::u-page-feature
  ---
  icon: i-lucide-square-scissors
  ---
  #title
  Recipe Viewer Mods

  #description
  Define recipe displays and transfer handlers for support in recipe viewers like JEI with one simple builder-style API.
  :::

  :::u-page-feature
  ---
  icon: i-lucide-wallpaper
  ---
  #title
  Information HUD Mods

  #description
  Define information to show up in HUD mods like Jade through a common block info API.
  :::

  :::u-page-feature
  ---
  icon: i-lucide-gem
  ---
  #title
  Accessory Mods

  #description
  Check whether your items are worn as an accessory in mods like Curios or Trinkets with one unified call.
  :::

  :::u-page-feature
  ---
  icon: i-lucide-droplet
  ---
  #title
  Containers, Fluids and Energy

  #description
  Use inbuilt classes to define containers, fluid tanks and energy storages on your block entities.
  :::

  :::u-page-feature
  ---
  icon: i-lucide-arrow-down-up
  ---
  #title
  Quick Move Stack

  #description
  Specify how items should move in your menu when shift-clicked in a declarative way.
  :::

  :::u-page-feature
  ---
  icon: i-lucide-loader-circle
  ---
  #title
  Progress Renderers

  #description
  Define segmented progress renderers for screens without relying on messy math and branching.
  :::
::

::u-page-section{class="dark:bg-gradient-to-b from-neutral-950 to-neutral-900"}
  :::u-page-c-t-a
  ---
  links:
    - label: Getting Started
      to: '/getting-started'
      trailingIcon: i-lucide-arrow-right
    - label: Template Repository
      to: 'https://github.com/TwelveIterationMods/balm-mod'
      target: _blank
      variant: subtle
      icon: i-simple-icons-github
  title: Ready to build for multiple loaders?
  description: Get started with our guides or jump straight into a template repository.
  class: dark:bg-neutral-950
  ---

  :stars-bg
  :::
::
