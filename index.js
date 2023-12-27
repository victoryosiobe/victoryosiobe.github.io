const navGear = document.getElementById('navbar')
const brandNameEl = document.getElementById('brand-n')
const bodyCap = document.getElementById('captain')
const trenchElements = document.querySelectorAll('.trench')
const revealElements = document.querySelectorAll('.hide-element')
const vickoElement = document.getElementById('vicko-')
const sectionComp = document.getElementById('out-I-')
const autoHigh = 'high-life';
const revealedCl = 'revealed-element';

(async () => {
  for (const element of trenchElements) {
    await new Promise(resolve => {
      element.classList.add(autoHigh)
      setTimeout(resolve, 50)
    })
  }
})()

setTimeout(() => {
  vickoElement.classList.add('fade')
  setTimeout(() => {
    vickoElement.classList.add('d-none')
    bodyCap.classList.remove('d-none')
    setTimeout(() => {
      bodyCap.classList.remove('opacity-0')
      navGear.classList.remove('bg-primary')
      navGear.classList.add('bg-light')
      brandNameEl.style.animation = '1s ease row-me'
      brandNameEl.classList.add('text-primary')
    }, 10) //wait a while for broswer to display element
  }, 1000)
}, 2000)


window.addEventListener('scroll', () => {
  bgWind()
  revealOnScroll()
})

function revealOnScroll() {
  const windowHeight = window.innerHeight;
  revealElements.forEach(element => {
    const revealTop = element.getBoundingClientRect().top;
    if (revealTop < windowHeight / 1.5) {
      element.classList.add(revealedCl);
    }
  });

  // Remove the event listener once all elements are revealed
  if ([...revealElements].every(element => element.classList.contains(revealedCl))) {
    window.removeEventListener('scroll', revealOnScroll);
  }
}

function bgWind() {
  const observer = new IntersectionObserver(entry => (entry[0].boundingClientRect.top < 70) ? navGear.classList.add('bg-opacity-50') : navGear.classList.remove('bg-opacity-50'))
  observer.observe(sectionComp);
}