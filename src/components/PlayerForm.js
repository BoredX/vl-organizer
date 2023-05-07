import { Box, Button, Stack, TextField } from '@mui/material';
import { useEffect, useState } from 'react';
import playerPropType from './playerPropType';

// split on comma, pipe, slash, space
const parseDelimiters = (input) => input.split(/,|\||\/|\s+/);

function reverseMap(map) {
  return Object.entries(map).reduce((acc, [key, values]) => {
    values.forEach((value) => {
      acc[value] = key;
    });
    return acc;
  }, {});
}

const jobMapping = {
  NL: ['nl'],
  Shad: ['shadower', 'shad'],
  DK: ['dk', 'drk', 'dark'],
  Pally: ['pally', 'paly'],
  Hero: ['hero'],
  Bucc: ['bucc', 'buc', 'buccaneer'],
  Sair: ['sair'],
  SE: ['mm', 'bm', 'se'],
  BS: ['bs', 'bishop', 'bish', 'bis'],
};

const reverseJobMap = reverseMap(jobMapping);

const parseJobs = (jobs) => jobs.map((job) => reverseJobMap[job.toLowerCase()]);

const parseSplits = (splits, numChars) => {
  const normalizedSplits =
    splits.length === 1 ? new Array(numChars).fill(splits[0]) : splits;
  const splitsMapped = normalizedSplits.map((split) =>
    split.toLowerCase() === 'belt' ? 'belt' : 'bonus'
  );
  // if split is input with spaces etc
  return splitsMapped.length > numChars
    ? splitsMapped.slice(0, numChars)
    : splitsMapped;
};

function filterArray(array) {
  if (!array) return [];
  return array.filter((item) => item && item.trim().length > 0);
}

const createPlayerFromVerticalInput = (input) => {
  const rows = input.split('\n');
  const player = {};
  for (let i = 0; i < rows.length; i += 1) {
    const removedBeforeColon = rows[i].substring(rows[i].indexOf(':') + 1);
    const sanitized = filterArray(parseDelimiters(removedBeforeColon.trim()));
    if (i === 0) {
      player.names = sanitized;
    } else if (i === 1) {
      const sanitizedJobs = filterArray(parseJobs(sanitized));
      player.jobs =
        sanitizedJobs.length === sanitized.length ? sanitizedJobs : [];
    } else if (i === 2) {
      player.loots = parseSplits(sanitized, player.names.length);
    }
  }
  return player;
};

const createPlayerFromHorizontalInput = (input) => {
  const rows = input.split('\n');
  const player = {};
  const names = [];
  const jobs = [];
  const loots = [];
  for (let i = 0; i < rows.length; i += 1) {
    const sanitized = filterArray(parseDelimiters(rows[i]));
    if (sanitized.length !== 3) {
      player.jobs = undefined;
      return player;
    }
    names.push(sanitized[0]);
    const job = filterArray(parseJobs([sanitized[1]]));
    if (job.length !== 1) {
      player.jobs = undefined;
      return player;
    }
    jobs.push(job[0]);
    loots.push(parseSplits([sanitized[2]])[0]);
  }
  player.names = names;
  player.jobs = jobs;
  player.loots = loots;
  return player;
};

const formatPlayer = (p) => {
  if (p === null) {
    return '';
  }
  const names = p.names.join(', ');
  const jobs = p.jobs.join(', ');
  const loots = p.loots.join(', ');
  return `${names}\n${jobs}\n${loots}`;
};

const PlayerForm = ({ players, onAddPlayer, editingPlayer, onSubmitEdit }) => {
  const [input, setInput] = useState();
  const [error, setError] = useState(false);
  const [isVerticalInput, setIsVerticalInput] = useState(true);

  useEffect(() => {
    setInput(formatPlayer(editingPlayer));
    if (editingPlayer !== null) {
      setIsVerticalInput(true);
    }
  }, [editingPlayer]);

  const handleInput = (event) => {
    setInput(event.target.value);
  };

  const handleSwitchVertical = () => {
    setIsVerticalInput(!isVerticalInput);
  };

  const handleClick = () => {
    if (editingPlayer !== null) {
      setIsVerticalInput(true);
    }
    let player = isVerticalInput
      ? createPlayerFromVerticalInput(input)
      : createPlayerFromHorizontalInput(input);
    const isInvalidInput =
      player.jobs === undefined ||
      player.jobs.length !== player.names.length ||
      player.loots.length !== player.names.length;
    setError(isInvalidInput);
    if (isInvalidInput) {
      console.log('igns', player.names);
      console.log('jobs', player.jobs);
      console.log('splits', player.loots);
    }
    if (!isInvalidInput) {
      player = {
        ...player,
        chosenIndex: -1,
        team: '',
        isShad: false,
        isBs: false,
        isBucc: false,
        isBonus: false,
        isBelt: false,
        ixNx: false,
        boxes: [],
      };
      if (editingPlayer === null) {
        onAddPlayer([...players, player]);
      } else {
        onSubmitEdit({
          ...editingPlayer,
          names: player.names,
          jobs: player.jobs,
          loots: player.loots,
        });
      }
      setInput('');
    }
  };

  return (
    <Stack spacing={3} alignItems="center">
      <TextField
        multiline
        minRows={4}
        style={{ width: 500 }}
        label={editingPlayer === null ? 'Add player' : 'Edit player'}
        placeholder={
          isVerticalInput
            ? '<vertical input>\nign1 / ign2 ign3 \njob1, job2 | job 3\nbonus | belt , bonus'
            : '<horizontal input>\nign1 / job1 belt \nign2, job2 | bonus\nign3 | job3 | belt'
        }
        value={input}
        error={error}
        helperText={error ? 'Invalid input. Check Jobs and Splits' : ''}
        onChange={handleInput}
      />
      <Box display="flex" width="70%" justifyContent="space-around">
        <Button
          style={{ width: 120 }}
          variant="contained"
          size="small"
          onClick={handleClick}
        >
          {editingPlayer === null ? 'Add player' : 'Save player'}
        </Button>
        <Button
          color="info"
          variant="contained"
          size="small"
          onClick={handleSwitchVertical}
          style={{ width: 150 }}
        >
          {isVerticalInput ? 'Horizontal Input' : 'Vertical Input'}
        </Button>
      </Box>
    </Stack>
  );
};

PlayerForm.propTypes = playerPropType;

export default PlayerForm;
