const _ = require('lodash');

// export const random = (numDrops, numLooters) => {
//   const numbers = [];
//   while (numbers.length < numDrops && numbers.length < numLooters) {
//     const randomNumber = Math.floor(Math.random() * numLooters);
//     if (!numbers.includes(randomNumber)) {
//       numbers.push(randomNumber);
//     }
//   }
//   return numbers;
// };

export const random = (numDrops, numLooters) => {
  const nums = _.range(0, numLooters);
  return _.sampleSize(nums, numDrops);
};
