const metaThemeColor = document.querySelector('meta[name="theme-color"]');
const rootStyle = getComputedStyle(document.documentElement);
const themeColor = rootStyle.getPropertyValue('--secColor');
if (metaThemeColor) metaThemeColor.setAttribute('content', themeColor);
const SCREENSHOT_API_URL_READY = "https://peekabooo.vercel.app/screenshot?url="

async function fetchImage(url) {
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
    const imgURL = URL.createObjectURL(blob);
    
    console.log("Image is valid.");
    return imgURL; // Can be used as <img src={imgURL}>
  } catch (err) {
    console.error("Image fetch failed.", err.message);
    return null;
  }
}


async function updateImages(previewImageEls) {
  const jobs = previewImageEls.map(async (imageEl) => {
    const pLink = imageEl.getAttribute("data-link");
    const imgURL = await fetchImage(SCREENSHOT_API_URL_READY + pLink);
    
    if (imgURL) {
      imageEl.src = imgURL; // Use blob URL we got from fetchImage
    } else {
      console.warn(`Image failed for: ${pLink}`);
    }
  });
  
  await Promise.all(jobs); // Wait for all fetches to finish
  console.log("All images processed.");
}

function dater() {
  const dateEl = document.getElementById("d-v-g");
  const year = new Date().getFullYear();
  year == "2023" ?
    (dateEl.textContent = year) :
    (dateEl.textContent = "2023—" + year);
}

document.addEventListener("DOMContentLoaded", () => {
  dater()
  const previewImageEls = Array.from(document.getElementsByClassName("preview-with-screenshot"))
  updateImages(previewImageEls)
})

document.querySelectorAll('.faq-toggle').forEach(btn => {
  btn.addEventListener('click', () => {
    const content = btn.nextElementSibling
    const icon = btn.querySelector('.icon')
    
    if (content.style.maxHeight) {
      content.style.maxHeight = null
      icon.textContent = '+'
    } else {
      content.style.maxHeight = content.scrollHeight + 'px'
      icon.textContent = '–'
    }
  })
  btn.click()
})