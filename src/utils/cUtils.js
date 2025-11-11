// Returns a random integer between min and max (inclusive)
export function getRandomInterval(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}