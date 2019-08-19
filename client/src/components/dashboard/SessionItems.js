import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getCurrentProfile, deleteSession } from '../../actions/profile';
import Moment from 'react-moment';
import { Link } from 'react-router-dom';
import Exercises from './Exercises';

//Material-UI
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Button from '@material-ui/core/Button';

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
    backgroundColor: theme.palette.background.paper,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  extendedIcon: {
    marginRight: theme.spacing(1)
  },
  container: {
    display: 'flex',
    flexWrap: 'wrap'
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1)
  },
  dense: {
    marginTop: theme.spacing(2)
  },
  menu: {
    width: '100%'
  },
  branch: {
    padding: '64px 0'
  },
  button: {
    margin: theme.spacing(1)
  },
  input: {
    display: 'none'
  }
}));

const SessionItems = ({
  getCurrentProfile,
  profile: { profile },
  deleteSession
}) => {
  const classes = useStyles();

  useEffect(() => {
    getCurrentProfile();
  }, [getCurrentProfile]);

  return (
    <div className={classes.branch}>
      {profile.session.map(session => (
        <div key={session._id}>
          <List component='nav' aria-label='main mailbox folders'>
            <ListItem button className={classes.root}>
              {/* LINK TO INDIVIDUAL SESSION */}
              <Link to={`/${session._id}`} component={Exercises}>
                <ListItemText
                  primary={session.workout}
                  secondary={
                    <Moment format='YYYY/MM/DD'>{session.date}</Moment>
                  }
                />
              </Link>
              {/* TODO!  COMPLETED SESSIONS IMMUTABLE NO MORE EDITING THEM ONLY COPY*/}
              {/* {session.completed.toString()} */}
              <div>
                <Button color='primary' className={classes.button}>
                  Edit
                </Button>
                <Button
                  color='secondary'
                  className={classes.button}
                  onClick={() => deleteSession(session._id)}
                >
                  Remove
                </Button>
              </div>
            </ListItem>
          </List>
        </div>
      ))}
    </div>
  );
};

SessionItems.propTypes = {
  getCurrentProfile: PropTypes.func.isRequired,
  profile: PropTypes.object.isRequired,
  deleteSession: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  profile: state.profile
});

export default connect(
  mapStateToProps,
  { getCurrentProfile, deleteSession }
)(SessionItems);
