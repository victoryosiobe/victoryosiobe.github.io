const bodyCap = document.getElementById('captain')
const trenchElements = document.querySelectorAll('.trench')
const revealElements = document.querySelectorAll('.hide-element')
const vickoElement = document.getElementById('vicko-')
const autoHigh = 'high-life'
const revealedCl = 'revealed-element'
highChars()

async function highChars() {
  for (const element of trenchElements) {
    await new Promise(resolve => {
      element.classList.add(autoHigh)
      setTimeout(resolve, 50)
    })
  }
}

setTimeout(() => {
  vickoElement.classList.add('fade')
  setTimeout(() => {
    vickoElement.classList.add('d-none')
    bodyCap.classList.remove('d-none')
    setTimeout(() => bodyCap.classList.remove('opacity-0'), 10) //wait a while for broswer to didplay element
  }, 1000)
}, 2000)


window.addEventListener('scroll', revealOnScroll);

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