export const jobMapping = {
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

export const Job = (() => {
  const jobs = {};
  for (const key of Object.keys(jobMapping)) {
    jobs[key] = key;
  }
  return jobs;
})();

export const jobFlags = (job) => ({
  isBs: job === 'BS',
  isShad: job === 'Shad',
  isBucc: job === 'Bucc',
  isSe: job === 'SE',
  isWar: job === 'DK' || job === 'Hero' || job === 'Pally',
  isNl: job === 'NL',
  isSair: job === 'Sair',
});

// Tier list should match tier list "lists" ordering in generateTeam.
export const indexOfCharAtTier = (tier, player) => {
  let indexOfJobInChar;
  switch (tier) {
    case 0:
      indexOfJobInChar = getBuccIndex(player);
      break;
    case 1:
      indexOfJobInChar = getShadIndex(player);
      break;
    case 2:
      indexOfJobInChar =
        getHeroIndex(player) >= 0 ? getHeroIndex(player) : getDkIndex(player);
      break;
    case 3:
      indexOfJobInChar = getNLIndex(player);
      break;
    case 4:
      indexOfJobInChar = getSEIndex(player);
      break;
    case 5:
      indexOfJobInChar = getSairIndex(player);
      break;
    case 6:
      indexOfJobInChar = getPallyIndex(player);
      break;
    case 7:
      indexOfJobInChar = getBSIndex(player);
      break;
    default:
      indexOfJobInChar = 0;
  }

  return indexOfJobInChar;
};

export const getBSIndex = (player) => player.jobs.indexOf('BS');

export const getSEIndex = (player) => player.jobs.indexOf('SE');

export const getDkIndex = (player) => player.jobs.indexOf('DK');

export const getHeroIndex = (player) => player.jobs.indexOf('Hero');

export const getPallyIndex = (player) => player.jobs.indexOf('Pally');

export const getBuccIndex = (player) => player.jobs.indexOf('Bucc');

export const getShadIndex = (player) => player.jobs.indexOf('Shad');

export const getNLIndex = (player) => player.jobs.indexOf('NL');

export const getSairIndex = (player) => player.jobs.indexOf('Sair');
