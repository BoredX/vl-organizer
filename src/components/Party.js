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

const Party = ({ party }) => (
  <TableContainer component={Paper} elevation={10}>
    <Table>
      <TableHead>
        <TableRow>
          <TableCell colSpan={2} align="center">
            Party {party.name}
          </TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {party.players.map((p) => (
          <TableRow
            key={p.id}
            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
          >
            <TableCell>{p.names[p.chosenIndex]}</TableCell>
            <TableCell>{p.jobs[p.chosenIndex]}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </TableContainer>
);

Party.propTypes = {
  party: PropTypes.shape({
    name: PropTypes.string,
    players: PropTypes.arrayOf(PropTypes.object),
  }),
};

export default Party;
