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

const Party = ({ name, players }) => (
  <TableContainer component={Paper} elevation={10}>
    <Table>
      <TableHead>
        <TableRow>
          <TableCell colSpan={2} align="center">
            Party {name}
          </TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {players.map((player) => (
          <TableRow
            key={player.id}
            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
          >
            <TableCell>{player.name}</TableCell>
            <TableCell>{player.job}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </TableContainer>
);

Party.propTypes = {
  name: PropTypes.string,
  players: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number,
      name: PropTypes.string,
      job: PropTypes.string,
    })
  ),
};

export default Party;
