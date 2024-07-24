const navGear = document.getElementById("navbar");
const brandNameEl = document.getElementById("brand-n");
const outliners = [...document.querySelectorAll(".outliner"), ...document.querySelectorAll(".outlinera")]
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
for (const element of outliners) {
  const classes = "gradT" 
  colorizeLastLetter(element, classes)
}

(async () => {
  for (const element of trenchElements) {
    await new Promise((resolve) => {
      element.classList.add(autoHigh);
      setTimeout(resolve, 100);
    });
  }
})();

setTimeout(() => {
  navGear.classList.remove("bg-secondary");
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
  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      const e = entry.target
      if (e.querySelector('.gitStatImg')) {
        if (entry.isIntersecting) {
          e.querySelector('.gitStatImg').classList.add(bright);
          //console.log('Element is in view!');
          // observer.unobserve(entry.target); // Uncomment if you want to stop observing after first intersection
        } else {
          //console.log('Element is out of view!');
          e.querySelector('.gitStatImg').classList.remove(bright)
        }
      }
    });
  }, { threshold: 0.7 }); // 90% visibility


  cards.forEach(card => observer.observe(card));
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

function colorizeLastLetter(element, gradT) {
  // Check if element exists
  if (element) {
    // Get the current text content
    let text = element.textContent.trim();

    // Ensure there is text content
    if (text.length > 0) {
      // Get the last character
      let lastLetter = text.slice(-1);

      // Get the text content without the last letter
      let textWithoutLastLetter = text.slice(0, -1);

      // Create a span element to wrap the last letter with colored style
      let coloredLastLetter = document.createElement('span');
      coloredLastLetter.textContent = lastLetter;
      coloredLastLetter.classList.add(gradT); // Change color to whatever you want

      // Append the colored last letter back to the text
      element.textContent = '';
      element.appendChild(document.createTextNode(textWithoutLastLetter));
      element.appendChild(coloredLastLetter);

      // Return the modified text
      return element.textContent;
    }
  }

  // Return null if element or text content is empty
  return null;
}
