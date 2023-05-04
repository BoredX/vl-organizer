import AddPlayerButton from './AddPlayerButton';
import PlayerForm from './PlayerForm';
import Players from './Players';

function PlayerArea() {
  return (
    <div>
      <PlayerForm />
      <br />
      <AddPlayerButton />
      <Players />
    </div>
  );
}

export default PlayerArea;
