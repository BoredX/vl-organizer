import PropTypes from 'prop-types';
import {
  Box,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import { Draggable, Droppable } from '@hello-pangea/dnd';
import playerPropType from './playerPropType';

const Party = ({ party, name, onJobChange }) => {
  const handleJobChange = (id, event) => {
    const jobIndex = party
      .find((p) => p.id === id)
      .jobs.findIndex((job) => job === event.target.value);
    onJobChange(id, jobIndex);
  };

  return (
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
                <Draggable
                  key={`draggable-${String(p.id)}`}
                  draggableId={`draggable-${String(p.id)}`}
                  index={i}
                >
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
                      <TableCell align="center" width="40%">
                        {p.names[p.chosenIndex]}
                      </TableCell>
                      <TableCell width="20%">
                        <Box marginRight="10%">
                          <Select
                            size="small"
                            fullWidth
                            value={p.jobs[p.chosenIndex]}
                            onChange={(e) => handleJobChange(p.id, e)}
                          >
                            {p.jobs.map((job, idx) => (
                              <MenuItem
                                key={`player-${p.id}-job-${idx}`}
                                value={job}
                              >
                                {job}
                              </MenuItem>
                            ))}
                          </Select>
                        </Box>
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
  );
};

Party.propTypes = {
  name: PropTypes.string,
  party: PropTypes.arrayOf(PropTypes.shape(playerPropType)),
  onJobChange: PropTypes.func,
};

export default Party;
