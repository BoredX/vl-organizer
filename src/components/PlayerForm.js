import { Box, Button, Stack, TextField } from '@mui/material';
import { useState } from 'react';
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
  Bucc: ['bucc', 'buc'],
  Sair: ['sair'],
  SE: ['mm', 'bm', 'se'],
  BS: ['bs', 'bishop', 'bish', 'bis'],
};

const reverseJobMap = reverseMap(jobMapping);

const parseJobs = (jobs) => jobs.map((job) => reverseJobMap[job.toLowerCase()]);

const parseSplits = (splits, chars) => {
  const normalizedSplits =
    splits.length === 1 ? new Array(chars).fill(splits[0]) : splits;
  return normalizedSplits.map((split) => (split === 'belt' ? 'belt' : 'bonus'));
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

const PlayerForm = ({ players, onAddPlayer }) => {
  const [input, setInput] = useState('');
  const [error, setError] = useState(false);
  const [isVerticalInput, setIsVerticalInput] = useState(true);

  const handleInput = (event) => {
    setInput(event.target.value);
  };

  const handleSwitchVertical = () => {
    setIsVerticalInput(!isVerticalInput);
  };

  const handleAddClick = () => {
    const player = isVerticalInput
      ? createPlayerFromVerticalInput(input)
      : createPlayerFromHorizontalInput(input);
    const isInvalidInput =
      player.jobs === undefined || player.jobs.length !== player.names.length;
    setError(isInvalidInput);
    if (!isInvalidInput) {
      onAddPlayer([...players, player]);
      setInput('');
    }
  };

  return (
    <Stack spacing={3} alignItems="center">
      <TextField
        multiline
        minRows={4}
        style={{ width: 500 }}
        label="Add player"
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
        <Button variant="contained" size="small" onClick={handleAddClick}>
          Add player
        </Button>
        <Button
          color="info"
          variant="contained"
          size="small"
          onClick={handleSwitchVertical}
        >
          Switch Input Direction
        </Button>
      </Box>
    </Stack>
  );
};

PlayerForm.propTypes = playerPropType;

export default PlayerForm;
