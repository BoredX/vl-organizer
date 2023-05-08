import PropTypes from 'prop-types';
import { Box } from '@mui/material';
import Party from './Party';

const PartyRow = ({ teamMap }) => (
  <Box display="flex" gap={4}>
    {Object.keys(teamMap).map((name) => (
      <Party name={name} players={teamMap[name]} />
    ))}
  </Box>
);

const playerType = PropTypes.shape({
  id: PropTypes.number,
  name: PropTypes.string,
  job: PropTypes.string,
});

PartyRow.propTypes = {
  teamMap: PropTypes.objectOf(PropTypes.arrayOf(playerType)),
};

export default PartyRow;
