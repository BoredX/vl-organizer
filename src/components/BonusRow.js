import PropTypes from 'prop-types';
import { Box } from '@mui/material';
import BonusTable from './BonusTable';

const BonusRow = ({ bonusArray }) => (
  <Box display="flex" gap={4}>
    {bonusArray.map((letter, i) => {
      if (letter.length === 0) {
        return null;
      }
      return <BonusTable key={i} bonusPlayers={bonusArray[i]} />;
    })}
  </Box>
);

BonusRow.propTypes = {
  bonusArray: PropTypes.arrayOf(
    PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string,
        boxes: PropTypes.string,
      })
    )
  ),
};

export default BonusRow;
