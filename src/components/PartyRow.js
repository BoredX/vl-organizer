import PropTypes from 'prop-types';
import { Box } from '@mui/material';
import Party from './Party';

const PartyRow = ({ parties }) => (
  <Box display="flex" gap={4}>
    {parties.map((party) => {
      if (party.players.length === 0) {
        return null;
      }
      return <Party key={party.name} party={party} />;
    })}
  </Box>
);

PartyRow.propTypes = {
  parties: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
      players: PropTypes.arrayOf(PropTypes.object),
    })
  ),
};

export default PartyRow;
