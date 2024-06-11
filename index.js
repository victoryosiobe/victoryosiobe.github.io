const navGear = document.getElementById("navbar");
const brandNameEl = document.getElementById("brand-n");
const trenchElements = document.querySelectorAll(".trench");
const revealElementsX = document.querySelectorAll(".hide-element-x");
const revealElementsY = document.querySelectorAll(".hide-element-y");
const cards = document.querySelectorAll('.card')
const faqHeads = document.querySelectorAll(".head-faq");
const sectionComp = document.getElementById("out-I-");
const autoHigh = "high-life";
const revealedClX = "revealed-element-x";
const revealedClY = "revealed-element-y";
const bright = 'bright-full';

(async () => {
  for (const element of trenchElements) {
    await new Promise((resolve) => {
      element.classList.add(autoHigh);
      setTimeout(resolve, 100);
    });
  }
})();

setTimeout(() => {
  navGear.classList.remove("bg-primary");
  navGear.classList.add("bg-light-comf");
  //  brandNameEl.style.animation = "1s ease-in-out row-me";
  //brandNameEl.classList.add("text-primary"); 
}, 1500); //wait a while for broswer to display element

window.addEventListener("scroll", () => {
  bgWind();
  revealCards()
  brightenCardImg()
  highlightImg()
});

function revealCards() {
  const windowHeight = window.innerHeight;
  revealElementsX.forEach((e) => {
    const revealTop = e.getBoundingClientRect().top;
    if (revealTop < windowHeight / 1.3)
      e.classList.add(revealedClX);
  });
  revealElementsY.forEach((e) => {
    const revealTop = e.getBoundingClientRect().top;
    if (revealTop < windowHeight / 1.3)
      e.classList.add(revealedClX);
  });
  //Stop Triggering
  if (([...revealElementsX].every(e => e.classList.contains(revealedClX))) && ([...revealElementsY].every((element) => element.classList.contains(revealedClY)))) {
    window.removeEventListener('scroll', revealCards)
  }
}

function brightenCardImg() {
  const windowHeight = window.innerHeight;
  cards.forEach(e => {
    if (e.querySelector('.gitStatImg')) {
      const revealTop = e.getBoundingClientRect().top;
      if (revealTop < windowHeight / 1.3) e.querySelector('.gitStatImg').classList.add(bright);
      else e.querySelector('.gitStatImg').classList.remove(bright)
    }
  });
}

function highlightImg() {
  // Tab to edit
}

function bgWind() {
  const observer = new IntersectionObserver((entry) =>
    entry[0].boundingClientRect.top < 750 ?
    (navGear.style.background = "rgba(235, 245, 255, 0.4)") :
    (navGear.style.background = "rgba(235, 245, 255, 1)"),
  );
  observer.observe(sectionComp);
}

for (const element of faqHeads) {
  element.addEventListener("click", (e) => {
    const root = document.documentElement;

    // Change the value of the CSS variable


    const foldableDiv = e.target.nextElementSibling
    if (foldableDiv.style.height && foldableDiv.style.height !== '0px') {
      foldableDiv.style.height = '0px';
      e.target.title = "+"
    } else {
      const scrollHeight = foldableDiv.scrollHeight;
      foldableDiv.style.height = scrollHeight + 'px';
      e.target.title = "-"
    }
  })
}