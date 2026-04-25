function scrollAndAction(selector, fn, param, viewBlock = "start") {
  const element = document.querySelector(selector);
  
  if (element) {
    element.scrollIntoView({
      behavior: "smooth",
      block: viewBlock
    });
  } else {
    console.warn(`Element not found: ${selector}`);
  }
  
  setTimeout(() => fn(param), 500);
}

function scrollToEl(selector, viewBlock = "start") {
  const element = document.querySelector(selector);
  
  if (element) {
    element.scrollIntoView({
      behavior: "smooth",
      block: viewBlock
    });
  } else {
    console.warn(`Element not found: ${selector}`);
  }
}

window.scrollAndAction = scrollAndAction;
window.scrollToEl = scrollToEl;