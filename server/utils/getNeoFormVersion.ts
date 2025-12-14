export default async function (minecraft: string) {
  const response = await fetch(
    'https://maven.neoforged.net/api/maven/versions/releases/net/neoforged/neoform'
  )
  const json = await response.json()
  // NeoForm versions are prefixed with the full Minecraft version
  const versions = json.versions.filter((it: string) =>
    it.startsWith(minecraft + '-')
  )
  const version = versions[versions.length - 1]
  return version
}
