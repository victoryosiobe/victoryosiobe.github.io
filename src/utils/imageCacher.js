
import { openDB } from 'https://cdn.jsdelivr.net/npm/idb@8/+esm';

const dbName = 'image-cache';
const storeName = 'images';
const metaKey = 'meta';

async function getDB() {
  return openDB(dbName, 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(storeName)) {
        db.createObjectStore(storeName);
      }
    },
  });
}

// store image (tag becomes key)
export async function saveImage(blob, tag) {
  if (!tag) throw new Error('Tag is required');
  const db = await getDB();
  await db.put(storeName, { blob, tag }, tag);
  await db.put(storeName, Date.now(), metaKey); // timestamp for expiry
}

// get image by tag
export async function getImage(tag) {
  const db = await getDB();
  return db.get(storeName, tag);
}

// get all images
export async function getAllImages() {
  const db = await getDB();
  const allKeys = await db.getAllKeys(storeName);
  const imageKeys = allKeys.filter(k => k !== metaKey);
  const images = await Promise.all(
    imageKeys.map(async tag => {
      const data = await db.get(storeName, tag);
      return { tag, blob: data.blob };
    })
  );
  return images;
}

// clear if >1 hour old
export async function checkExpiry() {
  const db = await getDB();
  const savedTime = await db.get(storeName, metaKey);
  const oneHour = 60 * 60 * 1000;

  if (!savedTime || Date.now() - savedTime > oneHour) {
    await db.clear(storeName);
    console.log('🧹 Cache cleared: expired.');
  } else {
    console.log('✅ Cache valid.');
  }
}

checkExpiry();

// usage example
// const blob = await fetch('img.jpg').then(r => r.blob());
// await saveImage(blob, 'hero');
// const hero = await getImage('hero');
// const imgs = await getAllImages();