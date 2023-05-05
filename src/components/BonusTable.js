import PropTypes from 'prop-types';
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';

const BonusTable = ({ listBonus }) => (
  <Box>
    <TableContainer component={Paper} elevation={10}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell colSpan={2} align="center">
              Bonus
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {listBonus.map((player) => (
            <TableRow
              key={player.id}
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
  listBonus: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      name: PropTypes.string,
      boxes: PropTypes.string,
    })
  ),
};
export default BonusTable;
