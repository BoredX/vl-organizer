import { findLastIndex, shuffle, times } from 'lodash';
import { random } from './random';
import {
  Job,
  createJobPlayerList,
  getTier,
  getSortedJobsIndexByJob,
  getSortedJobsIndexByTier,
  jobFlags,
  getDisplayOrder,
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
  const nxLootersIndex = random(6, bonusLooters.length);
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
  if (bonusLooters.length < 6) return [];

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
  const playersWithLessBoxes = bonusLooters.filter(
    (p) => !moreBoxesPlayerIds.includes(p.id)
  );

  const getNumBoxes = (id) =>
    moreBoxesPlayerIds.includes(id) ? maxBoxPerPlayer : minBoxPerPlayer;
  let matrix = [];
  let moreBoxIndex = [];
  let lessBoxIndex = [];

  let sortedBonusLooters = [];
  if (maxBoxPerPlayer === 3 && bonusLooters.length >= 12) {
    // 12 looters =  6 people is 2 box,  6 people 3 box
    // 13 looters =  9 people is 2 box,  4 people 3 box
    // 14 looters = 12 people is 2 box,  2 people 3 box
    for (
      let minBoxIndex = 0, maxBoxIndex = 0;
      maxBoxIndex < moreBoxesPlayerIds.length;

    ) {
      // create rows of 23 32 for >= 12 people
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
  } else if (bonusLooters.length === 11) {
    // 8 people 3 box | 3 people 2 box
    matrix = [
      [0, 0, 1, 1, 1, 2, 2, 2, 3, 3],
      [4, 4, 4, 5, 5, 6, 6, 7, 7, 7],
      [8, 8, 8, 9, 5, 6, 9, 10, 10, 10],
    ];
    moreBoxIndex = [1, 2, 4, 5, 6, 7, 8, 10];
    lessBoxIndex = [0, 3, 9];
  } else if (bonusLooters.length === 10) {
    // 10 people 3 box
    matrix = [
      [0, 0, 0, 1, 1, 2, 2, 3, 3, 3],
      [4, 4, 4, 5, 1, 2, 6, 7, 7, 7],
      [8, 8, 8, 5, 5, 6, 6, 9, 9, 9],
    ];
    moreBoxIndex = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
    lessBoxIndex = [];
  } else if (bonusLooters.length === 9) {
    // 3 people 4 box | 6 people 3 box
    matrix = [
      [0, 0, 0, 1, 1, 2, 2, 3, 3, 3],
      [4, 4, 4, 4, 1, 2, 5, 5, 5, 5],
      [6, 6, 6, 6, 7, 7, 7, 8, 8, 8],
    ];
    moreBoxIndex = [4, 5, 6];
    lessBoxIndex = [0, 1, 2, 3, 7, 8];
  } else if (bonusLooters.length === 8) {
    // 6 people 4 box | 2 people 3 box
    matrix = [
      [0, 0, 0, 0, 1, 2, 3, 3, 3, 3],
      [4, 4, 4, 4, 1, 2, 5, 5, 5, 5],
      [6, 6, 6, 6, 1, 2, 7, 7, 7, 7],
    ];
    moreBoxIndex = [0, 3, 4, 5, 6, 7];
    lessBoxIndex = [1, 2];
  } else if (bonusLooters.length === 7) {
    // 2 people 5 box | 5 people 4 box
    matrix = [
      [0, 0, 0, 0, 0, 1, 1, 1, 1, 1],
      [2, 2, 2, 2, 3, 3, 4, 4, 4, 4],
      [5, 5, 5, 5, 3, 3, 6, 6, 6, 6],
    ];
    moreBoxIndex = [0, 1];
    lessBoxIndex = [2, 3, 4, 5, 6];
  } else if (bonusLooters.length === 6) {
    // 6 people 5 box
    matrix = [
      [0, 0, 0, 0, 0, 1, 1, 1, 1, 1],
      [2, 2, 2, 2, 2, 3, 3, 3, 3, 3],
      [4, 4, 4, 4, 4, 5, 5, 5, 5, 5],
    ];
    moreBoxIndex = [0, 1, 2, 3, 4, 5];
    lessBoxIndex = [];
  }
  if (bonusLooters.length < 12) {
    generateArrayedBonus(
      bonusLooters,
      matrix,
      moreBoxIndex,
      playersWithMoreBoxes,
      lessBoxIndex,
      playersWithLessBoxes
    );
  }

  const aLooters = bonusLooters.filter((p) => p.boxes.startsWith('a'));
  const bLooters = bonusLooters.filter((p) => p.boxes.startsWith('b'));
  const cLooters = bonusLooters.filter((p) => p.boxes.startsWith('c'));

  const compare = (a, b, letter) => {
    if (a.boxes.startsWith(`${letter}10`)) {
      return 1;
    }
    if (b.boxes.startsWith(`${letter}10`)) {
      return -1;
    }
    return a.boxes.localeCompare(b.boxes);
  };

  aLooters.sort((a, b) => compare(a, b, 'a'));
  bLooters.sort((a, b) => compare(a, b, 'b'));
  cLooters.sort((a, b) => compare(a, b, 'c'));

  const result = [];
  result.push(
    aLooters.map((p) => ({ boxes: p.boxes, name: p.names[p.chosenIndex] }))
  );
  result.push(
    bLooters.map((p) => ({ boxes: p.boxes, name: p.names[p.chosenIndex] }))
  );
  result.push(
    cLooters.map((p) => ({ boxes: p.boxes, name: p.names[p.chosenIndex] }))
  );
  return result;
};

const generateArrayedBonus = (
  bonusLooters,
  matrix,
  moreBoxIndex,
  playersWithMoreBoxes,
  lessBoxIndex,
  playersWithLessBoxes
) => {
  // 6  =  6 people 5 box
  // 7  =  2 people 5 box | 5 people 4 box
  // 8  =  6 people 4 box | 2 people 3 box
  // 9  =  3 people 4 box | 6 people 3 box
  // 10 = 10 people 3 box | 0 people 2 box
  // 11 =  8 people 3 box | 3 people 2 box
  // 12 =  6 people 3 box | 6 people 2 box
  const playerLootAssignment = Array(bonusLooters.length);

  let wipedPlayersWithMoreBoxes = playersWithMoreBoxes.map((p) => ({
    ...p,
    boxes: '',
  }));

  let wipedPlayersWithLessBoxes = shuffle(
    playersWithLessBoxes.map((p) => ({
      ...p,
      boxes: '',
    }))
  );

  const leftoverMoreBoxes =
    moreBoxIndex.length - wipedPlayersWithMoreBoxes.length;
  if (leftoverMoreBoxes > 0) {
    const nxLootersWithMoreBoxes = wipedPlayersWithLessBoxes.slice(
      0,
      leftoverMoreBoxes
    );
    wipedPlayersWithMoreBoxes = [
      ...wipedPlayersWithMoreBoxes,
      ...nxLootersWithMoreBoxes,
    ];
    wipedPlayersWithLessBoxes =
      wipedPlayersWithLessBoxes.slice(leftoverMoreBoxes);
  }

  let moreBoxIdx = 0;
  for (let pIdx = 0; pIdx < wipedPlayersWithMoreBoxes.length; pIdx += 1) {
    playerLootAssignment[moreBoxIndex[moreBoxIdx]] =
      wipedPlayersWithMoreBoxes[pIdx];
    moreBoxIdx += 1;
  }

  // Extra leftover more boxes

  let lessBoxIdx = 0;
  for (let pIdx = 0; pIdx < wipedPlayersWithLessBoxes.length; pIdx += 1) {
    playerLootAssignment[lessBoxIndex[lessBoxIdx]] =
      wipedPlayersWithLessBoxes[pIdx];
    lessBoxIdx += 1;
  }
  for (let row = 0; row < 3; row += 1) {
    for (let col = 0; col < 10; col += 1) {
      const letter = String.fromCharCode('a'.charCodeAt(0) + row);
      const box = letter + (col + 1);
      const plyr = bonusLooters.find(
        (p) => p.id === playerLootAssignment[matrix[row][col]].id
      );
      plyr.boxes += box;
    }
  }
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

  // choose SE - try to get 2 max (BMs first)
  const currentNumSe = players.filter((p) => p.isSe).length;
  let numMoreSeToGet = 2 - currentNumSe;
  let bms =
    numMoreSeToGet > 0 ? tiers[getTier(Job.BM)].splice(0, numMoreSeToGet) : [];
  bms = bms.map((p) =>
    updateCharBySortedIndex(p, getSortedJobsIndexByJob(Job.BM, p))
  );
  [tiers, players] = updatePlayersOnAdd(players, tiers, bms);

  // If not enough, get MMs
  numMoreSeToGet -= bms.length;
  let mms =
    numMoreSeToGet > 0 ? tiers[getTier(Job.MM)].splice(0, numMoreSeToGet) : [];
  mms = mms.map((p) =>
    updateCharBySortedIndex(p, getSortedJobsIndexByJob(Job.MM, p))
  );
  [tiers, players] = updatePlayersOnAdd(players, tiers, mms);

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

  const parties = generateParties(players);
  return [players, parties];
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

const generateParties = (players) => {
  const parties = times(5, () => []);

  const bs = shuffle(players.filter((p) => p.isBs));
  for (let i = 0; i < bs.length; i += 1) {
    parties[i].push(bs[i]);
  }

  let filled = parties.map((team) => team.length);
  // Put MMs in later parties where there is a bucc
  const se = players
    .filter((p) => p.isSe)
    .sort((a, b) => {
      if (a.isMm) {
        return 1;
      }
      if (b.isMm) {
        return -1;
      }
      return 0;
    });
  for (let i = 0; i < se.length; i += 1) {
    parties[i].push(se[i]);
  }

  const nl = shuffle(players.filter((p) => p.isNl));
  for (let i = 0; i < nl.length; i += 1) {
    filled = parties.map((team) => team.length);
    // fill up to 3 parties of NLs lmao
    if (filled[0] < 6) {
      parties[0].push(nl[i]);
    } else if (filled[1] < 6) {
      parties[1].push(nl[i]);
    } else if (filled[2] < 6) {
      parties[2].push(nl[i]);
    } else if (filled[3] < 6) {
      parties[3].push(nl[i]);
    }
  }

  const buccs = shuffle(players.filter((p) => p.isBucc));
  const sairs = shuffle(players.filter((p) => p.isSair));
  const shads = shuffle(players.filter((p) => p.isShad));
  const wars = shuffle(
    players
      .filter((p) => p.isWar)
      .sort((a, b) => {
        if (
          a.jobs[a.chosenIndex] === Job.DK &&
          (b.jobs[b.chosenIndex] === Job.Hero ||
            b.jobs[b.chosenIndex] === Job.Pally)
        ) {
          return -1;
        }

        return 1;
      })
  );

  for (let i = 0; i < 5; i += 1) {
    if (
      sairs.length > 0 ||
      wars.length > 0 ||
      buccs.length > 0 ||
      shads.length > 0
    ) {
      parties[i] = fillPartyWithOneWarSairRestBuccs(
        parties[i],
        sairs,
        wars,
        buccs
      );
      parties[i] = fillWithShads(parties[i], shads);
    }
  }

  return parties;
};

export const findShadPartyIndex = (parties) => {
  const numShadsArr = parties.map((pt) => pt.filter((pl) => pl.isShad).length);
  const shadPartyIndex = findLastIndex(numShadsArr, (numShad) => numShad !== 0);
  return shadPartyIndex;
};

const fillPartyWithOneWarSairRestBuccs = (party, sairs, wars, buccs) => {
  let newParty = [...party];
  if (party.length < 6) {
    let slotsLeft = 6 - party.length;
    let numSairs = sairs.length;
    let numWars = wars.length;
    let numWarAndSairInParty = party.filter((p) => p.isWar || p.isSair);
    while (
      slotsLeft >= 2 &&
      numWarAndSairInParty < 2 &&
      (numSairs > 0 || numWars > 0)
    ) {
      // fill a sair/war first - 2 max per party
      newParty = pickOneSairOrWar(newParty, sairs, wars);
      numSairs = sairs.length;
      numWars = wars.length;
      slotsLeft -= 1;
      numWarAndSairInParty += 1;
    }

    // Fill rest with buccs
    if (buccs.length > 0) {
      const fillBuccs = buccs.splice(0, slotsLeft);
      newParty = [...newParty, ...fillBuccs];
    }
  }
  return newParty;
};

const pickOneSairOrWar = (party, sairs, wars) => {
  // const slotsLeft = 6 - party.length;
  const numSairs = sairs.length;
  const numWars = wars.length;
  let newParty = [...party];
  if (numSairs > 0) {
    // const numFillSairs = Math.min(slotsLeft - 1, numSairs); // slotsleft-1 for bucc
    const fillSairs = sairs.splice(0, 1);
    newParty = [...newParty, ...fillSairs];
  } else if (numWars > 0) {
    // const numFillWars = Math.min(slotsLeft - 1, numWars); // slotsleft-1 for bucc
    const fillWars = wars.splice(0, 1);
    newParty = [...newParty, ...fillWars];
  }
  return newParty;
};

const fillWithShads = (party, shads) => {
  const slotsLeft = 6 - party.length;
  return [...party, ...shads.splice(0, slotsLeft)];
};

export const mapParties = (players, parties) => {
  let plyrs = [...players];
  const pts = [...parties];
  const sortedTeams = pts.map((party) => {
    party.sort((a, b) => getDisplayOrder(a) - getDisplayOrder(b));
    return party.map((p, playerIndex) => ({
      ...p,
      partyIndex: playerIndex,
    }));
  });
  const piArray = sortedTeams.flat();
  plyrs = plyrs.map((p) => {
    const piPlayer = piArray.find((pi) => p.id === pi.id);
    return { ...piPlayer };
  });
  return [plyrs, sortedTeams];
};

export const mapPartyOrder = (players) => {
  // res, tl, smoke, belt tables
  const tables = times(4, () => []);
  tables[0] = shuffle(players.filter((p) => p.isBs));
  tables[1] = shuffle(players.filter((p) => p.isBucc));
  tables[2] = []; // removed this shad party logic
  tables[3] = players.filter((p) => p.isBelt);
  return tables;
};

export const indexToPartyLetter = (i) =>
  String.fromCharCode(i + 'A'.charCodeAt(0));
