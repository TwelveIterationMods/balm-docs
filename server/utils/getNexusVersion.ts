import searchNexus from "./searchNexus";

export default async function (minecraft: string, artifact: string) {
  const repository = "maven-releases";
  let versionPrefix = minecraft.substring(2) + ".*";
  if (minecraft == "1.20.1" && artifact == "balm-common") {
    versionPrefix = "7.*";
  } else if (minecraft == "1.21.1" && artifact == "balm-common") {
    versionPrefix = "21.0.*";
  }
  const versions = await searchNexus(
    repository,
    "net.blay09.mods",
    artifact,
    versionPrefix,
  );
  const jars = versions.map((version) => {
    const jarAsset = version.assets.find(
      (asset) =>
        asset.contentType == "application/java-archive" &&
        asset.maven2.extension === "jar" &&
        !asset.maven2.classifier,
    );
    const parts = version.name.split("-");
    let gameVersion =
      "1." + version.version.split("-")[0]!.split(".").slice(0, 2).join(".");
    if (gameVersion.endsWith(".0")) {
      gameVersion = gameVersion.slice(0, -2);
    }
    return {
      name: parts[0]!,
      loader: parts[1]!,
      gameVersion,
      version: version.version,
      downloadUrl:
        jarAsset?.downloadUrl
          .replace("maven-snapshots", "maven-public")
          .replace("maven-releases", "maven-public") ?? "",
      fileSize: jarAsset?.fileSize ?? 0,
      lastModified: jarAsset?.lastModified ?? new Date().toISOString(),
    };
  });
  return jars[0]?.version;
}
