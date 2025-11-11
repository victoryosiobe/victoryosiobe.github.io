function dater() {
  const dateEl = document.getElementById("d-v-g");
  const year = new Date().getFullYear();
  year == "2023" ?
    (dateEl.textContent = year) :
    (dateEl.textContent = "2023—" + year);
}

//
//
const navMore = document.querySelector(".navMore");
const menuIcon = document.getElementById("menuIcon");

const mailSection = document.querySelector(".mailSection");
const mailSectionIcon = document.getElementById("show-mail-section");

function toggleMenu(e) {
  menuIcon.classList.toggle("rotate-180");
  
  if (navMore.style.maxHeight) {
    navMore.style.maxHeight = null;
  } else {
    navMore.style.maxHeight = navMore.scrollHeight + "px";
  }
}


function toggleMailSection(mode) {
  mailSectionIcon.classList.toggle("rotate-180");
  if (mode === "close") mailSection.style.maxHeight = null;
  else if (mode === "open") mailSection.style.maxHeight = mailSection.scrollHeight + "px";
  else if (mailSection.style.maxHeight) {
    mailSection.style.maxHeight = null;
  } else {
    mailSection.style.maxHeight = mailSection.scrollHeight + "px";
  }
}

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
})