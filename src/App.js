import { Box, Stack, Button, Typography, Tooltip } from '@mui/material';
import './index.css';
import { useEffect, useRef, useState } from 'react';
import PlayerForm from './components/PlayerForm';
import Roster from './components/Roster';
import PartyRow from './components/PartyRow';
import MiscRow from './components/MiscRow';
import BonusRow from './components/BonusRow';
import TeamForm from './components/TeamForm';
import {
  generateBonusArray,
  generateTeam,
  mapPartyOrder,
  mapParties,
  numSuggestedBs,
  rollLoot,
  rollNx,
} from './utils/generator';
import { Job } from './utils/jobs';

function App() {
  const [players, setPlayers] = useState(() => {
    const savedPlayers = localStorage.getItem('players');
    return savedPlayers !== null ? JSON.parse(savedPlayers) : [];
  });
  const [editingPlayer, setEditingPlayer] = useState(null);
  const [bonusArray, setBonusArray] = useState(() => {
    const savedBonus = localStorage.getItem('bonus');
    return savedBonus !== null ? JSON.parse(savedBonus) : [];
  });
  const [partyArray, setPartyArray] = useState(() => {
    const savedParty = localStorage.getItem('parties');
    return savedParty !== null ? JSON.parse(savedParty) : [];
  });
  const [partyOrderArray, setPartyOrderArray] = useState([]);

  useEffect(() => {
    localStorage.setItem('players', JSON.stringify(players));
    localStorage.setItem('bonus', JSON.stringify(bonusArray));
    localStorage.setItem('parties', JSON.stringify(partyArray));
  }, [players, bonusArray, partyArray]);

  const inputRef = useRef(null);

  const handleStartEdit = (pl) => {
    setEditingPlayer(pl);
    inputRef.current.focus();
    const valueLength = inputRef.current.value.length;
    inputRef.current.setSelectionRange(valueLength, valueLength);
    inputRef.current.scrollIntoView({
      behavior: 'smooth',
      block: 'end',
    });
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

  const handleGenerateTeam = (numBs, numBucc, sortOrder) => {
    let [plyrs, parties] = generateTeam(players, numBs, numBucc, sortOrder);
    let pts;
    [plyrs, pts] = mapParties(plyrs, parties);
    const partyOrder = mapPartyOrder(plyrs);

    setPlayers(plyrs);
    setPartyArray(pts);
    setPartyOrderArray(partyOrder);
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
              inputRef={inputRef}
              onSubmitEdit={handleUpdatePlayer}
            />
          </Box>
          <Stack spacing={4}>
            {/* <Button variant="contained" color="error">
              Reset Run
            </Button> */}
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
        <TeamForm
          bsSigned={players.filter((p) => p.jobs.includes(Job.BS)).length}
          buccSigned={players.filter((p) => p.jobs.includes(Job.Bucc)).length}
          numBsSuggest={numSuggestedBs(players)}
          onGenerateTeam={handleGenerateTeam}
        />
        <PartyRow parties={partyArray} />
        <MiscRow miscTables={partyOrderArray} />
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
          <BonusRow bonusArray={bonusArray} />
        </Box>
        <img src="/vl_bonus.png" alt="Bonus map" />
      </Stack>
    </Box>
  );
}

export default App;
