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
import { Draggable, Droppable } from '@hello-pangea/dnd';
import playerPropType from './playerPropType';

const Party = ({ party, name }) => (
  <TableContainer component={Paper} elevation={10}>
    <Table>
      <TableHead>
        <TableRow>
          <TableCell colSpan={2} align="center">
            Party {name}
          </TableCell>
        </TableRow>
      </TableHead>
      <Droppable droppableId={`party-${name}`}>
        {(providedDroppable) => (
          <TableBody
            key={`party-${name}`}
            ref={providedDroppable.innerRef}
            {...providedDroppable.droppableProps}
            align="center"
          >
            {party.map((p, i) => (
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
                    <TableCell width="30%">{p.jobs[p.chosenIndex]}</TableCell>
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
);

Party.propTypes = {
  name: PropTypes.string,
  party: PropTypes.arrayOf(PropTypes.shape(playerPropType)),
};

export default Party;
