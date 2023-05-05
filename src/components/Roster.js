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
} from '@mui/material';

const Roster = () => (
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
        {rows.map((player) => (
          <TableRow
            key={player.id}
            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
          >
            <TableCell>{player.names.join(', ')}</TableCell>
            <TableCell>{player.jobs.join(', ')}</TableCell>
            <TableCell>{player.loots.join(', ')}</TableCell>
            <TableCell>
              <Stack direction="row" spacing={1} justifyContent="right">
                <Button
                  variant="contained"
                  size="small"
                  sx={{ bgcolor: 'primary.light' }}
                >
                  No Bonus
                </Button>
                <Button variant="contained" size="small">
                  Edit
                </Button>
                <Button variant="contained" size="small" color="error">
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

const rows = [
  {
    id: 1,
    names: ['Alice', 'Bob'],
    jobs: ['Developer', 'Designer'],
    loots: [10, 20],
  },
  {
    id: 2,
    names: ['Charlie', 'David'],
    jobs: ['Manager', 'Analyst'],
    loots: [15, 25],
  },
  {
    id: 3,
    names: ['Eve', 'Frank'],
    jobs: ['Engineer', 'Architect'],
    loots: [5, 30, 'bonus'],
  },
];

export default Roster;
