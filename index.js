const navGear = document.getElementById("navbar");
const brandNameEl = document.getElementById("brand-n");
const trenchElements = document.querySelectorAll(".trench");
const revealElementsX = document.querySelectorAll(".hide-element-x");
const revealElementsY = document.querySelectorAll(".hide-element-y");
const faqHeads = document.querySelectorAll(".head-faq");
const sectionComp = document.getElementById("out-I-");
const autoHigh = "high-life";
const revealedClX = "revealed-element-x";
const revealedClY = "revealed-element-y";

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
  revealOnScroll();
});

function revealOnScroll() {
  const windowHeight = window.innerHeight;
  revealElementsX.forEach((element) => {
    const revealTop = element.getBoundingClientRect().top;
    if (revealTop < windowHeight / 1.5) {
      element.classList.add(revealedClX);
    }
  });
  revealElementsY.forEach((element) => {
    const revealTop = element.getBoundingClientRect().top;
    if (revealTop < windowHeight / 1.5) {
      element.classList.add(revealedClY);
    }
  });

  // Remove the event listener once all elements are revealed
  if (
    [...revealElementsX].every((element) =>
      element.classList.contains(revealedClX),
    )
  ) {
    window.removeEventListener("scroll", revealOnScroll);
  }
  if (
    [...revealElementsY].every((element) =>
      element.classList.contains(revealedClY),
    )
  ) {
    window.removeEventListener("scroll", revealOnScroll);
  }
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