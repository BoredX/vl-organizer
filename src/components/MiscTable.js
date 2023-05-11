import PropTypes from 'prop-types';

import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import { DragDropContext, Draggable, Droppable } from '@hello-pangea/dnd';
import { useEffect, useState } from 'react';

const MiscTable = ({ name, ptIndex, players, onOrderChange }) => {
  const [partyOrder, setPartyOrder] = useState(players);

  useEffect(() => {
    setPartyOrder([...players]);
  }, [players]);

  const handleDragEnd = (result) => {
    if (result.destination !== null) {
      const partyMembers = [...partyOrder];
      const [movedItem] = partyMembers.splice(result.source.index, 1);
      partyMembers.splice(result.destination.index, 0, movedItem);
      setPartyOrder(partyMembers);
      onOrderChange(ptIndex, partyMembers);
    }
  };

  return (
    <DragDropContext
      autoScrollerOptions={{ disabled: true }}
      onDragEnd={handleDragEnd}
    >
      <TableContainer component={Paper} elevation={10}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell align="center">{name}</TableCell>
            </TableRow>
          </TableHead>
          <Droppable droppableId={`order-table-${name}`}>
            {(providedDroppable) => (
              <TableBody
                key={`order-table-${name}`}
                ref={providedDroppable.innerRef}
                {...providedDroppable.droppableProps}
                align="center"
              >
                {partyOrder.map((p, i) => (
                  <Draggable key={p.id} draggableId={String(p.id)} index={i}>
                    {(providedDraggable) => (
                      <TableRow
                        key={p.id}
                        ref={providedDraggable.innerRef}
                        {...providedDraggable.draggableProps}
                        {...providedDraggable.dragHandleProps}
                        sx={{
                          cursor: 'grab',
                        }}
                      >
                        <TableCell align="center">
                          {p.names[p.chosenIndex]}
                        </TableCell>
                      </TableRow>
                    )}
                  </Draggable>
                ))}
                {providedDroppable.placeholder}
              </TableBody>
            )}
          </Droppable>
        </Table>
      </TableContainer>
    </DragDropContext>
  );
};

MiscTable.propTypes = {
  name: PropTypes.string,
  ptIndex: PropTypes.number,
  players: PropTypes.arrayOf(PropTypes.object),
  onOrderChange: PropTypes.func,
};

export default MiscTable;
