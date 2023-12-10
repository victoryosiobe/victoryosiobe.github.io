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
  vickoElement.style.opacity = '0'
  setTimeout(() => vickoElement.style.display = 'none' , 1000)
}, 1500)


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