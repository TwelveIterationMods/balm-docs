<script lang="ts">
/**
 * MIT License

Copyright (c) 2023 NuxtLabs

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

import type { AppConfig } from '@nuxt/schema'
import theme from '#build/ui/prose/pre'
import type { IconProps, ComponentConfig } from '@nuxt/ui'
</script>

<script setup lang="ts">
import { computed } from 'vue'
import { useClipboard, watchDebounced } from '@vueuse/core'
import { useAppConfig } from '#imports'
import { useLocale } from '@nuxt/ui/composables/useLocale'
import { tv } from '@nuxt/ui/utils/tv'

type ProsePre = ComponentConfig<typeof theme, AppConfig, 'pre', 'ui.prose'>

interface ProsePreProps {
  icon?: IconProps['name']
  code?: string
  language?: string
  filename?: string
  highlights?: number[]
  hideHeader?: boolean
  meta?: string
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  class?: any
  ui?: ProsePre['slots']
}

interface ProsePreSlots {
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-empty-object-type */
  default(props?: {}): any
}

const props = defineProps<ProsePreProps>()
defineSlots<ProsePreSlots>()

const { t } = useLocale()
const { copy, copied } = useClipboard()
const appConfig = useAppConfig() as ProsePre['AppConfig']

// eslint-disable-next-line vue/no-dupe-keys
const ui = computed(() =>
  tv({ extend: tv(theme), ...(appConfig.ui?.prose?.pre || {}) })()
)

const { data: versions } = useLazyFetch<string[]>('/api/versions/minecraft/supported')
const files = ['build.gradle', 'gradle.properties', 'libs.versions.toml']
const file = ref('build.gradle')
const minecraftVersion = ref('')
const balmVersion = ref('${balm_version}')
onMounted(() => {
  watch(versions, () => {
    if (versions.value && !minecraftVersion.value) {
      minecraftVersion.value = versions.value[0] ?? ''
    }
  }, { immediate: true })

  watchDebounced(minecraftVersion, async () => {
    const balm = await $fetch(`/api/versions/balm/latest?minecraft=${minecraftVersion.value}`)
    balmVersion.value = balm.version ?? '${balm_version}'
  })
})

const effectiveCode = computed(() => {
  if (file.value === 'libs.versions.toml') {
    return '```toml\n' + `[versions]
balm = "${balmVersion.value}"

[libraries]
balmCommon = { module = "net.blay09.mods:balm-common", version.ref = "balm" }
balmNeoForge = { module = "net.blay09.mods:balm-neoforge", version.ref = "balm" }
balmFabric = { module = "net.blay09.mods:balm-fabric", version.ref = "balm" }
balmForge = { module = "net.blay09.mods:balm-forge", version.ref = "balm" }` + '\n```'
  } else if (file.value === 'gradle.properties') {
    return '```properties\n' + `balm_version = ${balmVersion.value}` + '\n```'
  }

  return '```groovy\n' + props.code?.replace('${balm_version}', balmVersion.value) + '\n```'
})
</script>

<template>
  <div :class="ui.root({ class: [props.ui?.root], filename: !!filename })">
    <div
      v-if="filename && !hideHeader"
      :class="ui.header({ class: props.ui?.header })"
    >
      <UIcon
        name="i-vscode-icons-file-type-gradle"
        :class="ui.icon({ class: props.ui?.icon })"
      />

      <!-- <span :class="ui.filename({ class: props.ui?.filename })">{{
        filename
      }}</span> -->
      <USelect
        v-model="file"
        :items="files"
        class="w-auto"
        variant="ghost"
      />

      <div
        v-if="versions?.length"
        class="ml-auto mr-8"
      >
        <USelect
          v-model="minecraftVersion"
          :items="versions"
          variant="ghost"
          class="w-auto"
        />
      </div>
    </div>

    <UButton
      :icon="copied ? appConfig.ui.icons.copyCheck : appConfig.ui.icons.copy"
      color="neutral"
      variant="outline"
      size="sm"
      :aria-label="t('prose.pre.copy')"
      :class="ui.copy({ class: props.ui?.copy })"
      tabindex="-1"
      @click="copy(effectiveCode || '')"
    />

    <pre
      :class="ui.base({ class: [props.ui?.base, props.class] })"
      v-bind="$attrs"
    ><MDC
:value="effectiveCode"
          class="innerCode"
    /></pre>
  </div>
</template>

<style>
.shiki span.line {
  display: block;
}

.shiki span.line.highlight {
  margin: 0 -16px;
  padding: 0 16px;

  @apply bg-(--ui-bg-accented)/50;
}

.innerCode {
    div {
        margin: 0;
    }
    pre {
        border: none;
        padding: 0;
    }
    button {
        display: none;
    }
}
</style>
