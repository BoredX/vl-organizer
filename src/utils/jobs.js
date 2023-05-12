import { invert, random } from 'lodash';

const jobNameMapping = {
  NL: ['nl'],
  Shad: ['shadower', 'shad'],
  DK: ['dk', 'drk', 'dark'],
  Pally: ['pally', 'paly'],
  Hero: ['hero'],
  Bucc: ['bucc', 'buc', 'buccaneer'],
  Sair: ['sair'],
  SE: ['mm', 'bm', 'se'],
  BS: ['bs', 'bishop', 'bish', 'bis'],
};

const reverseMap = (map) =>
  Object.entries(map).reduce((acc, [key, values]) => {
    values.forEach((value) => {
      acc[value] = key;
    });
    return acc;
  }, {});

export const reverseJobNamesMap = reverseMap(jobNameMapping);

export const Job = (() => {
  const jobs = {};
  for (const key of Object.keys(jobNameMapping)) {
    jobs[key] = key;
  }
  return jobs;
})();

export const jobFlags = (job) => ({
  isBs: job === Job.BS,
  isShad: job === Job.Shad,
  isBucc: job === Job.Bucc,
  isSe: job === Job.SE,
  isWar: job === Job.DK || job === Job.Hero || job === Job.Pally,
  isNl: job === Job.NL,
  isSair: job === Job.Sair,
});

export const resetPlayer = {
  chosenIndex: -1,
  partyIndex: -1,
  isShad: false,
  isBs: false,
  isBucc: false,
  isSe: false,
  isWar: false,
  isNl: false,
  isSair: false,
  boxes: [],
};

const tierList = (() => ({
  Bucc: 0,
  Shad: 1,
  Hero: 2,
  DK: 3,
  NL: 4,
  SE: 5,
  Sair: 6,
  Pally: 7,
  BS: 8,
}))();

const reverseTierList = invert(tierList);

export const getTier = (job) => tierList[job];

const jobDisplayMap = {
  NL: 0,
  Sair: 1,
  Hero: 2,
  DK: 3,
  Pally: 4,
  Shad: 5,
  Bucc: 6,
  SE: 7,
  BS: 8,
};

export const getDisplayOrder = (player) =>
  jobDisplayMap[player.jobs[player.chosenIndex]];

export const getSortedJobsIndexByTier = (tier, player) => {
  const job = reverseTierList[tier];
  return player.sortedJobs.indexOf(job);
};

export const getSortedJobsIndexByJob = (job, player) =>
  player.sortedJobs.indexOf(job);

export const createJobPlayerList = (players, sortOrder) => {
  let sortedPlayers = [...players];
  // Sort by player choice or by tier
  if (sortOrder === 'damage') {
    sortedPlayers = sortedPlayers.map((p) => {
      const sortedPlayer = {
        ...p,
        sortedJobs: [...p.jobs].sort((a, b) => getTier(a) - getTier(b)),
      };

      return {
        ...sortedPlayer,
        ...resetPlayer,
        sortedLoots: sortedPlayer.sortedJobs.map(
          (job) => sortedPlayer.loots[sortedPlayer.jobs.indexOf(job)]
        ),
      };
    });
  } else {
    sortedPlayers = players.map((p) => ({
      ...p,
      ...resetPlayer,
      sortedJobs: [...p.jobs],
      sortedLoots: [...p.loots],
    }));
  }

  const tierListWithPlayers = [];
  for (let tier = 0; tier < Object.keys(reverseTierList).length; tier += 1) {
    const ps = sortedPlayers.filter((p) =>
      p.jobs.includes(reverseTierList[tier])
    );
    ps.sort((a, b) => {
      if (
        a.isBelt &&
        a.sortedLoots[getSortedJobsIndexByTier(tier, a)] === 'belt'
      ) {
        return -1;
      }
      if (
        b.isBelt &&
        b.sortedLoots[getSortedJobsIndexByTier(tier, b)] === 'belt'
      ) {
        return 1;
      }
      if (a.jobs.length - b.jobs.length === 0) {
        return random(-1, 1);
      }
      return a.jobs.length - b.jobs.length;
    });
    tierListWithPlayers[tier] = ps;
  }
  // Each element is an array of players having that job.
  return [sortedPlayers, tierListWithPlayers];
};
