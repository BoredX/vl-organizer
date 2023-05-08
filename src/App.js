import { Box, Stack, Button, Typography, Tooltip } from '@mui/material';
import './index.css';
import { useEffect, useState } from 'react';
import PlayerForm from './components/PlayerForm';
import Roster from './components/Roster';
import PartyRow from './components/PartyRow';
import MiscRow from './components/MiscRow';
import {
  generateBonusArray,
  generateTeam,
  numSuggestedBs,
  rollLoot,
  rollNx,
} from './utils/generator';
import BonusRow from './components/BonusRow';

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

function App() {
  const [players, setPlayers] = useState(() => {
    const savedPlayers = localStorage.getItem('players');
    return savedPlayers !== null ? JSON.parse(savedPlayers) : [];
  });
  const [editingPlayer, setEditingPlayer] = useState(null);
  // const [shadParty, setShadParty] = useState(null);
  // const [beltLooters, setBeltLooters] = useState([]);
  const [bonusArray, setBonusArray] = useState([[], [], []]);

  useEffect(() => {
    localStorage.setItem('players', JSON.stringify(players));
  }, [players]);

  const handleStartEdit = (pl) => {
    setEditingPlayer(pl);
  };

  const handleNewPlayer = (ps) => {
    if (ps.length <= 30) {
      setPlayers(
        ps.map((p, index) => ({
          ...p,
          id: index,
        }))
      );
    }
  };

  const handleUpdatePlayer = (updatedPlayer) => {
    setPlayers(
      players.map((p) => (p.id === updatedPlayer.id ? updatedPlayer : p))
    );
    setEditingPlayer(null);
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

  const handleToggleBelt = (id, isBelt) => {
    const newFlags = {
      isBelt: true,
      isBonus: false,
      isNx: false,
    };
    if (isBelt) {
      setPlayers(
        players.map((p) => (p.id === id ? { ...p, isBelt: false } : p))
      );
    } else {
      const numBelts = players.filter((p) => p.isBelt).length;
      if (numBelts < 6) {
        setPlayers(
          players.map((p) => (p.id === id ? { ...p, ...newFlags } : p))
        );
      }
    }
  };

  const handleToggleBonus = (id, isBonus) => {
    const newFlags = {
      isBelt: false,
      isBonus: true,
    };
    if (isBonus) {
      setPlayers(
        players.map((p) => (p.id === id ? { ...p, isBonus: false } : p))
      );
    } else {
      setPlayers(players.map((p) => (p.id === id ? { ...p, ...newFlags } : p)));
    }
  };

  const handleToggleNx = (id, isBelt, isNx) => {
    if (!isBelt) {
      setPlayers(players.map((p) => (p.id === id ? { ...p, isNx: !isNx } : p)));
    }
  };

  const handleRollLoot = () => {
    setPlayers(rollLoot(players));
  };

  const handleRollNx = () => {
    setPlayers(rollNx(players));
  };

  const handleGenerateBonus = () => {
    setBonusArray(generateBonusArray(players));
  };

  const handleGenerateTeam = () => {
    const numBsSuggest = numSuggestedBs(players);
    const numBs = prompt(`Maximum number of bs wanted:`, numBsSuggest);
    const numBucc = prompt('Minimum number of buccs wanted:', 4);
    generateTeam(players, numBs, numBucc);
    // generatePart;
    // setPlayers();
  };

  return (
    <Box my={7} display="flex" alignItems="center" justifyContent="center">
      <Stack spacing={6}>
        <Box display="flex" justifyContent="center">
          <Typography variant="h3">VL Organizer</Typography>
        </Box>
        <Box display="flex" justifyContent="space-evenly">
          <Box>
            <PlayerForm
              players={players}
              onAddPlayer={handleNewPlayer}
              editingPlayer={editingPlayer}
              onSubmitEdit={handleUpdatePlayer}
            />
          </Box>
          <Stack spacing={4}>
            <Button variant="contained" color="error">
              Reset Run
            </Button>
            <Button
              variant="contained"
              color="success"
              onClick={handleRollLoot}
            >
              Roll loot
            </Button>
            <Button variant="contained" color="success" onClick={handleRollNx}>
              Roll NX
            </Button>
          </Stack>
        </Box>
        <Roster
          players={players}
          onRemove={handleRemove}
          onEdit={handleStartEdit}
          onToggleBelt={handleToggleBelt}
          onToggleBonus={handleToggleBonus}
          onToggleNx={handleToggleNx}
        />
        <Button
          variant="contained"
          sx={{ color: 'primary' }}
          onClick={handleGenerateTeam}
        >
          Generate Team
        </Button>
        <PartyRow teamMap={teamMap} />
        <MiscRow miscMap={miscMap} />
        <Tooltip
          placement="top"
          title="Supports random layout for 12+ looters. NX looters have less box"
        >
          <Button
            variant="contained"
            color="success"
            onClick={handleGenerateBonus}
          >
            Generate Bonus
          </Button>
        </Tooltip>
        <Box display="flex" justifyContent="center">
          {bonusArray && <BonusRow bonusArray={bonusArray} />}
        </Box>
        <img src="/vl_bonus.png" alt="Bonus map" />
      </Stack>
    </Box>
  );
}

export default App;
