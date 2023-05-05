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

const MiscTable = ({ name, values }) => (
  <TableContainer component={Paper} elevation={10}>
    <Table>
      <TableHead>
        <TableRow>
          <TableCell colSpan={2} align="center">
            {name}
          </TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {values.map((value) => (
          <TableRow
            key={value.id}
            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
          >
            <TableCell>{value.name}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </TableContainer>
);

MiscTable.propTypes = {
  name: PropTypes.string,
  values: PropTypes.arrayOf(
    PropTypes.shape({ id: PropTypes.string, name: PropTypes.string })
  ),
};

export default MiscTable;
