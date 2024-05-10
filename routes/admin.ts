import mongoose from "mongoose";
import {
  cloudinaryPicturesUpload,
  insertDungeonsFixtures,
  insertSlotsFixtures,
  insertStuffTypesFixtures,
  insertItemsFixtures,
  extractDungeonFromURL,
  Item,
} from "../populate";

type ItemExtractOption = {
  dungeons: { name: string; url: string }[];
  uploadPictures: { name: string; url: string }[];
};

export async function itemsExtract(
  options: ItemExtractOption
): Promise<{ status: "success" | "error"; obj?: any; total?: number }> {
  try {
    await mongoose.connect(process.env.MONGO_URL!, {
      dbName: process.env.MONGO_DB_NAME,
    });

    let allItems: Item[] = [];

    for (const dungeon of options.dungeons) {
      const extracted = await extractDungeonFromURL(dungeon.url);
      allItems.push(...extracted);
    }

    if (options.uploadPictures) {
      allItems = await cloudinaryPicturesUpload(allItems);
    }

    await insertDungeonsFixtures();
    await insertSlotsFixtures();
    await insertStuffTypesFixtures();
    await insertItemsFixtures(allItems);

    return { status: "success", total: allItems.length };
  } catch (e: unknown) {
    return { status: "error", obj: e };
  } finally {
    await mongoose.connection.close();
  }
}
