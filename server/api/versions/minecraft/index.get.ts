import getMinecraftVersions from '~~/server/utils/getMinecraftVersions'

export default defineEventHandler(async () => {
  return await getMinecraftVersions()
})
