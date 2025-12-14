export default async function () {
  const response = await fetch(
    "https://piston-meta.mojang.com/mc/game/version_manifest_v2.json",
  );
  if (!response.ok) {
    throw new Error("failed to fetch minecraft version manifest");
  }

  const json = await response.json();
  return json.latest.release;
}
