import { Box, Stack } from '@mui/material';
import './index.css';
import PlayerForm from './components/PlayerForm';
import Roster from './components/Roster';

function App() {
  return (
    <Box
      my={7}
      display="flex"
      alignItems="center"
      justifyContent="center"
      // bgcolor="green"
    >
      <Stack spacing={4}>
        <PlayerForm />
        <Roster />
      </Stack>
    </Box>
  );
}

export default App;
