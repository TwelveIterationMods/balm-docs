import getLatestMinecraftVersion from '~~/server/utils/getLatestMinecraftVersion'

export default defineEventHandler(async () => {
  return {
    version: await getLatestMinecraftVersion()
  }
})
