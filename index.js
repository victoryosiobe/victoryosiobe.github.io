import { saveImage, getAllImages } from "./src/utils/imageCacher.js"

const metaThemeColor = document.querySelector('meta[name="theme-color"]');
const rootStyle = getComputedStyle(document.documentElement);
const themeColor = rootStyle.getPropertyValue('--secColor');
if (metaThemeColor) metaThemeColor.setAttribute('content', themeColor);

const SCREENSHOT_API_URL_READY = "https://peekabooo.vercel.app/screenshot?url=";

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
  const dbImages = await getAllImages(); // from IndexedDB
  const cacheMap = new Map(dbImages.map(({ tag, blob }) => [String(tag), blob]));
  
  const jobs = previewImageEls.map(async (imageEl, index) => {
    const pLink = imageEl.getAttribute("data-link");
    const tag = String(index); // use index per image
    
    // check cache first
    if (cacheMap.has(tag)) {
      const blob = cacheMap.get(tag);
      imageEl.src = URL.createObjectURL(blob);
      console.log(`✅ Loaded cached image [${tag}]`);
      return;
    }
    
    // else fetch and auto-save inside fetchImage()
    const imgURL = await fetchImage(SCREENSHOT_API_URL_READY + pLink, tag);
    
    if (imgURL) {
      imageEl.src = imgURL;
      console.log(`📸 Fetched + saved [${tag}]`);
    } else {
      console.warn(`Image failed for: ${pLink}`);
    }
  });
  
  await Promise.all(jobs);
  showToast("Preview Images Loaded!", "success");
  console.log("✅ All images processed.");
}

function dater() {
  const dateEl = document.getElementById("d-v-g");
  const year = new Date().getFullYear();
  year == "2023" ?
    (dateEl.textContent = year) :
    (dateEl.textContent = "2023—" + year);
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

// Returns a random integer between min and max (inclusive)
function getRandomInterval(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}