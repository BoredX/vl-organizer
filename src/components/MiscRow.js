import PropTypes from 'prop-types';
import { Box } from '@mui/material';
import MiscTable from './MiscTable';

const MiscRow = ({ partyOrders, onOrderChange }) => (
  <Box display="flex" gap={4}>
    {partyOrders.length > 0 &&
      partyOrders.map((players, i) => {
        if (i === 0 && players.length > 0) {
          return (
            <MiscTable
              key="res"
              ptIndex={i}
              name="Res Order"
              players={players}
              onOrderChange={onOrderChange}
            />
          );
        }
        if (i === 1 && players.length > 0) {
          return (
            <MiscTable
              key="tl"
              ptIndex={i}
              name="TL Order"
              players={players}
              onOrderChange={onOrderChange}
            />
          );
        }
        if (i === 2 && players.length > 0) {
          return (
            <MiscTable
              key="smoke"
              ptIndex={i}
              name="Smoke Order"
              players={players}
              onOrderChange={onOrderChange}
            />
          );
        }
        if (i === 3 && players.length > 0) {
          return (
            <MiscTable
              key="belts"
              ptIndex={i}
              name="Belts"
              players={players}
              onOrderChange={onOrderChange}
            />
          );
        }
        return null;
      })}
  </Box>
);

MiscRow.propTypes = {
  partyOrders: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.object)),
  onOrderChange: PropTypes.func,
};

export default MiscRow;
