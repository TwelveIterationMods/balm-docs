<script setup lang="ts">
definePageMeta({
  layout: 'docs'
})

useSeoMeta({
  title: 'Balm Project Generator',
  ogTitle: 'Balm Project Generator',
  description: 'Generate a multi-loader project setup using Balm.',
  ogDescription: 'Generate a multi-loader project setup using Balm.'
})
</script>

<template>
  <UPage>
    <UPageHeader
      title="Balm Project Generator"
      description="Generate a multi-loader project setup using Balm."
    />

    <UPageBody>
      <BalmProjectGenerator :advanced="true" />
    </UPageBody>
  </UPage>
</template>
