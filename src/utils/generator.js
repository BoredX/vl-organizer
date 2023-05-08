import { shuffle } from 'lodash';
import { random } from './random';
import {
  Job,
  getBSIndex,
  getBuccIndex,
  getDkIndex,
  getHeroIndex,
  getNLIndex,
  getPallyIndex,
  getSEIndex,
  getShadIndex,
  indexOfCharAtTier,
  jobFlags,
} from './jobs';

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

export const rollNx = (players) => {
  const removedNx = players.map((p) => ({ ...p, isNx: false }));
  const bonusLooters = removedNx.filter((p) => p.isBonus && !p.isBelt);
  const numNx = prompt('Enter number of NX dropped', '');
  const nxLootersIndex = random(numNx, bonusLooters.length);
  const playersChosen = bonusLooters.filter((p, i) =>
    nxLootersIndex.includes(i)
  );
  return removedNx.map((p) => {
    const chosenPlayer = playersChosen.find((p2) => p.id === p2.id);
    return chosenPlayer ? { ...p, isNx: true } : p;
  });
};

export const rollLoot = (players) => {
  const updatedPlayersWithBelts = updateWithBeltLooters(players);
  return updatedPlayersWithBelts;
};

export const generateBonusArray = (players) => {
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
  return result;
};

export const numSuggestedBs = (players) => {
  const bsList = players.filter((p) => p.jobs.includes(Job.BS));
  return Math.min(
    Math.ceil(players.length / 6),
    bsList.length // if less bs, use how many signed up
  );
};

export const generateTeam = (players, maxNumBs, minNumBucc) => {
  let playersChosen = [...players];
  const bsList = shuffle(players.filter((p) => p.jobs.includes(Job.BS)));
  const seList = shuffle(players.filter((p) => p.jobs.includes(Job.SE)));
  const nlList = shuffle(players.filter((p) => p.jobs.includes(Job.NL)));
  const buccList = shuffle(players.filter((p) => p.jobs.includes(Job.Bucc)));
  const shadList = shuffle(players.filter((p) => p.jobs.includes(Job.Shad)));
  const sairList = shuffle(players.filter((p) => p.jobs.includes(Job.Sair)));
  const warList = shuffle(
    players.filter((p) => p.jobs.includes(Job.Hero) || p.jobs.includes(Job.DK))
  );
  const pallyList = shuffle(players.filter((p) => p.jobs.includes(Job.Pally)));
  // Each element is an array of players having that job.
  // Ordered by suggested tier list
  let lists = [
    buccList, // 0
    shadList, // 1
    warList, // 2
    nlList, // 3
    seList, // 4
    sairList, // 5
    pallyList, // 6
    bsList, // 7
  ];

  //*              Select classes              *//

  // Single char signup only has one character to join on
  let chosenSingles = players.map((player) => {
    if (player.names.length === 1) {
      const jFlags = jobFlags(player.jobs[0]);
      return { ...player, chosenIndex: 0, ...jFlags };
    }
    return player;
  });

  chosenSingles = chosenSingles.filter((p) => p.names.length === 1);
  lists = updatePool(chosenSingles, lists);
  playersChosen = updatePlayers(playersChosen, chosenSingles);

  // people who won belt roll should get priority of belt char
  let beltLooters = players.filter((p) => p.isBelt);
  beltLooters = beltLooters.map((p) => updateChar(p, p.loots.indexOf('belt')));
  lists = updatePool(beltLooters, lists);
  playersChosen = updatePlayers(playersChosen, beltLooters);

  // choose bishops
  const currentNumBs = playersChosen.filter((p) => p.isBs).length;
  const numMoreBsToGet = maxNumBs - currentNumBs;
  let chosenBs = numMoreBsToGet > 0 ? lists[7].splice(0, numMoreBsToGet) : [];
  chosenBs = chosenBs.map((p) => updateChar(p, getBSIndex(p)));
  lists = updatePool(chosenBs, lists);
  playersChosen = updatePlayers(playersChosen, chosenBs);

  // choose SE - try to get 2 max
  const currentNumSe = playersChosen.filter((p) => p.isSe).length;
  const numMoreSeToGet = 2 - currentNumSe;
  let chosenSe = numMoreSeToGet > 0 ? lists[4].splice(0, numMoreSeToGet) : [];
  chosenSe = chosenSe.map((p) => updateChar(p, getSEIndex(p)));
  lists = updatePool(chosenSe, lists);
  playersChosen = updatePlayers(playersChosen, chosenSe);

  // Get buccMax first, get more later
  const currentNumBucc = playersChosen.filter((p) => p.isBucc).length;
  const numMoreBuccToGet = minNumBucc - currentNumBucc;
  let chosenBucc =
    numMoreBuccToGet > 0 ? lists[0].splice(0, numMoreBuccToGet) : [];
  chosenBucc = chosenBucc.map((p) => updateChar(p, getBuccIndex(p)));
  lists = updatePool(chosenBucc, lists);
  playersChosen = updatePlayers(playersChosen, chosenBucc);

  // Choose 2 warriors
  const currentNumWar = playersChosen.filter((p) => p.isWar).length;
  let numMoreWarToGet = 2 - currentNumWar;
  // pref heroes and dk
  let chosenWar =
    numMoreWarToGet > 0 ? lists[2].splice(0, numMoreWarToGet) : [];
  chosenWar = chosenWar.map((p) => {
    const index = getHeroIndex(p) >= 0 ? getHeroIndex(p) : getDkIndex(p);
    return updateChar(p, index);
  });
  lists = updatePool(chosenWar, lists);
  playersChosen = updatePlayers(playersChosen, chosenWar);

  if (chosenWar.length < numMoreWarToGet) {
    numMoreWarToGet -= chosenWar.length;
    chosenWar = numMoreWarToGet > 0 ? lists[6].splice(0, numMoreWarToGet) : [];
    chosenWar = chosenWar.map((p) => updateChar(p, getPallyIndex(p)));
    lists = updatePool(chosenWar, lists);
    playersChosen = updatePlayers(playersChosen, chosenWar);
  }

  // Try to get 4 NL max
  const currentNumNL = playersChosen.filter((p) => p.isNL).length;
  const numMoreNLToGet = 4 - currentNumNL;
  let chosenNL = numMoreNLToGet > 0 ? lists[3].splice(0, numMoreNLToGet) : [];
  chosenNL = chosenNL.map((p) => updateChar(p, getNLIndex(p)));
  lists = updatePool(chosenNL, lists);
  playersChosen = updatePlayers(playersChosen, chosenNL);

  // Fill shad pt
  const currentNumShad = playersChosen.filter((p) => p.isShad).length;
  const numMoreShadToGet = 6 - currentNumShad;
  let chosenShad =
    numMoreShadToGet > 0 ? lists[1].splice(0, numMoreShadToGet) : [];
  chosenShad = chosenShad.map((p) => updateChar(p, getShadIndex(p)));
  lists = updatePool(chosenShad, lists);
  playersChosen = updatePlayers(playersChosen, chosenShad);

  // Fill by tiers
  for (let tier = 0; tier < lists.length; tier += 1) {
    let ps = lists[tier].map((p) => updateChar(p, indexOfCharAtTier(tier)));
    ps = updatePool(ps, lists);
    playersChosen = updatePlayers(playersChosen, ps);
  }

  return playersChosen;
};

const updatePool = (players, classList) => {
  const newList = [...classList];
  for (const p of players) {
    for (let i = 0; i < classList.length; i += 1) {
      newList[i] = newList[i].filter((listP) => p.id !== listP.id);
    }
  }
  return newList;
};

const updatePlayers = (players, chosenPlayers) =>
  players.map((p) => {
    const updatedP = chosenPlayers.find((cp) => p.id === cp.id);
    return { ...p, ...updatedP };
  });

const updateChar = (player, index) => ({
  ...player,
  chosenIndex: index,
  ...jobFlags(player.jobs[index]),
});
