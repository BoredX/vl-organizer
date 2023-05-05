import { Button, Stack, TextField } from '@mui/material';

const PlayerForm = () => (
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
    />
    <Button variant="contained" size="small">
      Add player
    </Button>
  </Stack>
);

export default PlayerForm;
