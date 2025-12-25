import { getRandomInterval, inViewPercent } from "./src/utils/cUtils.js";

const metaThemeColor = document.querySelector('meta[name="theme-color"]');
const rootStyle = getComputedStyle(document.documentElement);
const themeColor = rootStyle.getPropertyValue('--secColor');
if (metaThemeColor) metaThemeColor.setAttribute('content', themeColor);
const heroContain = document.getElementById("hero");

const SCREENSHOT_API_URL_READY = "https://peekabooo.vercel.app/screenshot?url=";

if ('serviceWorker' in navigator) { // Listen for messages from service worker
  navigator.serviceWorker.addEventListener('message', event => {
    if (event.data.type === 'SW_LOG') {
      console.log(...event.data.args);
    }
  });
  
  navigator.serviceWorker.register('./service-worker-for-caching-images.js')
    .then(reg => console.log('Service Worker registered', reg))
    .catch(err => console.error('Service Worker registration failed', err));
}

showToast("Site Is Always Under Construction!", "warning");

async function fetchImage(url) {
  try {
    const res = await fetch(url, {
      headers: {
        "sw-type-classification": "asset"
      }
    });
    
    if (!res.ok) {
      throw new Error(`HTTP error! Status: ${res.status}`);
    }
    
    const contentType = res.headers.get("content-type");
    if (!contentType || !contentType.startsWith("image/")) {
      throw new Error("Not a valid image");
    }
    
    const blob = await res.blob();
    
    const imgURL = URL.createObjectURL(blob);
    
    console.log("Image is valid.");
    return imgURL;
  } catch (err) {
    console.error("Image fetch failed.", err.message);
    return null;
  }
}

async function updateImages(previewImageEls) {
  const jobs = previewImageEls.map(async (imageEl, index) => {
    
    const pLink = imageEl.getAttribute("data-link");
    
    // fetchImage should save to IndexedDB under tagKey and return a usable URL
    const imgURL = await fetchImage(SCREENSHOT_API_URL_READY + pLink);
    
    if (imgURL) {
      imageEl.src = imgURL;
      console.log(`📸 Fetched + saved [${tagKey}]`);
    } else {
      console.warn(`Image failed for: ${pLink}`);
    }
  })
  
  await Promise.allSettled(jobs);
  showToast("Preview Images Loaded!",
    "success");
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
    const firstRects = new Map(children.map(el => [el, el
      .getBoundingClientRect()
    ]));
    
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