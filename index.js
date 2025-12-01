import { saveImage, getAllImages } from "./src/utils/imageCacher.js";
import { getRandomInterval, inViewPercent } from "./src/utils/cUtils.js";

const metaThemeColor = document.querySelector('meta[name="theme-color"]');
const rootStyle = getComputedStyle(document.documentElement);
const themeColor = rootStyle.getPropertyValue('--secColor');
if (metaThemeColor) metaThemeColor.setAttribute('content', themeColor);
const heroContain = document.getElementById("hero");

const SCREENSHOT_API_URL_READY = "https://peekabooo.vercel.app/screenshot?url=";


showToast("Site Is Always Under Construction!", "warning");

async function fetchImage(url, id) {
  try {
    const res = await fetch(url);
    
    if (!res.ok) {
      throw new Error(`HTTP error! Status: ${res.status}`);
    }
    
    const contentType = res.headers.get("content-type");
    if (!contentType || !contentType.startsWith("image/")) {
      throw new Error("Not a valid image");
    }
    
    const blob = await res.blob();
    await saveImage(blob, id);
    
    const imgURL = URL.createObjectURL(blob);
    
    console.log("Image is valid.");
    return imgURL;
  } catch (err) {
    console.error("Image fetch failed.", err.message);
    return null;
  }
}

async function updateImages(previewImageEls) {
  const dbImages = await getAllImages(); // [{ tag, blob }, ...]
  // persistentMap: tag(string) -> Blob
  const persistentMap = new Map(dbImages.map(({ tag, blob }) => [String(tag), blob]));
  
  // in-memory per-element cache + inflight dedupe
  const weakCache = new WeakMap(); // Element -> Blob
  const inflight = new Map(); // tagKey (data-link) -> Promise<imgURL|null>
  
  const jobs = previewImageEls.map(async (imageEl, index) => {
    const pLink = imageEl.getAttribute("data-link");
    // canonical key for persistent storage / dedupe: prefer data-link
    const tagKey = pLink || imageEl.dataset.tag || String(index);
    
    // 1) quick weakmap hit (per-element)
    if (weakCache.has(imageEl)) {
      const blob = weakCache.get(imageEl);
      imageEl.src = URL.createObjectURL(blob);
      console.log("✅ Loaded from weakCache", tagKey);
      return;
    }
    
    // 2) persistent IndexedDB cache hit (shared across elements)
    if (persistentMap.has(tagKey)) {
      const blob = persistentMap.get(tagKey);
      imageEl.src = URL.createObjectURL(blob);
      weakCache.set(imageEl, blob); // remember for this element
      imageEl.dataset.tag = tagKey;
      console.log(`✅ Loaded cached image [${tagKey}]`);
      return;
    }
    
    // 3) if there's already a fetch in-flight for this resource, reuse it
    if (inflight.has(tagKey)) {
      const imgURL = await inflight.get(tagKey);
      if (imgURL) imageEl.src = imgURL;
      return;
    }
    
    // 4) fetch (deduped), save promise in inflight map
    const promise = (async () => {
      try {
        // fetchImage should save to IndexedDB under tagKey and return a usable URL
        const imgURL = await fetchImage(SCREENSHOT_API_URL_READY + pLink, tagKey);
        return imgURL || null;
      } catch (err) {
        console.error("fetchImage error", err);
        return null;
      }
    })();
    
    inflight.set(tagKey, promise);
    
    // wait, then clear inflight
    const imgURL = await promise.finally(() => inflight.delete(tagKey));
    
    if (imgURL) {
      imageEl.src = imgURL;
      imageEl.dataset.tag = tagKey;
      // If the blob was already present in persistentMap we'd have set weakCache earlier.
      // If you want to populate weakCache after fetch, you could re-read IndexedDB here.
      console.log(`📸 Fetched + saved [${tagKey}]`);
    } else {
      console.warn(`Image failed for: ${pLink}`);
    }
  });
  
  await Promise.all(jobs);
  showToast("Preview Images Loaded!", "success");
  console.log("✅ All images processed.");
}

document.addEventListener("DOMContentLoaded", () => {
  dater();
  const previewImageEls = Array.from(
    document.getElementsByClassName("preview-with-screenshot")
  );
  updateImages(previewImageEls);
});

document.querySelectorAll(".faq-toggle").forEach((btn, i) => {
  btn.addEventListener("click", () => {
    const content = btn.nextElementSibling;
    const icon = btn.querySelector(".icon");
    
    if (content.style.maxHeight) {
      content.style.maxHeight = null;
      icon.textContent = "+";
    } else {
      content.style.maxHeight = content.scrollHeight + "px";
      icon.textContent = "–";
    }
  });
  if (i === 0) btn.click(); //open first section 
});

document.querySelectorAll(".swap-group-on-stacks").forEach(group => {
  function flap() {
    const children = Array.from(group.children);
    
    // record positions
    const firstRects = new Map(children.map(el => [el, el.getBoundingClientRect()]));
    
    // shuffle
    for (let i = children.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [children[i], children[j]] = [children[j], children[i]];
    }
    
    // batch append (no layout thrash)
    const frag = document.createDocumentFragment();
    children.forEach(c => frag.appendChild(c));
    group.appendChild(frag);
    
    // measure new positions + animate
    children.forEach(el => {
      const last = el.getBoundingClientRect();
      const first = firstRects.get(el);
      const dx = first.left - last.left;
      const dy = first.top - last.top;
      
      //reverse it to position it came from
      el.style.transform = `translate(${dx}px, ${dy}px)`;
      el.style.transition = "transform 0s";
      requestAnimationFrame(() => {
        //animate to position it is new at
        el.style.transition = "transform 0.6s ease";
        el.style.transform = "translate(0, 0)";
      });
    });
    setTimeout(flap, getRandomInterval(500, 3000)) //recurse
  }
  setTimeout(flap, getRandomInterval(500, 3000))
});

window.addEventListener("load", () => {
  if (inViewPercent(heroContain, 0.98)) {
    setTimeout(() => {
      window.scrollBy({
        top: 100,
        behavior: "smooth"
      });
    }, 1000);
    
    setTimeout(() => {
      window.scrollBy({
        top: -100,
        behavior: "smooth"
      });
    }, 2000);
  }
})