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
  findShadPartyIndex,
} from './utils/generator';
import { Job, jobFlags } from './utils/jobs';
import CopyRow from './components/CopyRow';

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
  const [partyOrderArray, setPartyOrderArray] = useState(() => {
    const savedPartyOrder = localStorage.getItem('partyOrder');
    return savedPartyOrder !== null ? JSON.parse(savedPartyOrder) : [];
  });

  useEffect(() => {
    localStorage.setItem('players', JSON.stringify(players));
    localStorage.setItem('bonus', JSON.stringify(bonusArray));
    localStorage.setItem('parties', JSON.stringify(partyArray));
    localStorage.setItem('partyOrder', JSON.stringify(partyOrderArray));
  }, [players, bonusArray, partyArray, partyOrderArray]);

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

  const handleJobChange = (id, chosenIndex) => {
    const player = players.find((p) => p.id === id);
    let changedPlayer = { ...player };

    setPartyOrderArray((prevPartyOrder) => {
      const newPartyOrder = [...prevPartyOrder];
      let oldIndexWithinTable = -1;
      let oldPartyTablesIndex = -1;

      for (
        let j = 0;
        j < newPartyOrder.length - 1 && oldIndexWithinTable < 0; // -1 because last party order is is belt
        j += 1
      ) {
        oldIndexWithinTable = newPartyOrder[j].findIndex((p) => p.id === id);
        if (oldIndexWithinTable >= 0) {
          oldPartyTablesIndex = j;
        }
        // TODO when the char that got swithced had a belt, but now is not wanting one, need to send a Snackbox
      }

      // Remove from old party Order if they were in special party
      if (
        oldPartyTablesIndex >= 0 &&
        (changedPlayer.isBs || changedPlayer.isBucc)
      ) {
        newPartyOrder[oldPartyTablesIndex] = newPartyOrder[
          oldPartyTablesIndex
        ].filter((p) => p.id !== id);
      }

      // reset jobs - and do new player stuff
      const newJob = changedPlayer.jobs[chosenIndex];
      changedPlayer = {
        ...changedPlayer,
        chosenIndex,
        ...jobFlags(newJob),
      };
      // Check if they should be put into a new one
      if (changedPlayer.isBs) {
        newPartyOrder[0] = [...newPartyOrder[0], { ...changedPlayer }];
      }
      if (changedPlayer.isBucc) {
        newPartyOrder[1] = [...newPartyOrder[1], { ...changedPlayer }];
      }
      return newPartyOrder;
    });

    setPartyArray((prevParties) =>
      prevParties.map((party) => ({
        ...party,
        players: party.players.map((p) => (p.id === id ? changedPlayer : p)),
      }))
    );

    setPlayers((prevPlayers) =>
      prevPlayers.map((p) => (p.id === id ? changedPlayer : p))
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
    setPartyArray((prevParties) =>
      prevParties.map((party) => ({
        ...party,
        players: party.players.filter((p) => p.id !== id),
      }))
    );
    setPartyOrderArray((prevPartyOrder) =>
      prevPartyOrder.map((party) => party.filter((p) => p.id !== id))
    );
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

  /*     Drag and drop handlers     */
  const handleChangeParty = (
    updatedPlayer,
    parties,
    sourcePtIndex,
    destPtIndex
  ) => {
    const newParty = [...parties];
    newParty[sourcePtIndex].players = newParty[sourcePtIndex].players.map(
      (p, i) => ({
        ...p,
        partyIndex: i,
      })
    );
    newParty[destPtIndex].players = newParty[destPtIndex].players.map(
      (p, i) => ({
        ...p,
        partyIndex: i,
      })
    );
    setPartyArray(newParty);

    setPlayers((oldPlayers) =>
      oldPlayers.map((p) => {
        let player = newParty[sourcePtIndex].players.find(
          (pPlayers) => pPlayers.id === p.id
        );

        if (!player) {
          player = newParty[destPtIndex].players.find(
            (pPlayers) => pPlayers.id === p.id
          );
        }
        return player ? { ...p, partyIndex: player.partyIndex } : p;
      })
    );
  };

  const handleOrderChange = (i, ptOrder) => {
    const newPartyOrder = [...partyOrderArray];
    newPartyOrder[i] = ptOrder;
    setPartyOrderArray(newPartyOrder);
  };

  /*   Drag and drop handlers end   */

  const shadParty = () => {
    const index = findShadPartyIndex(partyArray);
    return partyArray[index].players.filter((p) => p.isShad);
  };

  return (
    <Box my={7} display="flex" alignItems="center" justifyContent="center">
      <Stack spacing={6}>
        <Box display="flex" justifyContent="center">
          <Typography variant="h3">VL Organizer</Typography>
        </Box>
        <Box display="flex" justifyContent="center" columnGap={10}>
          <Box>
            <PlayerForm
              players={players}
              onAddPlayer={handleNewPlayer}
              editingPlayer={editingPlayer}
              inputRef={inputRef}
              onSubmitEdit={handleUpdatePlayer}
            />
          </Box>
          <Stack spacing={2} marginTop={2}>
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
          onJobChange={handleJobChange}
        />
        <TeamForm
          bsSigned={players.filter((p) => p.jobs.includes(Job.BS)).length}
          buccSigned={players.filter((p) => p.jobs.includes(Job.Bucc)).length}
          numBsSuggest={numSuggestedBs(players)}
          onGenerateTeam={handleGenerateTeam}
        />
        <PartyRow parties={partyArray} onPartyChange={handleChangeParty} />
        <MiscRow
          partyOrders={partyOrderArray}
          onOrderChange={handleOrderChange}
          shadParty={shadParty}
        />
        <CopyRow
          partyArray={partyArray}
          partyOrderArray={partyOrderArray}
          bonusArray={bonusArray}
        />
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
