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
  // console.log(updatedBeltLooters);
  return players.map((p) => {
    const selectedForBelt = updatedBeltLooters[p.id];
    // console.log(selectedForBelt);
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

export const rollBonus = (players, updateBonus) => {};

export const generateTeam = (players, updatePlayers) => {
  // Single char signup only has one character to join on
  // const chosenSingles = updatedPlayersWithBelts.map((player) =>
  //   player.names.length === 1 ? { ...player, chosenIndex: 0 } : player
  // );
  // console.log(chosenSingles);

  // updatePlayers(chosenSingles);
  updatePlayers(players);
};
