import getLatestMinecraftVersion from "~~/server/utils/getLatestMinecraftVersion";

export default defineEventHandler(async (event) => {
  return {
    version: await getLatestMinecraftVersion(),
  };
});