import { Box, Stack, Button } from '@mui/material';
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
        <Box
          display="flex"
          justifyContent="space-evenly"
          // bgcolor="blue"
        >
          <Box // bgcolor="red"
          >
            <PlayerForm />
          </Box>
          <Box>
            <Button variant="contained" color="error">
              Reset Run
            </Button>
          </Box>
        </Box>
        <Roster />
      </Stack>
    </Box>
  );
}

export default App;
