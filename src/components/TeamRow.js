import PropTypes from 'prop-types';
import { Box } from '@mui/material';
import Team from './Team';

const TeamRow = ({ teamMap }) => (
  <Box display="flex" gap={4}>
    {Object.keys(teamMap).map((name) => (
      <Team name={name} players={teamMap[name]} />
    ))}
  </Box>
);

const playerType = PropTypes.shape({
  id: PropTypes.number,
  name: PropTypes.string,
  job: PropTypes.string,
});

TeamRow.propTypes = {
  teamMap: PropTypes.objectOf(PropTypes.arrayOf(playerType)),
};

export default TeamRow;
