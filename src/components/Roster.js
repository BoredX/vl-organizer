import {
  Button,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Paper,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
} from '@mui/material';
import playerPropType from './playerPropType';

const Roster = ({ players, onRemove }) => {
  const handleRemove = (id) => {
    onRemove(id);
  };
  return (
    <TableContainer component={Paper} elevation={10} style={{ minWidth: 1000 }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>IGNs</TableCell>
            <TableCell>Jobs</TableCell>
            <TableCell>Loot</TableCell>
            <TableCell style={{ width: 10 }}>Action</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {players.map((player) => (
            <TableRow
              key={player.id}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell>{player.names.join(', ')}</TableCell>
              <TableCell>{player.jobs.join(', ')}</TableCell>
              <TableCell>{player.loots.join(', ')}</TableCell>
              <TableCell>
                <Stack direction="row" spacing={1}>
                  <ToggleButtonGroup>
                    <ToggleButton
                      variant="contained"
                      size="small"
                      sx={{ bgcolor: 'success.light' }}
                      value="bonus"
                    >
                      Bonus
                    </ToggleButton>
                  </ToggleButtonGroup>
                  <Button variant="contained" size="small">
                    Edit
                  </Button>
                  <Button
                    variant="contained"
                    size="small"
                    color="error"
                    onClick={() => handleRemove(player.id)}
                  >
                    Remove
                  </Button>
                </Stack>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

Roster.propTypes = playerPropType;

export default Roster;
