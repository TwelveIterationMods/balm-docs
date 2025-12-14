import getNeoForgeVersion from '~~/server/utils/getNeoForgeVersion'
import getNeoFormVersion from '~~/server/utils/getNeoFormVersion'
import getForgeVersion from '~~/server/utils/getForgeVersion'
import getFabricVersion from '~~/server/utils/getFabricVersion'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const minecraft = query.minecraft as string
  if (!minecraft || typeof minecraft !== 'string') {
    throw createError({
      statusCode: 400,
      statusMessage: 'minecraft should be a string'
    })
  }

  return {
    'neoforge': await getNeoForgeVersion(minecraft),
    'neoform': await getNeoFormVersion(minecraft),
    'fabric': await getFabricVersion(minecraft),
    'forge': await getForgeVersion(minecraft),
    'balm': await getNexusVersion(minecraft, 'balm-common'),
    'java': '21',
    'kuma-api': await getNexusVersion(minecraft, 'kuma-api-common')
  }
})
