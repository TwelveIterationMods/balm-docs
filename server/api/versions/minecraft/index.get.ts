import getMinecraftVersions from "~~/server/utils/getMinecraftVersions";

export default defineEventHandler(async (event) => {
  return await getMinecraftVersions()
})
