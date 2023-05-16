import PropTypes from 'prop-types';
import playerPropType from './playerPropType';

const runPropType = {
  id: PropTypes.string,
  name: PropTypes.string,
  players: PropTypes.arrayOf(PropTypes.shape(playerPropType)),
  partyArray: PropTypes.arrayOf(
    PropTypes.arrayOf(PropTypes.shape(playerPropType))
  ),
  partyOrderArray: PropTypes.arrayOf(
    PropTypes.arrayOf(PropTypes.shape(playerPropType))
  ),
};

export default runPropType;
