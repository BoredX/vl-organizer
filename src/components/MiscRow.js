import PropTypes from 'prop-types';
import { Box } from '@mui/material';
import MiscTable from './MiscTable';

const MiscRow = ({ miscMap }) => (
  <Box display="flex" gap={4}>
    {Object.keys(miscMap).map((name) => (
      <MiscTable key={name} name={name} values={miscMap[name]} />
    ))}
  </Box>
);

MiscRow.propTypes = {
  miscMap: PropTypes.object,
};

export default MiscRow;
