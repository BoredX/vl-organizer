import PropTypes from 'prop-types';

import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';

const MiscTable = ({ name, players }) => (
  <TableContainer component={Paper} elevation={10}>
    <Table>
      <TableHead>
        <TableRow>
          <TableCell colSpan={2} align="center">
            {name}
          </TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {players.map((p) => (
          <TableRow
            key={p.id}
            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
          >
            <TableCell>{p.names[p.chosenIndex]}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </TableContainer>
);

MiscTable.propTypes = {
  name: PropTypes.string,
  players: PropTypes.arrayOf(PropTypes.object),
};

export default MiscTable;
