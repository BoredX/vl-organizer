import PropTypes from 'prop-types';
import { MenuItem, Stack, TextField } from '@mui/material';
import React, { useEffect, useState } from 'react';
import runPropType from './runPropType';

const RunSelect = ({ runs, currentRunId, onSelectRun }) => {
  const [selectedRunId, setSelectedRun] = useState(
    currentRunId === '' ? '' : currentRunId
  );

  useEffect(() => {
    setSelectedRun(currentRunId);
  }, [currentRunId]);

  const handleChange = (event) => {
    const selectedId = event.target.value;
    setSelectedRun(selectedId);
    onSelectRun(selectedId);
  };

  return (
    <Stack alignItems="center">
      <TextField
        select
        multiline
        label="Select Run"
        value={selectedRunId}
        fullWidth
        maxRows={5}
        style={{ width: '700px' }}
        onChange={handleChange}
        SelectProps={{
          MenuProps: {
            PaperProps: {
              style: {
                maxHeight: 200,
              },
            },
          },
        }}
      >
        {runs.map((r) => (
          <MenuItem key={r.id} value={r.id}>
            {r.name}
          </MenuItem>
        ))}
      </TextField>
    </Stack>
  );
};
RunSelect.propTypes = {
  runs: PropTypes.arrayOf(PropTypes.shape(runPropType)),
  currentRunId: PropTypes.string,
  onSelectRun: PropTypes.func,
};

export default RunSelect;
