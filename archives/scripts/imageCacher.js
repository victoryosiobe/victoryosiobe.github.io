import { openDB } from '/src/lib/idb@8.js';

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
  await checkExpiry();
  
  const db = await getDB();
  return db.get(storeName, tag);
}

// get all images
export async function getAllImages() {
  await checkExpiry();
  
  const db = await getDB();
  const allKeys = await db.getAllKeys(storeName);
  const imageKeys = allKeys.filter(k => k !== metaKey);
  if (imageKeys.length < 1) return []
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
  const oneHour = 48 * 60 * 60 * 1000;
  
  if (!savedTime || Date.now() - savedTime > oneHour) {
    await db.clear(storeName);
    console.log('🧹 Cache cleared: expired.');
  } else {
    console.log('✅ Cache valid.');
  }
}

// usage example
// const blob = await fetch('img.jpg').then(r => r.blob());
// await saveImage(blob, 'hero');
// const hero = await getImage('hero');
// const imgs = await getAllImages();