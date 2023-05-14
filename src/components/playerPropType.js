import PropTypes from 'prop-types';

const playerPropType = {
  id: PropTypes.string,
  names: PropTypes.arrayOf(PropTypes.string),
  jobs: PropTypes.arrayOf(PropTypes.string),
  loots: PropTypes.arrayOf(PropTypes.string),
  sortedJobs: PropTypes.arrayOf(PropTypes.string),
  sortedLoots: PropTypes.arrayOf(PropTypes.string),
  chosenIndex: PropTypes.number, // -1 if not chosen which character to run
  partyIndex: PropTypes.number, // Only used to assign initial smoke order.
  isShad: PropTypes.bool,
  isBs: PropTypes.bool,
  isBucc: PropTypes.bool,
  isSe: PropTypes.bool,
  isWar: PropTypes.bool,
  isNl: PropTypes.bool,
  isSair: PropTypes.bool,
  isBonus: PropTypes.bool,
  isBelt: PropTypes.bool,
  isNx: PropTypes.bool,
  boxes: PropTypes.arrayOf(PropTypes.string),
};

export default playerPropType;
