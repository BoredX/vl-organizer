import PropTypes from 'prop-types';
import { Box } from '@mui/material';
import { DragDropContext } from '@hello-pangea/dnd';
import { useEffect, useState } from 'react';
import Party from './Party';
import playerPropType from './playerPropType';
import { indexToPartyLetter } from '../utils/generator';

const partyNamesMap = {
  'party-A': 0,
  'party-B': 1,
  'party-C': 2,
  'party-D': 3,
  'party-E': 4,
};

const PartyRow = ({ parties, onPartyChange, onJobChange }) => {
  const [moveablePts, setMoveablePts] = useState(parties);

  useEffect(() => {
    setMoveablePts([...parties]);
  }, [parties]);

  const onDragEnd = (result) => {
    const { source, destination } = result;
    // Check if the drag was successful and the item was dropped in a valid destination
    if (destination) {
      // Copy the item from the source table
      const sourcePartyIndex = partyNamesMap[source.droppableId];
      const draggedItem = moveablePts[sourcePartyIndex][source.index];
      // Remove the item from the source table
      let updatedPlayers = moveablePts[sourcePartyIndex].filter(
        (_, index) => index !== source.index
      );
      updatedPlayers = updatedPlayers.map((p, i) => ({ ...p, partyIndex: i }));

      // Remove player and re-set the source party
      moveablePts[sourcePartyIndex] = updatedPlayers;

      // Insert the item into the destination table
      const destPartyIndex = partyNamesMap[destination.droppableId];
      moveablePts[destPartyIndex].splice(destination.index, 0, draggedItem);

      // Update the state with the new table data
      setMoveablePts(moveablePts);
      onPartyChange(draggedItem, moveablePts, sourcePartyIndex, destPartyIndex);
    }
  };

  return (
    <DragDropContext
      autoScrollerOptions={{ disabled: true }}
      onDragEnd={onDragEnd}
    >
      <Box display="flex" gap={4}>
        {moveablePts.map((party, i) => {
          if (party.length === 0) {
            return null;
          }
          return (
            <Party
              key={indexToPartyLetter(i)}
              party={party}
              name={indexToPartyLetter(i)}
              onJobChange={onJobChange}
            />
          );
        })}
      </Box>
    </DragDropContext>
  );
};

PartyRow.propTypes = {
  parties: PropTypes.arrayOf(
    PropTypes.arrayOf(PropTypes.shape(playerPropType))
  ),
  onPartyChange: PropTypes.func,
  onJobChange: PropTypes.func,
};

export default PartyRow;
