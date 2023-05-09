import { random } from './random';
import {
  Job,
  createJobPlayerList,
  getTier,
  getSortedJobsIndexByJob,
  getSortedJobsIndexByTier,
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

export const generateTeam = (inputPlayers, maxNumBs, minNumBucc, sortOrder) => {
  let [players, tiers] = createJobPlayerList(inputPlayers, sortOrder);
  console.log(sortOrder);

  //*              Select classes              *//

  // Single char signup only has one character to join on
  let singles = players.map((player) => {
    if (player.names.length === 1) {
      const jFlags = jobFlags(player.jobs[0]);
      return { ...player, chosenIndex: 0, ...jFlags };
    }
    return player;
  });

  singles = singles.filter((p) => p.names.length === 1);
  [tiers, players] = updatePlayersOnAdd(players, tiers, singles);

  // people who won belt roll should get priority of belt char
  let belts = players.filter((p) => p.isBelt);
  belts = belts.map((p) =>
    updateCharBySortedIndex(p, p.sortedLoots.indexOf('belt'))
  );
  [tiers, players] = updatePlayersOnAdd(players, tiers, belts);

  // choose bishops
  const currentNumBs = players.filter((p) => p.isBs).length;
  const numMoreBsToGet = maxNumBs - currentNumBs;
  let bses =
    numMoreBsToGet > 0 ? tiers[getTier(Job.BS)].splice(0, numMoreBsToGet) : [];
  bses = bses.map((p) =>
    updateCharBySortedIndex(p, getSortedJobsIndexByJob(Job.BS, p))
  );
  [tiers, players] = updatePlayersOnAdd(players, tiers, bses);

  // choose SE - try to get 2 max
  const currentNumSe = players.filter((p) => p.isSe).length;
  const numMoreSeToGet = 2 - currentNumSe;
  let ses =
    numMoreSeToGet > 0 ? tiers[getTier(Job.SE)].splice(0, numMoreSeToGet) : [];
  ses = ses.map((p) =>
    updateCharBySortedIndex(p, getSortedJobsIndexByJob(Job.SE, p))
  );
  [tiers, players] = updatePlayersOnAdd(players, tiers, ses);

  // Get requested number of buccs first
  const currentNumBucc = players.filter((p) => p.isBucc).length;
  const numMoreBuccToGet = minNumBucc - currentNumBucc;
  let buccs =
    numMoreBuccToGet > 0
      ? tiers[getTier(Job.Bucc)].splice(0, numMoreBuccToGet)
      : [];
  buccs = buccs.map((p) =>
    updateCharBySortedIndex(p, getSortedJobsIndexByJob(Job.Bucc, p))
  );
  [tiers, players] = updatePlayersOnAdd(players, tiers, buccs);
  // Choose 2 warriors
  const currentNumWar = players.filter((p) => p.isWar).length;
  let numMoreWarToGet = 2 - currentNumWar;
  // pref hero > dk > pally
  let heroes =
    numMoreWarToGet > 0
      ? tiers[getTier(Job.Hero)].splice(0, numMoreWarToGet)
      : [];
  heroes = heroes.map((p) =>
    updateCharBySortedIndex(p, getSortedJobsIndexByJob(Job.Hero, p))
  );
  [tiers, players] = updatePlayersOnAdd(players, tiers, heroes);

  let dks = [];
  if (heroes.length < numMoreWarToGet) {
    numMoreWarToGet -= heroes.length;
    dks =
      numMoreWarToGet > 0
        ? tiers[getTier(Job.DK)].splice(0, numMoreWarToGet)
        : [];
    dks = dks.map((p) =>
      updateCharBySortedIndex(p, getSortedJobsIndexByJob(Job.DK, p))
    );
    [tiers, players] = updatePlayersOnAdd(players, tiers, dks);
  }

  let pallies = [];
  if (dks.length < numMoreWarToGet) {
    numMoreWarToGet -= dks.length;
    pallies =
      numMoreWarToGet > 0
        ? tiers[getTier(Job.Pally)].splice(0, numMoreWarToGet)
        : [];
    pallies = pallies.map((p) =>
      updateCharBySortedIndex(p, getSortedJobsIndexByJob(Job.Pally, p))
    );
    [tiers, players] = updatePlayersOnAdd(players, tiers, pallies);
  }

  // Try to get 4 NL max
  const currentNumNL = players.filter((p) => p.isNl).length;
  const numMoreNLToGet = 4 - currentNumNL;
  let nls =
    numMoreNLToGet > 0 ? tiers[getTier(Job.NL)].splice(0, numMoreNLToGet) : [];
  nls = nls.map((p) =>
    updateCharBySortedIndex(p, getSortedJobsIndexByJob(Job.NL, p))
  );
  [tiers, players] = updatePlayersOnAdd(players, tiers, nls);

  // Fill shad pt with 6
  const currentNumShad = players.filter((p) => p.isShad).length;
  const numMoreShadToGet = 6 - currentNumShad;
  let shads =
    numMoreShadToGet > 0
      ? tiers[getTier(Job.Shad)].splice(0, numMoreShadToGet)
      : [];
  shads = shads.map((p) =>
    updateCharBySortedIndex(p, getSortedJobsIndexByJob(Job.Shad, p))
  );
  [tiers, players] = updatePlayersOnAdd(players, tiers, shads);

  // Fill by tiers
  for (let tier = 0; tier < tiers.length; tier += 1) {
    const ps = tiers[tier].map((p) =>
      updateCharBySortedIndex(p, getSortedJobsIndexByTier(tier, p))
    );
    [tiers, players] = updatePlayersOnAdd(players, tiers, ps);
  }
  console.log(tiers);
  console.log(players);
  return players;
};

const updateCharPool = (players, classList) => {
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

const updatePlayersOnAdd = (currentPlayers, tiers, chosenPlayers) => {
  const updatedTiers = updateCharPool(chosenPlayers, tiers);
  const updatedPlayers = updatePlayers(currentPlayers, chosenPlayers);
  return [updatedTiers, updatedPlayers];
};

const updateCharBySortedIndex = (player, sortedIndex) => {
  const job = player.sortedJobs[sortedIndex];
  const originalIndex = player.jobs.findIndex((j) => j === job);

  return {
    ...player,
    chosenIndex: originalIndex,
    ...jobFlags(player.jobs[originalIndex]),
  };
};
