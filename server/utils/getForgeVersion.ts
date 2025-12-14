export default async function (minecraft: string) {
    const response = await fetch('https://files.minecraftforge.net/net/minecraftforge/forge/promotions_slim.json');
    const json = await response.json();
    const recommendedVersion = json['promos'][minecraft + '-recommended'];
    const latestVersion = json['promos'][minecraft + '-latest'];
    if (recommendedVersion) {
        return recommendedVersion;
    } else if (latestVersion) {
        return latestVersion;
    }
    return null;
};
