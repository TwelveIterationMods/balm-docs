<script setup lang="ts">
import JSZip from "jszip";
import { Eta } from "eta";
import { z } from "zod";
import { watchDebounced } from "@vueuse/core";

const props = withDefaults(defineProps<{
  advanced?: boolean;
}>(), {
  advanced: false
});

const eta = new Eta({ autoTrim: false });

const etaTemplates = import.meta.glob("../../assets/templates/bdk/**/*.eta", {
  query: "?raw",
  import: "default",
  eager: true,
}) as Record<string, string>;

type LibraryVersions = {
  neoforge: string | null;
  neoform: string | null;
  fabric: {
    apiVersion: string | null;
    loaderVersion: string | null;
  } | null;
  forge: string | null;
  balm: string | null;
  java: string | null;
  "kuma-api": string | null;
} | null;

type TemplateProperties = {
  projectName: string;
  modId: string;
  group: string;
  minecraftVersion: string;
  neoforge: boolean;
  fabric: boolean;
  forge: boolean;
  libraryVersions: LibraryVersions;
};

type ExpandedTemplateProperties = TemplateProperties & {
  mainClass: string;
  package: string;
  modVersion: string;
};

const { data: supportedVersions, status: supportedVersionsStatus } =
  useLazyFetch<string[]>("/api/versions/minecraft/supported");

const form = reactive({
  projectName: "New Mod",
  modId: undefined as string | undefined,
  group: "com.example",
  minecraftVersion: "",
  neoforge: true,
  fabric: true,
  forge: true,
});

onMounted(() => {
  watchEffect(() => {
    if (supportedVersions.value && !form.minecraftVersion) {
      form.minecraftVersion = supportedVersions.value[0] ?? "";
    }
  });
});

const isGenerating = ref(false);
const errorMessage = ref<string | null>(null);
const libraryVersions = ref<LibraryVersions>(null);
const libraryVersionsPending = ref(false);

const schema = z.object({
  projectName: z.string().trim().min(1, "Project name is required."),
  modId: z
    .string()
    .trim()
    .min(1, "Mod ID is required.")
    .regex(
      /^[a-z0-9_]+$/,
      "Mod ID may only contain lowercase letters, numbers and underscores.",
    )
    .optional(),
  group: z
    .string()
    .trim()
    .min(1, "Group is required.")
    .regex(
      /^[a-zA-Z_][a-zA-Z0-9_.]*$/,
      "Group must be a valid Java package identifier.",
    ),
  minecraftVersion: z.string().trim().min(1, "Minecraft version is required."),
});

const recommendedModId = computed(() =>
  form.projectName
    .toLowerCase()
    .replace(/[^a-z0-9_\-]+/g, "")
    .replace(/^[_\-]+|[_\-]+$/g, ""),
);
const isCustomModId = computed(
  () => form.modId && form.modId != recommendedModId.value,
);
const recommendedPackage = computed(
  () => `${form.group}.${form.modId ?? recommendedModId.value}`,
);

watchDebounced(
  () => form.minecraftVersion,
  async (version) => {
    if (!version) {
      libraryVersions.value = null;
      return;
    }

    try {
      libraryVersionsPending.value = true;
      libraryVersions.value = null;
      libraryVersions.value = await $fetch("/api/versions/latest", {
        params: { minecraft: version },
      });
      if (!libraryVersions.value?.neoforge) {
        form.neoforge = false;
      }
    } catch (err: any) {
      console.error("Failed to load latest library versions", err);
      libraryVersions.value = null;
    } finally {
      libraryVersionsPending.value = false;
    }
  },
);

function render(template: string, data: ExpandedTemplateProperties) {
  return eta.renderString(template, data);
}

function addProjectFiles(zip: JSZip, data: TemplateProperties) {
  const root = zip.folder("")!;

  const prefix = "../../assets/templates/bdk/";
  const groupPath = data.group.replace(/\./g, "/") + "/" + data.modId;
  const mainClass = data.projectName
    .trim()
    .split(/\s+|[_-]/g)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join("");

    console.log(etaTemplates)
  for (const [path, template] of Object.entries(etaTemplates)) {
    const relative = path.startsWith(prefix) ? path.slice(prefix.length) : path;
    let outputPath = relative.replace(/\.eta$/, "");

    const isFabricFile = relative.startsWith("fabric/");
    const isForgeFile = relative.startsWith("forge/");
    const isNeoforgeFile = relative.startsWith("neoforge/");
    if ((isFabricFile && !data.fabric) || (isForgeFile && !data.forge) || (isNeoforgeFile && !data.neoforge)) {
      console.log("skipping " + outputPath)
      continue;
    }

    // Adjust Java source paths to include the derived package path
    if (groupPath) {
      const commonPrefix = "common/src/main/java/";
      const fabricPrefix = "fabric/src/main/java/";
      const forgePrefix = "forge/src/main/java/";
      const neoforgePrefix = "neoforge/src/main/java/";

      if (outputPath.startsWith(commonPrefix)) {
        const rest = outputPath.slice(commonPrefix.length);
        outputPath = `${commonPrefix}${groupPath}/${rest}`;
      } else if (outputPath.startsWith(fabricPrefix)) {
        const rest = outputPath.slice(fabricPrefix.length);
        outputPath = `${fabricPrefix}${groupPath}/${rest}`;
      } else if (outputPath.startsWith(forgePrefix)) {
        const rest = outputPath.slice(forgePrefix.length);
        outputPath = `${forgePrefix}${groupPath}/${rest}`;
      } else if (outputPath.startsWith(neoforgePrefix)) {
        const rest = outputPath.slice(neoforgePrefix.length);
        outputPath = `${neoforgePrefix}${groupPath}/${rest}`;
      }
    }

    // Ensure git files are dot-prefixed at the root
    if (outputPath === "gitignore") {
      outputPath = ".gitignore";
    } else if (outputPath === "gitattributes") {
      outputPath = ".gitattributes";
    }

    // Prefix any mixins.json files with the mod id
    if (outputPath.endsWith("mixins.json")) {
      const lastSlash = outputPath.lastIndexOf("/");
      const dir = lastSlash >= 0 ? outputPath.slice(0, lastSlash + 1) : "";
      const file =
        lastSlash >= 0 ? outputPath.slice(lastSlash + 1) : outputPath;
      outputPath = `${dir}${data.modId}.${file}`;
    }

    if (outputPath.includes("MainClass")) {
      outputPath = outputPath.replace("MainClass", mainClass);
    }

    console.log('adding file')
    root.file(
      outputPath,
      render(template, {
        ...data,
        mainClass,
        package: data.group + "." + data.modId,
        modVersion: data.minecraftVersion.replaceAll(/^1\./g, "").replaceAll(/([0-9]+\.[0-9]+)[.-].+/g, "$1") + ".0"
      }),
    );
  }
}

async function generateProject() {
  errorMessage.value = null;
  const result = schema.safeParse({ ...form });
  if (!result.success) {
    errorMessage.value = z.prettifyError(result.error);
    return;
  }

  isGenerating.value = true;

  try {
    const zip = new JSZip();
    addProjectFiles(zip, {
      projectName: form.projectName,
      minecraftVersion: form.minecraftVersion,
      modId: form.modId || recommendedModId.value,
      group: form.group,
      neoforge: form.neoforge,
      fabric: form.fabric,
      forge: form.forge,
      libraryVersions: libraryVersions.value,
    });

    const blob = await zip.generateAsync({ type: "blob" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${form.modId || recommendedModId.value}.zip`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  } catch (err: any) {
    errorMessage.value = err?.message || "Failed to generate project.";
    console.error(err)
  } finally {
    isGenerating.value = false;
  }
}
</script>

<template>
  <UForm
    :schema="schema"
    :state="form"
    class="space-y-4"
    @submit="generateProject"
  >
    <div class="flex gap-4">
      <div class="space-y-4">
        <UFormField label="Project Name" name="projectName">
          <UInput v-model="form.projectName" />
        </UFormField>

        <UFormField label="Artifact Group" name="group">
          <div class="flex gap-2 items-center">
            <UInput v-model="form.group" />
            <UTooltip
              text="Either a domain you own in reverse notation, or your username."
              :delay-duration="0"
            >
              <UButton
                icon="lucide:circle-question-mark"
                color="neutral"
                variant="ghost"
                size="sm"
              />
            </UTooltip>
          </div>
        </UFormField>

        <UFormField label="Minecraft Version" name="minecraftVersion">
          <USelect
            v-model="form.minecraftVersion"
            :items="supportedVersions"
            :loading="supportedVersionsStatus === 'pending'"
            class="w-full"
          />
        </UFormField>

        <template v-if="advanced">
          <template v-if="libraryVersions">
            <div class="flex gap-2 items-center">
              <UCheckbox label="Balm" :model-value="true" disabled />
              <span class="text-xs text-muted">{{ libraryVersions.balm }}</span>
            </div>

            <USeparator />

            <div class="flex gap-2 items-center">
              <UCheckbox label="NeoForge" v-model="form.neoforge" />
              <span class="text-xs text-muted">{{
                libraryVersions.neoforge
              }}</span>
            </div>

            <div class="flex gap-2 items-center">
              <UCheckbox label="Fabric" v-model="form.fabric" />
              <span class="text-xs text-muted">{{
                libraryVersions.fabric?.apiVersion
              }}</span>
            </div>

            <div class="flex gap-2 items-center">
              <UCheckbox label="Forge" v-model="form.forge" />
              <span class="text-xs text-muted">{{
                libraryVersions.forge
              }}</span>
            </div>
          </template>
          <template v-else-if="libraryVersionsPending">
            <div class="flex gap-2 items-center text-muted">
              <USkeleton class="h-4 w-4 rounded-sm" />
              Loading...
            </div>
          </template>
        </template>
      </div>
      <div class="space-y-4">
        <UFormField label="Mod ID" name="modId">
          <UInput
            class="w-lg"
            v-model="form.modId"
            :variant="isCustomModId ? 'outline' : 'ghost'"
            :placeholder="recommendedModId"
          />
          <ULink
            v-if="isCustomModId"
            as="button"
            class="ml-2 text-sm"
            @click="form.modId = undefined"
          >
            Reset to Default
          </ULink>
        </UFormField>

        <UFormField label="Package" name="package">
          <UInput
            class="w-lg"
            style="color: var(--ui-text-dimmed)"
            :value="recommendedPackage"
            variant="none"
            readonly
          />
        </UFormField>
      </div>
    </div>

    <div v-if="errorMessage" class="text-error">
      {{ errorMessage }}
    </div>

    <UButton type="submit" :loading="libraryVersionsPending || isGenerating || !libraryVersions">
      Download Template (.zip)
    </UButton>
  </UForm>
</template>
