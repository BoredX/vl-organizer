import { Box, Button, Stack, TextField } from '@mui/material';
import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import playerPropType from './playerPropType';
import { reverseJobNamesMap } from '../utils/jobs';

// split on comma, pipe, slash, space
const parseDelimiters = (input) => input.split(/,|\||\/|\s+/);

const parseJobs = (jobs) =>
  jobs.map((job) => reverseJobNamesMap[job.toLowerCase()]);

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
    const str = rows[i].replace('belt set', 'belt');
    const sanitized = filterArray(parseDelimiters(str));
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

const PlayerForm = ({ onAddPlayer, editingPlayer, onSubmitEdit, inputRef }) => {
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
    inputRef.current.focus();
    const valueLength = inputRef.current.value.length;
    inputRef.current.setSelectionRange(valueLength, valueLength);
  };

  const handleAddClick = () => {
    if (editingPlayer !== null) {
      setIsVerticalInput(true);
    }
    let inputPlayer = isVerticalInput
      ? createPlayerFromVerticalInput(input)
      : createPlayerFromHorizontalInput(input);
    const isInvalidInput =
      inputPlayer.jobs === undefined ||
      inputPlayer.jobs.length !== inputPlayer.names.length ||
      inputPlayer.loots.length !== inputPlayer.names.length;
    setError(isInvalidInput);
    if (isInvalidInput) {
      console.log('igns', inputPlayer.names);
      console.log('jobs', inputPlayer.jobs);
      console.log('splits', inputPlayer.loots);
    }
    if (!isInvalidInput) {
      inputPlayer = {
        ...inputPlayer,
        sortedJobs: [],
        sortedLoots: [],
        chosenIndex: 0,
        partyIndex: -1,
        isShad: false,
        isBs: false,
        isBucc: false,
        isSe: false,
        isWar: false,
        isNl: false,
        isSair: false,
        isBonus: true,
        isBelt: false,
        isNx: false,
        boxes: [],
      };
      if (editingPlayer === null) {
        onAddPlayer(inputPlayer);
      } else {
        onSubmitEdit({
          ...editingPlayer,
          names: inputPlayer.names,
          jobs: inputPlayer.jobs,
          loots: inputPlayer.loots,
          chosenIndex: 0,
        });
      }
      setInput('');
    }
  };

  return (
    <Stack spacing={3} alignItems="center">
      <TextField
        id="playerInput"
        inputRef={inputRef}
        multiline
        minRows={4}
        style={{ width: 500 }}
        // InputLabelProps={{
        //   shrink: input !== '',
        // }}
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
          onClick={handleAddClick}
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

PlayerForm.propTypes = {
  // players: PropTypes.arrayOf(PropTypes.shape(playerPropType)),
  onAddPlayer: PropTypes.func,
  editingPlayer: PropTypes.shape(playerPropType),
  onSubmitEdit: PropTypes.func,
  inputRef: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.shape({ current: PropTypes.any }),
  ]),
};

export default PlayerForm;
