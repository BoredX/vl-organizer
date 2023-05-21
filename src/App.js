import {
  Box,
  Stack,
  Button,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import './index.css';
import { useEffect, useRef, useState } from 'react';
import { v4 as uuid } from 'uuid';
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
  rollMoreBelt,
} from './utils/generator';
import { jobFlags } from './utils/jobs';
import CopyRow from './components/CopyRow';
import RunSelect from './components/RunSelect';
import EditRunText from './components/EditRunText';
import NavBar from './components/NavBar';

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
    return savedParty !== null ? JSON.parse(savedParty) : [[], [], [], [], []];
  });
  const [partyOrderArray, setPartyOrderArray] = useState(() => {
    const savedPartyOrder = localStorage.getItem('partyOrder');
    return savedPartyOrder !== null
      ? JSON.parse(savedPartyOrder)
      : [[], [], [], []]; // bs, tl, smoke(always empty now), belt
  });
  const [runs, setRuns] = useState(() => {
    const savedRuns = localStorage.getItem('runs');
    return savedRuns !== null ? JSON.parse(savedRuns) : [];
  });
  const [currentRun, setCurrentRun] = useState(() => {
    const savedCurrentRun = localStorage.getItem('currentRun');
    return savedCurrentRun !== null
      ? JSON.parse(savedCurrentRun)
      : { id: '', name: '', players, partyArray, partyOrderArray, bonusArray };
  });

  useEffect(() => {
    localStorage.setItem('players', JSON.stringify(players));
    localStorage.setItem('bonus', JSON.stringify(bonusArray));
    localStorage.setItem('parties', JSON.stringify(partyArray));
    localStorage.setItem('partyOrder', JSON.stringify(partyOrderArray));
    localStorage.setItem('runs', JSON.stringify(runs));
    localStorage.setItem('currentRun', JSON.stringify(currentRun));
  }, [players, bonusArray, partyArray, partyOrderArray, runs, currentRun]);

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('xl'));

  const handleSaveRun = (id, name) => {
    if (name === '') {
      return;
    }
    let run = {
      id,
      name,
      players,
      partyArray,
      partyOrderArray,
      bonusArray,
    };
    const savedRunIndex = runs.findIndex((r) => r.id === id);
    if (savedRunIndex !== -1) {
      const newRuns = [
        ...runs.slice(0, savedRunIndex),
        run,
        ...runs.slice(savedRunIndex + 1),
      ];
      setRuns(newRuns);
    } else {
      run = { ...run, id: uuid() };
      setRuns([run, ...runs]);
    }
    setCurrentRun(run);
  };

  const handleSelectRun = (runId) => {
    // save current run
    const currRun = runs.find((r) => r.id === currentRun.id);
    if (currRun) {
      currRun.players = players;
      currRun.partyArray = partyArray;
      currRun.partyOrderArray = partyOrderArray;
      currRun.bonusArray = bonusArray;
    }

    // load selected run
    const run = runs.find((r) => r.id === runId);
    setCurrentRun(run);
    setPlayers(run.players);
    setPartyArray(run.partyArray);
    setPartyOrderArray(run.partyOrderArray);
    setBonusArray(run.bonusArray);
  };

  const resetData = (id, name) => {
    setCurrentRun({
      id,
      name,
      players,
      partyArray,
      partyOrderArray,
      bonusArray,
    });
    setPlayers([]);
    setPartyArray([[], [], [], [], []]);
    setPartyOrderArray([[], [], [], []]);
    setBonusArray([]);
  };

  const handleNewRun = () => {
    handleSaveRun(currentRun.id, currentRun.name);
    resetData('', '');
  };

  const handleResetRun = () => {
    resetData(currentRun.id, currentRun.name);
  };

  const handleDeleteRun = () => {
    const currRunId = currentRun.id;
    resetData('', '');
    setRuns(runs.filter((r) => r.id !== currRunId));
  };

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

  const handleNewPlayer = (plyr) => {
    if (players.length <= 30) {
      const id = uuid();

      const newPartyArr = [...partyArray];
      const counts = newPartyArr.map((p) => p.length);
      const firstAvail = counts.findIndex((c) => c < 6);

      const ptIndex = newPartyArr[firstAvail].length;
      const job = plyr.jobs[0];
      const jFlags = jobFlags(job);
      const newPlayer = { ...plyr, id, partyIndex: ptIndex, ...jFlags };
      setPartyArray(
        newPartyArr.map((p, i) => (i === firstAvail ? [...p, newPlayer] : p))
      );
      setPartyOrderArray((prevPartyOrder) =>
        prevPartyOrder.map((pt, i) => {
          if (i === 0 && newPlayer.isBs) {
            return [...pt, newPlayer];
          }
          if (i === 1 && newPlayer.isBucc) {
            return [...pt, newPlayer];
          }
          return pt;
        })
      );
      setPlayers([...players, newPlayer]);
    }
  };

  const handleUpdatePlayer = (updatedPlayer) => {
    setPlayers((prevPlayers) =>
      prevPlayers.map((p) => (p.id === updatedPlayer.id ? updatedPlayer : p))
    );
    setPartyArray((prevPartyArray) =>
      prevPartyArray.map((pt) =>
        pt.map((p) => (p.id === updatedPlayer.id ? updatedPlayer : p))
      )
    );
    setPartyOrderArray((prevOrderPartyArray) =>
      prevOrderPartyArray.map((pt, i) => {
        const filteredPts = pt.filter((p) => p.id !== updatedPlayer.id);
        if (i === 0 && updatedPlayer.isBs) {
          return [...filteredPts, updatedPlayer];
        }
        if (i === 1 && updatedPlayer.isBucc) {
          return [...filteredPts, updatedPlayer];
        }
        return filteredPts;
      })
    );
    setEditingPlayer(null);
  };

  const handleJobChange = (id, chosenIndex) => {
    const player = players.find((p) => p.id === id);
    const newJob = player.jobs[chosenIndex];
    const changedPlayer = {
      ...player,
      chosenIndex,
      ...jobFlags(newJob),
    };

    setPartyOrderArray((prevPartyOrder) => {
      const newPartyOrder = [...prevPartyOrder];
      let oldIndexWithinTable = -1;
      let oldPartyTablesIndex = -1;

      for (
        let j = 0;
        j < newPartyOrder.length - 1 && oldIndexWithinTable < 0; // -1 because last party order is belt
        j += 1
      ) {
        oldIndexWithinTable = newPartyOrder[j].findIndex((p) => p.id === id);
        if (oldIndexWithinTable >= 0) {
          oldPartyTablesIndex = j;
        }
      }

      // Remove from old party Order if they were in special party
      if (oldPartyTablesIndex >= 0 && (player.isBs || player.isBucc)) {
        newPartyOrder[oldPartyTablesIndex] = newPartyOrder[
          oldPartyTablesIndex
        ].filter((p) => p.id !== id);
      }

      // do new player stuff

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
      prevParties.map((pt) => {
        const plyrIndex = pt.findIndex((p) => p.id === id);
        if (plyrIndex >= 0) {
          return pt.map((p, i) => (i === plyrIndex ? changedPlayer : p));
        }
        return pt;
      })
    );

    setPlayers((prevPlayers) =>
      prevPlayers.map((p) => (p.id === id ? changedPlayer : p))
    );
  };

  const handleRemove = (id) => {
    setPlayers((prevPlayers) => prevPlayers.filter((p) => p.id !== id));
    setPartyArray((prevParties) =>
      prevParties.map((pt) => pt.filter((p) => p.id !== id))
    );
    setPartyOrderArray((prevPartyOrder) =>
      prevPartyOrder.map((pt) => pt.filter((p) => p.id !== id))
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
      // remove belt from belt list
      setPartyOrderArray((prevParties) =>
        prevParties.map((pt, i) => {
          if (i === 3) {
            return pt.filter((p) => p.id !== id);
          }
          return pt;
        })
      );
    } else {
      const numBelts = players.filter((p) => p.isBelt).length;
      if (numBelts < 6) {
        const player = players.find((p) => p.id === id);
        if (player.loots.findIndex((loot) => loot === 'belt') === -1) {
          const chosenIdx = player.chosenIndex === -1 ? 0 : player.chosenIndex;
          player.loots[chosenIdx] = 'belt';
        }
        setPlayers((prevPlayers) =>
          prevPlayers.map((p) => (p.id === id ? { ...player, ...newFlags } : p))
        );

        setPartyArray((prevParties) =>
          prevParties.map((pt) => {
            const plyrIndex = pt.findIndex((p) => p.id === id);
            if (plyrIndex === -1) {
              return pt;
            }
            return pt.map((p, i) =>
              i === plyrIndex ? { ...player, ...newFlags } : p
            );
          })
        );

        setPartyOrderArray((prevParties) =>
          prevParties.map((pt, i) => {
            if (i === 3) {
              const plyr = pt.find((p) => p.id === id);
              if (!plyr) {
                return [...pt, { ...player, ...newFlags }];
              }
              return pt;
            }
            return pt;
          })
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

      setPartyOrderArray((prevPartyOrder) =>
        prevPartyOrder.map((pt, i) => {
          if (i === 3) {
            return pt.filter((p) => p.id !== id);
          }
          return pt;
        })
      );
    }
  };

  const handleToggleNx = (id, isBelt, isNx) => {
    if (!isBelt) {
      setPlayers(players.map((p) => (p.id === id ? { ...p, isNx: !isNx } : p)));
    }
  };

  const handleRollLoot = () => {
    const newPlayers = rollLoot(players);
    setPlayers(newPlayers);

    setPartyOrderArray((prevPartyOrder) =>
      prevPartyOrder.map((pt, i) => {
        if (i === 3) {
          return newPlayers.filter((p) => p.isBelt);
        }
        return pt;
      })
    );
  };

  const handleRollMoreBelt = () => {
    const newPlayers = rollMoreBelt(players);
    setPlayers(newPlayers);

    setPartyOrderArray((prevPartyOrder) =>
      prevPartyOrder.map((pt, i) => {
        if (i === 3) {
          return newPlayers.filter((p) => p.isBelt);
        }
        return pt;
      })
    );
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
    newParty[sourcePtIndex] = newParty[sourcePtIndex].map((p, i) => ({
      ...p,
      partyIndex: i,
    }));
    newParty[destPtIndex] = newParty[destPtIndex].map((p, i) => ({
      ...p,
      partyIndex: i,
    }));
    setPartyArray(newParty);

    setPlayers((oldPlayers) =>
      oldPlayers.map((p) => {
        let player = newParty[sourcePtIndex].find(
          (pPlayers) => pPlayers.id === p.id
        );

        if (!player) {
          player = newParty[destPtIndex].find(
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

  const handleBsLeaderChange = (id) => {
    setPartyOrderArray((prevPartyOrder) =>
      prevPartyOrder.map((pt, i) =>
        i === 0
          ? pt.map((p) =>
              p.id === id
                ? { ...p, isBsLeader: true }
                : { ...p, isBsLeader: false }
            )
          : pt
      )
    );
  };

  const shadParty = () => {
    const index = findShadPartyIndex(partyArray);
    return index >= 0 ? partyArray[index].filter((p) => p.isShad) : [];
  };

  const nxList = () => players.filter((p) => p.isNx);

  return (
    <Box>
      <NavBar
        currentRun={currentRun}
        onNewRun={handleNewRun}
        onReset={handleResetRun}
        onDelete={handleDeleteRun}
      />
      <Box my={7} display="flex" alignItems="center" justifyContent="center">
        <Stack spacing={6} sx={{ width: isSmallScreen ? '98%' : 'auto' }}>
          <RunSelect
            runs={runs}
            currentRunId={currentRun.id}
            onSelectRun={handleSelectRun}
          />
          <EditRunText run={currentRun} onSaveRun={handleSaveRun} />
          <Box display="flex" justifyContent="center" columnGap={5}>
            <Box>
              <PlayerForm
                onAddPlayer={handleNewPlayer}
                editingPlayer={editingPlayer}
                inputRef={inputRef}
                onSubmitEdit={handleUpdatePlayer}
              />
            </Box>
            <Stack spacing={2}>
              <Tooltip
                placement="top"
                title={
                  <Typography fontSize={14}>
                    Randomly roll 6 people to loot belt, everyone else get bonus
                  </Typography>
                }
              >
                <Button
                  variant="contained"
                  color="success"
                  onClick={handleRollLoot}
                >
                  Roll loot
                </Button>
              </Tooltip>
              <Tooltip
                placement="top"
                title={
                  <Typography fontSize={14}>
                    When Belt looter DC, remove them from Belt and roll a new
                    random belt looter
                  </Typography>
                }
              >
                <Button
                  variant="contained"
                  color="success"
                  onClick={handleRollMoreBelt}
                >
                  Roll more belt
                </Button>
              </Tooltip>
              <Tooltip
                placement="top"
                title={
                  <Typography fontSize={14}>
                    Randomly roll 6 bonus looter to get NX
                  </Typography>
                }
              >
                <Button
                  variant="contained"
                  color="success"
                  onClick={handleRollNx}
                >
                  Roll NX
                </Button>
              </Tooltip>
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
            players={players}
            numBsSuggest={numSuggestedBs(players)}
            onGenerateTeam={handleGenerateTeam}
          />
          <PartyRow
            parties={partyArray}
            onPartyChange={handleChangeParty}
            onJobChange={handleJobChange}
          />
          <MiscRow
            partyOrders={partyOrderArray}
            onOrderChange={handleOrderChange}
            shadParty={shadParty}
            onBsLeaderChange={handleBsLeaderChange}
          />
          <CopyRow
            partyArray={partyArray}
            partyOrderArray={partyOrderArray}
            bonusArray={bonusArray}
            getShadParty={shadParty}
            getNxList={nxList}
          />
          <Tooltip
            placement="top"
            title={
              <Typography fontSize={14}>
                Randomly rolls boxes for bonus looters. NX looters will receive
                less boxes. If someone DCs, turn off their bonus so they will
                not get any boxes button
              </Typography>
            }
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
          <img src="/vl_bonus_11.png" alt="Bonus map for few looters" />
        </Stack>
      </Box>
    </Box>
  );
}

export default App;
