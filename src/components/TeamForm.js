import PropTypes from 'prop-types';
import {
  Box,
  Button,
  FormControl,
  FormControlLabel,
  FormHelperText,
  FormLabel,
  InputLabel,
  MenuItem,
  Paper,
  Radio,
  RadioGroup,
  Select,
  Tooltip,
} from '@mui/material';
import { range } from 'lodash';
import { useState } from 'react';

const TeamForm = ({ numBsSuggest, onGenerateTeam }) => {
  const [sortOrder, setSortOrder] = useState('player');
  const [numBs, setNumBs] = useState('');
  const [numBucc, setNumBucc] = useState('');

  const handleSortChange = (event) => {
    setSortOrder(event.target.value);
  };

  const handleBsChange = (event) => {
    setNumBs(event.target.value);
  };

  const handleBuccChange = (event) => {
    setNumBucc(event.target.value);
  };

  return (
    <Box>
      <Paper elevation={10}>
        <form>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-evenly"
            marginBottom={4}
            py={1}
          >
            <FormControl>
              <InputLabel>BS</InputLabel>
              <Select
                value={numBs}
                defaultValue={numBsSuggest}
                onChange={handleBsChange}
                label="BS"
              >
                {range(1, 7).map((x) => (
                  <MenuItem key={x} value={x}>
                    {x}
                  </MenuItem>
                ))}
              </Select>
              <FormHelperText>Number of BS</FormHelperText>
            </FormControl>
            <FormControl>
              <InputLabel>Buccs</InputLabel>
              <Select label="Buccs" value={numBucc} onChange={handleBuccChange}>
                {range(1, 9).map((x) => (
                  <MenuItem key={x} value={x}>
                    {x}
                  </MenuItem>
                ))}
              </Select>
              <FormHelperText>Min number of Buccs</FormHelperText>
            </FormControl>
            <FormControl>
              <Tooltip
                title="Belt looters choose which char to bring (first ign), or go with best job"
                placement="top"
              >
                <FormLabel>Preference</FormLabel>
              </Tooltip>
              <RadioGroup row value={sortOrder} onChange={handleSortChange}>
                <FormControlLabel
                  value="player"
                  control={<Radio />}
                  label="Player"
                />
                <FormControlLabel
                  value="damage"
                  control={<Radio />}
                  label="Damage"
                />
              </RadioGroup>
            </FormControl>
          </Box>
        </form>
      </Paper>
      <Button
        fullWidth
        variant="contained"
        sx={{ color: 'primary' }}
        onClick={() => onGenerateTeam(numBs, numBucc, sortOrder)}
      >
        Generate Team
      </Button>
    </Box>
  );
};

TeamForm.propTypes = {
  numBsSuggest: PropTypes.number,
  onGenerateTeam: PropTypes.func,
};

export default TeamForm;
