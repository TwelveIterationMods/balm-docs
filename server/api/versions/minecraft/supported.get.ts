import getBalmMinecraftVersions from '~~/server/utils/getBalmMinecraftVersions'

export default defineEventHandler(async () => {
  return await getBalmMinecraftVersions()
})
