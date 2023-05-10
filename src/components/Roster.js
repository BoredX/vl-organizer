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

const Roster = ({
  players,
  onRemove,
  onEdit,
  onToggleBonus,
  onToggleBelt,
  onToggleNx,
}) => (
  <TableContainer component={Paper} elevation={10}>
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>No.</TableCell>
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
            <TableCell>{player.id + 1}</TableCell>
            <TableCell>{player.names.join(', ')}</TableCell>
            <TableCell>
              {player.jobs.map((job, i) => {
                const file = job.toLowerCase();
                return (
                  <img
                    id={file}
                    src={`${file}.png`}
                    alt={i < player.jobs.length - 1 ? `${job},` : job}
                    style={{ marginRight: i < players.length - 1 ? '4px' : 0 }}
                  />
                );
              })}
            </TableCell>
            <TableCell>{player.loots.join(', ')}</TableCell>
            <TableCell>
              <Stack direction="row" spacing={1}>
                <ToggleButtonGroup>
                  <ToggleButton
                    variant="contained"
                    size="small"
                    sx={{ bgcolor: 'success.light' }}
                    value="belt"
                    selected={!player.isBelt}
                    onClick={() =>
                      onToggleBelt(player.id, player.isBelt, player.isNx)
                    }
                  >
                    Belt
                  </ToggleButton>
                </ToggleButtonGroup>
                <ToggleButtonGroup>
                  <ToggleButton
                    variant="contained"
                    size="small"
                    sx={{ bgcolor: 'success.light' }}
                    value="nx"
                    selected={!player.isNx}
                    onClick={() =>
                      onToggleNx(player.id, player.isBelt, player.isNx)
                    }
                  >
                    NX
                  </ToggleButton>
                </ToggleButtonGroup>
                <ToggleButtonGroup>
                  <ToggleButton
                    variant="contained"
                    size="small"
                    sx={{ bgcolor: 'success.light' }}
                    value="bonus"
                    selected={!player.isBonus}
                    onClick={() => onToggleBonus(player.id, player.isBonus)}
                  >
                    Bonus
                  </ToggleButton>
                </ToggleButtonGroup>
                <Button
                  variant="contained"
                  size="small"
                  onClick={() => onEdit(player)}
                >
                  Edit
                </Button>
                <Button
                  variant="contained"
                  size="small"
                  color="error"
                  onClick={() => onRemove(player.id)}
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

Roster.propTypes = playerPropType;

export default Roster;
