function scrollAndAction(selector, fn, param) {
  const element = document.querySelector(selector);
  
  element.scrollIntoView({
    behavior: "smooth",
    block: "start"
  });
  
  setTimeout(() => fn(param), 500);
}

window.scrollAndAction = scrollAndAction;