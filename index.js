const navGear = document.getElementById("navbar");
const brandNameEl = document.getElementById("brand-n");
const bodyCap = document.getElementById("captain");
const trenchElements = document.querySelectorAll(".trench");
const revealElementsX = document.querySelectorAll(".hide-element-x");
const revealElementsY = document.querySelectorAll(".hide-element-y");
const vickoElement = document.getElementById("vicko-");
const sectionComp = document.getElementById("out-I-");
const progressOr = document.getElementById("progressor");
const autoHigh = "high-life";
const revealedClX = "revealed-element-x";
const revealedClY = "revealed-element-y";

(async () => {
  for (const element of trenchElements) {
    await new Promise((resolve) => {
      element.classList.add(autoHigh);
      setTimeout(resolve, 50);
    });
  }
})();

setTimeout(() => {
  progressOr.textContent = "Building...";
  setTimeout(() => {
    progressOr.textContent = "Organizing...";
    setTimeout(() => {
      vickoElement.classList.add("fade");
      progressOr.textContent = "Rendering...";
      setTimeout(() => {
        vickoElement.classList.add("d-none");
        bodyCap.classList.remove("d-none");
        setTimeout(() => {
          bodyCap.classList.remove("opacity-0");
          navGear.classList.remove("bg-primary");
          navGear.classList.add("bg-light-comf");
          brandNameEl.style.animation = "1s ease-in-out row-me";
          brandNameEl.classList.add("text-primary");
        }, 10); //wait a while for broswer to display element
      }, 1000);
    }, 1700);
  }, 1600);
}, 1000);

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
    entry[0].boundingClientRect.top < 70
      ? navGear.classList.add("bg-opacity-50")
      : navGear.classList.remove("bg-opacity-50"),
  );
  observer.observe(sectionComp);
}
