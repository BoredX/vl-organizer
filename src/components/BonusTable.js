import PropTypes from 'prop-types';
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
} from '@mui/material';

const BonusTable = ({ bonusPlayers }) => (
  <Box>
    <TableContainer component={Paper} elevation={10}>
      <Table>
        <TableBody>
          {bonusPlayers.map((player) => (
            <TableRow
              key={player.name}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell>{player.boxes}</TableCell>
              <TableCell>{player.name}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  </Box>
);

BonusTable.propTypes = {
  bonusPlayers: PropTypes.arrayOf(
    PropTypes.shape({
      boxes: PropTypes.string,
      name: PropTypes.string,
    })
  ),
};
export default BonusTable;
