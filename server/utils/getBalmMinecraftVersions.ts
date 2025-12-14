import compareVersion from './compareVersion'

export default async function () {
  const result = [] as string[]
  const legacyVersions = {
    // '1.20.1': '7.*', not supported by project generator and pretty old anyways
    '1.21.1': '21.0.*',
    '1.21.11': '21.11.*'
  }
  for (const [version, classifier] of Object.entries(legacyVersions)) {
    const versions = await searchNexus('maven-releases', 'net.blay09.mods', 'balm-common', classifier)
    if (versions.length) {
      result.push(version)
    }
  }

  return result.sort(compareVersion)
}
