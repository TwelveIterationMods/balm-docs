import getNeoForgeVersion from '~~/server/utils/getNeoForgeVersion'

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
    version: await getNeoForgeVersion(minecraft)
  }
})
