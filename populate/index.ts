import { chromium } from "playwright";
import type { ElementHandle, Page } from "playwright";
import { v2 as cloudinary } from "cloudinary";
import { ItemSchema } from "../schemas/items";
import { SlotSchema } from "../schemas/slot";
import { DungeonSchema } from "../schemas/dungeon";
import { StuffTypeSchema } from "../schemas/stuff-type";
import {
  DungeonSchemaFixtures,
  SlotSchemaFixtures,
  stuffGearSchemaFixtures,
} from "./fixtures";

export type Item = {
  picture: string;
  pictureUrl: string;
  title: string;
  link: string;
  slot: string;
  gearType: string;
  source: string;
  dungeon: string;
  _id: number;
};

/**
 * Extract gear each items from selector
 */
export async function extractGearItem(
  rows: ElementHandle<SVGElement | HTMLElement>[]
): Promise<Item[]> {
  const items: Item[] = [];
  // Extract items list from table
  for (const row of rows) {
    const item = {} as Item;
    //Extract picture item url
    const pictureElements = await row.$("ins");
    if (pictureElements) {
      const rawUrl = await pictureElements.getAttribute("style");
      if (rawUrl) {
        const mySubString = rawUrl.substring(
          rawUrl.indexOf('"') + 1,
          rawUrl.lastIndexOf('"')
        );
        if (mySubString) {
          const exec = /[^/]*$/.exec(mySubString);
          item.picture = exec ? exec[0] : "";
          item.pictureUrl = mySubString;
        }
      }
    }
    //Extract item id
    const idItem = await row.$(".iconmedium a");
    const id = await idItem?.getAttribute("href");
    if (id) {
      item._id = +id.substring(id.indexOf("=") + 1, id.lastIndexOf("/"));
    }
    //Extract title and wow head link item
    const titleRaw = await row.$(".listview-cleartext");
    if (titleRaw) {
      item.link = (await titleRaw.getAttribute("href")) || "";
      item.title = (await titleRaw.textContent()) || "";
    }
    //Extract slot item
    const slotRaw = await row.$("td:nth-child(9)");
    if (slotRaw) {
      item.slot = (await slotRaw.textContent()) || "";
    }
    //Extract gearType item
    const gearTypeRaw = await row.$("td:last-child");
    if (gearTypeRaw) {
      item.gearType = (await gearTypeRaw.textContent()) || "";
    }
    //Extract source item
    const elem = await row.$("td:nth-child(10)");
    const sourceElem = await elem?.$("> a");
    if (sourceElem) {
      item.source = (await sourceElem.textContent()) || "";
    }
    const dungeonElem = await elem?.$("> div a");
    if (dungeonElem) {
      item.dungeon = (await dungeonElem.textContent()) || "";
    }
    console.log(`${item.title} (${item._id}) successfull extract`);
    items.push(item);
  }
  return items;
}

export async function extractItemsData(page: Page): Promise<Item[]> {
  console.log("Start items extraction ...");
  async function extractRow(): Promise<Item[]> {
    const elements = await page.$$(".listview-mode-default .listview-row");
    console.log(`${elements.length} elements extracted...`);
    return extractGearItem(elements);
  }
  const items: Item[] = [];
  const nextCTA = page.locator(".listview-band-bottom a", {
    hasText: "Suiv. ›",
  });
  items.push(...(await extractRow()));
  do {
    await nextCTA.click();
    items.push(...(await extractRow()));
  } while ((await nextCTA.getAttribute("data-active")) === "yes");
  return items;
}

export async function extractDungeonFromURL(url: string): Promise<Item[]> {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  await page.goto(url);
  await page.locator("#onetrust-accept-btn-handler").click();
  await page.locator("#onetrust-banner-sdk").isHidden();
  await page.waitForSelector(".listview-mode-default");

  const data = await extractItemsData(page);
  //pictureFolder && (await downloadPictures(data, pictureFolder));

  return data;
}

export async function clearCollections(): Promise<void> {
  await ItemSchema.collection.drop();
  await SlotSchema.collection.drop();
  await StuffTypeSchema.collection.drop();
  await DungeonSchema.collection.drop();
}

export async function insertSlotsFixtures() {
  try {
    for await (const slot of DungeonSchemaFixtures) {
      await DungeonSchema.findOneAndUpdate(slot, slot, {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true,
      });
    }
  } catch (err: any) {
    console.log(err);
  }
}

export async function insertDungeonsFixtures() {
  try {
    for await (const slot of SlotSchemaFixtures) {
      await SlotSchema.findOneAndUpdate(slot, slot, {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true,
      });
    }
  } catch (err: any) {
    console.log(err);
  }
}

export async function insertStuffTypesFixtures() {
  try {
    for await (const gear of stuffGearSchemaFixtures) {
      await StuffTypeSchema.findOneAndUpdate(gear, gear, {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true,
      });
    }
  } catch (err: any) {
    console.log(err);
  }
}

export async function insertItemsFixtures(items: Item[]) {
  for await (const item of items) {
    const { gearType, slot, dungeon } = item;

    const findSlot = slot?.length
      ? await SlotSchema.findOne({ name: slot }).exec()
      : undefined;

    const findGearType = gearType?.length
      ? await StuffTypeSchema.findOne({
          name: gearType,
        }).exec()
      : undefined;

    const dungeonType = dungeon?.length
      ? await DungeonSchema.findOne({
          name: dungeon,
        }).exec()
      : undefined;

    await ItemSchema.findByIdAndUpdate(
      item._id,
      {
        ...item,
        slot: findSlot?._id,
        gearType: findGearType?._id,
        dungeon: dungeonType?._id,
      },
      {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true,
      }
    );
  }
}

export async function cloudinaryPicturesUpload(data: Item[]): Promise<Item[]> {
  console.log("Start Cloudinary upload");
  const finalData: Item[] = [];
  for await (const img of data) {
    await cloudinary.uploader.upload(
      img.pictureUrl,
      { public_id: img.picture, folder: "equiloot", format: null },
      function (error, result) {
        if (error) {
          console.log("error", error);
        } else {
          finalData.push({
            ...img,
            pictureUrl: result.secure_url,
          });
          console.log(`${img.title} upload successfull!`);
        }
      }
    );
  }
  console.log("Cloudinary upload successfull!");
  return finalData;
}
