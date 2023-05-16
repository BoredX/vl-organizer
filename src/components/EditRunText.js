import PropTypes from 'prop-types';
import { Save } from '@mui/icons-material';
import {
  Box,
  IconButton,
  InputAdornment,
  InputLabel,
  Stack,
  TextField,
  Tooltip,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import runPropType from './runPropType';

const EditRunText = ({ run, onSaveRun }) => {
  const [input, setInput] = useState(run.name);
  const [error, setError] = useState(false);

  useEffect(() => {
    setInput(run.name);
  }, [run]);

  const handleInput = (event) => {
    setInput(event.target.value);
  };

  const handleClick = (id, name) => {
    const err = input === '';
    setError(err);
    if (!err) {
      onSaveRun(id, name);
    }
  };

  return (
    <Stack direction="row" display="flex" justifyContent="center">
      <Box>
        <InputLabel position="top">Run Name</InputLabel>
        <TextField
          id="run-name-field"
          placeholder={new Date().toISOString().split('T')[0]}
          value={input}
          style={{ width: '700px' }}
          onChange={handleInput}
          error={error}
          helperText="Run name cannot be empty"
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <Tooltip title="Save Run" placement="top">
                  <IconButton
                    edge="end"
                    color="primary"
                    onClick={() => handleClick(run.id, input)}
                  >
                    <Save fontSize="large" />
                  </IconButton>
                </Tooltip>
              </InputAdornment>
            ),
          }}
        />
      </Box>
    </Stack>
  );
};

EditRunText.propTypes = {
  run: PropTypes.shape(runPropType),
  onSaveRun: PropTypes.func,
};

export default EditRunText;
