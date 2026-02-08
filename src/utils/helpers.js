function dater() {
  const dateEl = document.getElementById("d-v-g");
  const year = new Date().getFullYear();
  year == "2023" ?
    (dateEl.textContent = year) :
    (dateEl.textContent = "2023—" + year);
}

//
//
const navMore = document.querySelector("#offCanvas");
const menuIcon = document.getElementById("menuIcon");

const mailSection = document.querySelector(".mailSection");
const mailSectionIcon = document.getElementById("show-mail-section");

const togInNavIcon = document.getElementById("tog-in-nav");

//important to initialize these
navMore.dataset.open = "1"; //state for open
navMore.style.maxHeight = navMore.scrollHeight +
  "px"; //gets js to acknowledge maxHeight so it can transition on first try instead of jumping directly. What a fucking thing.



function toggleMenu(e) {
  menuIcon.classList.toggle("rotate-180");
  navMore.classList.toggle("left-0");
  
}


function toggleMailSection(mode) {
  mailSectionIcon.classList.toggle("rotate-180");
  if (mode === "close") mailSection.style.maxHeight = null;
  else if (mode === "open") mailSection.style.maxHeight = mailSection
    .scrollHeight + "px";
  else if (mailSection.style.maxHeight) {
    mailSection.style.maxHeight = null;
  } else {
    mailSection.style.maxHeight = mailSection.scrollHeight + "px";
  }
}

function toggleInNavMenu(mode) {
  
  const isOpen = navMore.dataset.open === "1";
  
  if (mode === "close") {
    if (isOpen) togInNavIcon.classList.toggle(
    "rotate-180"); //checks explicitly if it was opened before we try to close it, so we rotate the icon. if closed when 
    navMore.style.maxHeight = "0px"
    navMore.dataset.open = "0";
  } else if (mode === "open") {
    if (!isOpen) togInNavIcon.classList.toggle("rotate-180");
    navMore.style.maxHeight = navMore.scrollHeight + "px";
    navMore.dataset.open = "1";
  } else if (isOpen) {
    togInNavIcon.classList.toggle("rotate-180");
    navMore.style.maxHeight = "0px"
    navMore.dataset.open = "0";
  } else {
    togInNavIcon.classList.toggle("rotate-180");
    navMore.style.maxHeight = navMore.scrollHeight + "px";
    navMore.dataset.open = "1";
  }
}

function toggleInNavMenur(mode) {
  togInNavIcon.classList.toggle("rotate-180");
  
  const isOpen = navMore.style.maxHeight && navMore.style.maxHeight !== "0px";
  console.log("begin", navMore.scrollHeight)
  
  if (mode === "open" || (!mode && !isOpen)) {
    navMore.style.maxHeight = navMore.scrollHeight + "px";
    console.log("opening", navMore.style.maxHeight)
  } else {
    navMore.style.maxHeight = "0px";
    console.log("closing", navMore.style.maxHeight)
  }
}

// Function to check if scrolled past 50% of hero element
function checkHeroScroll() {
  // Only run on medium screens and above (Tailwind md: 768px)
  if (window.innerWidth < 768) {
    return;
  }
  const heroElement = document.getElementById('hero');
  
  // Get the hero element's position and dimensions
  const heroRect = heroElement.getBoundingClientRect();
  const heroHeight = heroElement.offsetHeight;
  const heroTop = heroElement.offsetTop;
  
  // Calculate 40% point of the hero element
  const fiftyPercentPoint = heroTop + (heroHeight * 0.4);
  
  // Get current scroll position
  const scrollPosition = window.scrollY || window.pageYOffset;
  
  // Check if scrolled past 50% of hero
  if (scrollPosition > fiftyPercentPoint) {
    toggleInNavMenu("close");
  }
}

// Add scroll event listener
window.addEventListener('scroll',
checkHeroScroll); //i left scroll on even on less than md screens because it could be resized. And we don't wanna have a resize event listening for on md. to let scroll event listen again.

// Check on page load in case already scrolled
document.addEventListener('DOMContentLoaded', checkHeroScroll);

//
//
const show = document.getElementById('show');
const hide = document.getElementById('hide');

show.addEventListener('click', () => {
  show.style.display = 'none'
  hide.style.display = 'inline'
})
hide.addEventListener('click', () => {
  hide.style.display = 'none'
  show.style.display = 'inline'
  on
})