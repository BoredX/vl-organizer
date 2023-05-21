import PropTypes from 'prop-types';
import {
  AppBar,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Toolbar,
  Typography,
} from '@mui/material';
import { useState } from 'react';

const NavBar = ({ onNewRun, onReset, onDelete }) => {
  const [open, setOpen] = useState(false);
  const [isDelete, setIsDelete] = useState(false);

  const handleOpen = (del) => {
    setIsDelete(del);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleConfirm = () => {
    const fn = isDelete ? onDelete : onReset;
    fn();
    setOpen(false);
  };

  return (
    <AppBar position="static">
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <Typography variant="h6" flexGrow={1}>
          Von Leon Organizer
        </Typography>

        <Box display="flex" alignItems="center">
          <Button
            component="a"
            href="https://youtu.be/w6VtxQqzFtg"
            target="_blank"
            color="inherit"
            rel="noopener noreferrer"
            style={{ marginRight: 15 }}
          >
            <Typography variant="button" fontWeight="bold">
              Demo Video
            </Typography>
          </Button>
          <Button
            color="inherit"
            style={{ marginRight: 15 }}
            onClick={onNewRun}
          >
            <Typography variant="button" fontWeight="bold">
              New Run
            </Typography>
          </Button>
          <Button
            color="inherit"
            style={{ marginRight: 15 }}
            onClick={() => handleOpen(false)}
          >
            <Typography
              variant="button"
              fontWeight="bold"
              onClick={() => handleOpen(true)}
            >
              Reset Run
            </Typography>
          </Button>
          <Button color="inherit" onClick={() => handleOpen(true)}>
            <Typography variant="button" fontWeight="bold">
              Delete Run
            </Typography>
          </Button>
          <Dialog open={open} onClose={handleClose}>
            <DialogTitle>Are you sure?</DialogTitle>
            <DialogContent>
              Do you want to {isDelete ? 'delete' : 'reset'} the run?
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose}>Cancel</Button>
              <Button variant="contained" onClick={handleConfirm}>
                Confirm
              </Button>
            </DialogActions>
          </Dialog>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

NavBar.propTypes = {
  onNewRun: PropTypes.func,
  onReset: PropTypes.func,
  onDelete: PropTypes.func,
};

export default NavBar;
