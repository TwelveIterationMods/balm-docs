import getBalmMinecraftVersions from "~~/server/utils/getBalmMinecraftVersions";

export default defineEventHandler(async (event) => {
  return await getBalmMinecraftVersions()
})
