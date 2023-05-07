import { random } from './random';

const beltLooterPlayerIdMap = (beltLooters) =>
  beltLooters.reduce((acc, player) => {
    acc[player.id] = {
      isBelt: true,
      isBonus: false,
      isNx: false,
    };
    return acc;
  }, {});

const createMapFromRandomBelts = (beltLooters) => {
  if (beltLooters.length <= 6) {
    // Give one to everyone who wanted a belt
    return beltLooterPlayerIdMap(beltLooters);
  }
  const playerIndexIds = random(6, beltLooters.length);
  const players = beltLooters.filter((_, i) => playerIndexIds.includes(i));
  return beltLooterPlayerIdMap(players);
};

const updateWithBeltLooters = (players) => {
  const playersWantingBelts = players.filter((p) => p.loots.includes('belt'));
  const updatedBeltLooters = createMapFromRandomBelts(playersWantingBelts);
  return players.map((p) => {
    const selectedForBelt = updatedBeltLooters[p.id];
    const noBeltFlags = {
      isBonus: true,
      isBelt: false,
      isNx: false,
    };
    return selectedForBelt
      ? {
          ...p,
          ...selectedForBelt,
        }
      : { ...p, ...noBeltFlags };
  });
};

export const rollNx = (players, updatePlayers) => {
  const removedNx = players.map((p) => ({ ...p, isNx: false }));
  const bonusLooters = removedNx.filter((p) => p.isBonus && !p.isBelt);
  const numNx = prompt('Enter number of NX dropped', '');
  const nxLootersIndex = random(numNx, bonusLooters.length);
  const playersChosen = bonusLooters.filter((p, i) =>
    nxLootersIndex.includes(i)
  );
  updatePlayers(
    removedNx.map((p) => {
      const chosenPlayer = playersChosen.find((p2) => p.id === p2.id);
      return chosenPlayer ? { ...p, isNx: true } : p;
    })
  );
};

export const rollLoot = (players, updatePlayers) => {
  const updatedPlayersWithBelts = updateWithBeltLooters(players);
  updatePlayers(updatedPlayersWithBelts);
};

export const rollBonus = (players, setPlayers) => {
  console.log(players);
  console.log(setPlayers);
};

export const generateBonusArray = (players, setBonusArray) => {
  const resetBonus = players.map((p) => ({ ...p, boxes: '' }));
  const bonusLooters = resetBonus.filter((p) => p.isBonus);
  const minBoxPerPlayer = Math.floor(30 / bonusLooters.length);
  const numPlayersWithMoreBoxes = 30 % bonusLooters.length;
  const maxBoxPerPlayer =
    numPlayersWithMoreBoxes === 0 ? minBoxPerPlayer : minBoxPerPlayer + 1;

  const nxLootedPlayers = resetBonus.filter((p) => p.isNx);
  const nxLootedPlayerIds = nxLootedPlayers.map((p) => p.id);
  const playersThatShouldGetMoreBoxes = bonusLooters.filter(
    (p) => !nxLootedPlayerIds.includes(p.id)
  );

  // Get index of bonus looters who get more boxes
  const playersWhoGetMoreBoxesIndex = random(
    numPlayersWithMoreBoxes,
    playersThatShouldGetMoreBoxes.length
  );
  const playersWithMoreBoxes = playersThatShouldGetMoreBoxes.filter((p, i) =>
    playersWhoGetMoreBoxesIndex.includes(i)
  );
  const moreBoxesPlayerIds = playersWithMoreBoxes.map((p) => p.id);

  const getNumBoxes = (id) =>
    moreBoxesPlayerIds.includes(id) ? maxBoxPerPlayer : minBoxPerPlayer;
  let sortedBonusLooters = [];
  if (maxBoxPerPlayer === 3 && bonusLooters.length >= 12) {
    const playersWithLessBoxes = bonusLooters.filter(
      (p) => !moreBoxesPlayerIds.includes(p.id)
    );
    // 12 looters =  6 people is 2 box,  6 people 3 box
    // 13 looters =  9 people is 2 box,  4 people 3 box
    // 14 looters = 12 people is 2 box,  2 people 3 box
    for (
      let minBoxIndex = 0, maxBoxIndex = 0;
      maxBoxIndex < moreBoxesPlayerIds.length;

    ) {
      sortedBonusLooters.push(playersWithLessBoxes[minBoxIndex]);
      minBoxIndex += 1;
      sortedBonusLooters.push(playersWithMoreBoxes[maxBoxIndex]);
      maxBoxIndex += 1;
      sortedBonusLooters.push(playersWithMoreBoxes[maxBoxIndex]);
      maxBoxIndex += 1;
      sortedBonusLooters.push(playersWithLessBoxes[minBoxIndex]);
      minBoxIndex += 1;
    }
    // Fill in the rest with less box people
    sortedBonusLooters = [
      ...sortedBonusLooters,
      ...playersWithLessBoxes.slice(moreBoxesPlayerIds.length),
    ];
  } else {
    sortedBonusLooters = bonusLooters.sort((a, b) => {
      const aVal = moreBoxesPlayerIds.includes(a.id);
      const bVal = moreBoxesPlayerIds.includes(b.id);
      return bVal - aVal;
    });
  }

  let row = 0;
  let column = 1;
  for (const player of sortedBonusLooters) {
    let boxes = '';
    const numBoxesThisPlayerGets = getNumBoxes(player.id);
    for (let i = 0; i < numBoxesThisPlayerGets; i += 1) {
      if (column > 10) {
        row += 1;
        column = 1;
      }
      const letter = String.fromCharCode('a'.charCodeAt(0) + row);
      boxes += letter + column;
      column += 1;
    }
    player.boxes = boxes;
  }
  const aLooters = bonusLooters.filter((p) => p.boxes.startsWith('a'));
  const bLooters = bonusLooters.filter((p) => p.boxes.startsWith('b'));
  const cLooters = bonusLooters.filter((p) => p.boxes.startsWith('c'));

  const compare = (a, b, letter) => {
    if (a.boxes === `${letter}10`) {
      return 1;
    }
    if (b.boxes === `${letter}10`) {
      return -1;
    }
    return a.boxes.localeCompare(b.boxes);
  };

  aLooters.sort((a, b) => compare(a, b, 'a'));
  bLooters.sort((a, b) => compare(a, b, 'b'));
  cLooters.sort((a, b) => compare(a, b, 'c'));

  const result = [];
  result.push(
    aLooters.map((p) => {
      if (p.chosenIndex < 0) {
        // todo remove
        p.chosenIndex = 0;
      }

      return { boxes: p.boxes, name: p.names[p.chosenIndex] };
    })
  );
  result.push(
    bLooters.map((p) => {
      if (p.chosenIndex < 0) {
        // todo remove
        p.chosenIndex = 0;
      }

      return { boxes: p.boxes, name: p.names[p.chosenIndex] };
    })
  );
  result.push(
    cLooters.map((p) => {
      if (p.chosenIndex < 0) {
        // todo remove
        p.chosenIndex = 0;
      }

      return { boxes: p.boxes, name: p.names[p.chosenIndex] };
    })
  );
  console.log(result);
  setBonusArray(result);
};

export const generateTeam = (players, updatePlayers) => {
  // Single char signup only has one character to join on
  // const chosenSingles = updatedPlayersWithBelts.map((player) =>
  //   player.names.length === 1 ? { ...player, chosenIndex: 0 } : player
  // );
  // console.log(chosenSingles);

  // updatePlayers(chosenSingles);
  updatePlayers(players);
};
