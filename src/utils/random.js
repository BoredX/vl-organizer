export const random = (numDrops, numLooters) => {
  const numbers = [];
  while (numbers.length < numDrops && numbers.length < numLooters) {
    const randomNumber = Math.floor(Math.random() * numLooters);
    if (!numbers.includes(randomNumber)) {
      numbers.push(randomNumber);
    }
  }
  return numbers;
};
