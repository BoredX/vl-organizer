import { Button, Stack, TextField } from '@mui/material';
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

const createPlayerFromInput = (input) => {
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

const PlayerForm = ({ players, handleNewPlayer }) => {
  const [input, setInput] = useState('');
  const [error, setError] = useState(false);

  const handleInput = (event) => {
    setInput(event.target.value);
  };

  const handleClick = () => {
    const player = createPlayerFromInput(input);
    const isInvalidInput =
      player.jobs === undefined || player.jobs.length !== player.names.length;
    setError(isInvalidInput);
    console.log(player);
    console.log(players);
    if (!isInvalidInput) {
      console.log(typeof handleNewPlayer);
      handleNewPlayer([...players, player]);
      setInput('');
    }
  };

  return (
    <Stack spacing={3} alignItems="center">
      <TextField
        multiline
        minRows={3}
        style={{ width: 500 }}
        label="Add player"
        placeholder="ign1 / ign2 ign3
job1, job2 | job 3
bonus | belt
"
        value={input}
        error={error}
        helperText={error ? 'Invalid input. Check Jobs and Splits' : ''}
        onChange={handleInput}
      />
      <Button variant="contained" size="small" onClick={handleClick}>
        Add player
      </Button>
    </Stack>
  );
};

PlayerForm.propTypes = playerPropType;

export default PlayerForm;
