import PropTypes from 'prop-types';

const playerPropType = {
  id: PropTypes.number,
  names: PropTypes.arrayOf(PropTypes.string),
  jobs: PropTypes.arrayOf(PropTypes.string),
  loots: PropTypes.arrayOf(PropTypes.string),
  chosenIndex: PropTypes.number,
  team: PropTypes.string,
  isShad: PropTypes.bool,
  isBs: PropTypes.bool,
  isBucc: PropTypes.bool,
  isBonus: PropTypes.bool,
  isBelt: PropTypes.bool,
  boxes: PropTypes.arrayOf(PropTypes.string),
};

export default playerPropType;
