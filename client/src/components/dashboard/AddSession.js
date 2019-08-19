import React from 'react';
import { connect } from 'react-redux';
import { addSession } from '../../actions/profile';
import PropTypes from 'prop-types';

// Material-UI
import Modal from '@material-ui/core/Modal';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
  paper: {
    position: 'absolute',
    bottom: '10%',
    width: '100%',
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  fab: {
    position: 'fixed',
    bottom: theme.spacing(2),
    right: theme.spacing(2)
  },
  button: {
    margin: theme.spacing(1)
  },
  input: {
    display: 'none'
  }
}));

const AddSession = ({ history, addSession }) => {
  const [open, setOpen] = React.useState(false);

  const classes = useStyles();

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  //   Form submition for adding a session
  const [formData, setFormData] = React.useState({
    workout: '',
    completed: false
  });

  const { workout } = formData;

  const onChange = e =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  return (
    <div>
      <Fab
        color='primary'
        aria-label='add'
        className={classes.fab}
        onClick={handleOpen}
      >
        <AddIcon />
      </Fab>

      <Modal
        aria-labelledby='simple-modal-title'
        aria-describedby='simple-modal-description'
        open={open}
        onClose={handleClose}
      >
        <form
          className={classes.paper}
          onSubmit={e => {
            e.preventDefault();
            addSession(formData, history);
          }}
        >
          <h1 id='simple-modal-title'>New Session</h1>
          <TextField
            id='outlined-full-width'
            label='Session'
            style={{ margin: 8 }}
            placeholder='Name'
            helperText='*ex. leg day v1, push day v3, etc'
            margin='normal'
            variant='outlined'
            name='workout'
            value={workout}
            onChange={e => onChange(e)}
            InputLabelProps={{
              shrink: true
            }}
            required
          />
          <Button
            variant='contained'
            color='primary'
            className={classes.button}
            type='submit'
          >
            Create
          </Button>
        </form>
      </Modal>
    </div>
  );
};

AddSession.propTypes = {
  addSession: PropTypes.func.isRequired
};

export default connect(
  null,
  { addSession }
)(AddSession);
