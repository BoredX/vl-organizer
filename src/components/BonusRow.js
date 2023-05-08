import PropTypes from 'prop-types';
import { Box } from '@mui/material';
import BonusTable from './BonusTable';

const BonusRow = ({ bonusArray }) => (
  <Box display="flex" gap={4}>
    <BonusTable bonusPlayers={bonusArray[0]} />
    <BonusTable bonusPlayers={bonusArray[1]} />
    <BonusTable bonusPlayers={bonusArray[2]} />
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
