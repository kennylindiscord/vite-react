// src/anon.ts

const animals = ['Fox', 'Owl', 'Bear', 'Deer', 'Sparrow', 'Hawk', 'Rabbit', 'Cat', 'Dog'];
let anonCounter = 1;

export function generateRandomAnonName() {
  const animal = animals[Math.floor(Math.random() * animals.length)];
  const num = anonCounter++;
  return `Neighbor ${num} (${animal})`;
}


