document.addEventListener('DOMContentLoaded', function() {
  const revealElements = document.querySelectorAll('.hide-element');
  const revaledCl = 'revealed-element'

  function revealOnScroll() {
    const windowHeight = window.innerHeight;

    revealElements.forEach(element => {
      const revealTop = element.getBoundingClientRect().top;

      if (revealTop < windowHeight / 1.5) {
        element.classList.add(revaledCl);
      }
    });

    // Remove the event listener once all elements are revealed
    if ([...revealElements].every(element => element.classList.contains(revaledCl))) {
      window.removeEventListener('scroll', revealOnScroll);
    }
  }

  window.addEventListener('scroll', revealOnScroll);
});