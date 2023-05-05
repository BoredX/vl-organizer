import { Box, Stack, Button, Typography } from '@mui/material';
import './index.css';
import { useState } from 'react';
import PlayerForm from './components/PlayerForm';
import Roster from './components/Roster';
import TeamRow from './components/TeamRow';
import MiscRow from './components/MiscRow';
import BonusTable from './components/BonusTable';

const teamMap = {
  A: [
    { id: 1, name: 'John', job: 'Developer' },
    { id: 2, name: 'Sarah', job: 'Designer' },
  ],
  B: [
    { id: 3, name: 'Mike', job: 'Engineer' },
    { id: 4, name: 'Emily', job: 'Analyst' },
  ],
  C: [
    { id: 5, name: 'Tom', job: 'Manager' },
    { id: 6, name: 'Jenny', job: 'Developer' },
  ],
  D: [
    { id: 7, name: 'Harry', job: 'Designer' },
    { id: 8, name: 'Linda', job: 'Engineer' },
  ],
  E: [
    { id: 9, name: 'Peter', job: 'Analyst' },
    { id: 10, name: 'Nancy', job: 'Manager' },
  ],
};

const miscMap = {
  'Smoke Order': [
    { id: 1, name: 'John' },
    { id: 2, name: 'Jane' },
    { id: 3, name: 'Bob' },
    { id: 4, name: 'Alice' },
    { id: 5, name: 'Mark' },
    { id: 6, name: 'Lisa' },
  ],
  'TL order': [
    { id: 1, name: 'Charlie' },
    { id: 2, name: 'David' },
    { id: 3, name: 'Emily' },
    { id: 4, name: 'Frank' },
    { id: 5, name: 'Grace' },
    { id: 6, name: 'Henry' },
  ],
  'Res Order': [
    { id: 1, name: 'Isabella' },
    { id: 2, name: 'Jack' },
    { id: 3, name: 'Karen' },
    { id: 4, name: 'Liam' },
    { id: 5, name: 'Nancy' },
    { id: 6, name: 'Oliver' },
  ],
  Belts: [
    { id: 1, name: 'Pamela' },
    { id: 2, name: 'Quentin' },
    { id: 3, name: 'Rose' },
    { id: 4, name: 'Steven' },
    { id: 5, name: 'Tina' },
    { id: 6, name: 'Uma' },
  ],
};

const bonus = [
  { id: 1, name: 'John', boxes: [1, 2, 3] },
  { id: 2, name: 'Jane', boxes: [4, 5, 6] },
  { id: 3, name: 'Bob', boxes: [7, 8, 9] },
  { id: 4, name: 'Alice', boxes: [10, 11, 12] },
  { id: 5, name: 'Eve', boxes: [13, 14, 15] },
  { id: 6, name: 'Dave', boxes: [16, 17, 18] },
  { id: 7, name: 'Carol', boxes: [19, 20, 21] },
  { id: 8, name: 'Frank', boxes: [22, 23, 24] },
  { id: 9, name: 'George', boxes: [25, 26, 27] },
  { id: 10, name: 'Harry', boxes: [28, 29, 30] },
  { id: 11, name: 'Irene', boxes: [31, 32, 33] },
  { id: 12, name: 'Kevin', boxes: [34, 35, 36] },
  { id: 13, name: 'Laura', boxes: [37, 38, 39] },
  { id: 14, name: 'Mike', boxes: [40, 41, 42] },
  { id: 15, name: 'Nancy', boxes: [43, 44, 45] },
  { id: 16, name: 'Oscar', boxes: [46, 47, 48] },
  { id: 17, name: 'Peter', boxes: [49, 50, 51] },
  { id: 18, name: 'Quinn', boxes: [52, 53, 54] },
  { id: 19, name: 'Rachel', boxes: [55, 56, 57] },
  { id: 20, name: 'Steve', boxes: [58, 59, 60] },
];

const player = {
  id: 1,
  names: ['ign1', 'ign2'],
  jobs: ['NL', 'BS'],
  loots: ['belt', 'bonus'],
  isBonus: true,
  chosenName: 'ign1',
  chosenJob: 'NL',
  team: '',
  isShad: false,
  isBs: false,
  isBucc: false,
  boxes: ['a1', 'a2'],
};

function App() {
  const [players, setPlayers] = useState([]);

  const handleNewPlayer = (ps) => {
    setPlayers(
      ps.map((p, index) => ({
        ...p,
        id: index,
      }))
    );
  };

  const handleRemove = (id) => {
    setPlayers((prevPlayers) => {
      const updatedPlayers = prevPlayers.filter((p) => p.id !== id);
      return updatedPlayers.map((p, index) => ({
        ...p,
        id: index,
      }));
    });
  };

  return (
    <Box my={7} display="flex" alignItems="center" justifyContent="center">
      <Stack spacing={6}>
        <Box display="flex" justifyContent="center">
          <Typography variant="h3">VL Organizer</Typography>
        </Box>
        <Box display="flex" justifyContent="space-evenly">
          <Box>
            <PlayerForm players={players} onAddPlayer={handleNewPlayer} />
          </Box>
          <Box>
            <Button variant="contained" color="error">
              Reset Run
            </Button>
          </Box>
        </Box>
        <Roster players={players} onRemove={handleRemove} />
        <Button variant="contained" sx={{ color: 'primary' }}>
          Generate Team
        </Button>
        <TeamRow teamMap={teamMap} />
        <MiscRow miscMap={miscMap} />
        <Button variant="contained" color="success">
          Generate Bonus
        </Button>
        <Box display="flex" justifyContent="center">
          <BonusTable listBonus={bonus} />
        </Box>
        <img src="/vl_bonus.png" alt="Bonus map" />
      </Stack>
    </Box>
  );
}

export default App;
