import PropTypes from 'prop-types';
import { Box } from '@mui/material';
import MiscTable from './MiscTable';

const MiscRow = ({ miscTables }) => (
  <Box display="flex" gap={4}>
    {miscTables.length > 0 &&
      miscTables.map((players, i) => {
        if (i === 0 && players.length > 0) {
          return <MiscTable key="res" name="Res Order" players={players} />;
        }
        if (i === 1 && players.length > 0) {
          console.log('mis tables', miscTables);
          return <MiscTable key="tl" name="TL Order" players={players} />;
        }
        if (i === 2 && players.length > 0) {
          return <MiscTable key="smoke" name="Smoke Order" players={players} />;
        }
        if (i === 3 && players.length > 0) {
          return <MiscTable key="belts" name="Belts" players={players} />;
        }
        return null;
      })}
  </Box>
);

MiscRow.propTypes = {
  miscTables: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.object)),
};

export default MiscRow;
