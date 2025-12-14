export default async function (minecraft: string) {
    const response = await fetch('https://maven.neoforged.net/api/maven/versions/releases/net/neoforged/neoforge');
    const json = await response.json();
    // NeoForge versions map to Minecraft versions by the major and patch
    const versionPrefix = minecraft.replace(/^1\./, '');
    const versions = json.versions.filter((it: any) => it.startsWith(versionPrefix));
    const version = versions[versions.length - 1];
    return version;
};
