// Returns a random integer between min and max (inclusive)
export function getRandomInterval(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

//Checks Whether Element Is In View By Percent 
export function inViewPercent(el, percent = 0.5) {
  const box = el.getBoundingClientRect();
  const elemHeight = box.height;
  
  const visible =
    Math.min(box.bottom, window.innerHeight) -
    Math.max(box.top, 0);
  
  return visible / elemHeight >= percent;
}

