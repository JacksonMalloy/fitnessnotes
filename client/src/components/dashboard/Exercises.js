import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Spinner from '../layout/Spinner';
import { getCurrentProfile } from '../../actions/profile';

//Material-UI
import { makeStyles } from '@material-ui/core/styles';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%'
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    flexBasis: '33.33%',
    flexShrink: 0
  },
  secondaryHeading: {
    fontSize: theme.typography.pxToRem(15),
    color: theme.palette.text.secondary
  },
  branch: {
    padding: '64px 0'
  }
}));

const Exercises = ({
  getCurrentProfile,
  profile: { profile, loading },
  history
}) => {
  useEffect(() => {
    getCurrentProfile();
  }, [getCurrentProfile]);

  const classes = useStyles();
  const [expanded, setExpanded] = React.useState(false);

  const handleChange = panel => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  return loading && profile === null ? (
    <Spinner />
  ) : (
    <>
      {profile !== null ? (
        <>
          <div className={classes.branch}>
            {profile.session
              .find(item => item.id === profile.session.id)
              .exercise.map(exercise => (
                <div className={classes.root} key={exercise._id}>
                  <ExpansionPanel
                    expanded={expanded === exercise._id}
                    onChange={handleChange(exercise._id)}
                  >
                    <ExpansionPanelSummary
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls='panel1bh-content'
                      id='panel1bh-header'
                    >
                      <Typography className={classes.heading}>
                        {exercise.name}
                      </Typography>
                    </ExpansionPanelSummary>
                    <ExpansionPanelDetails>
                      <Typography>{exercise._id}</Typography>
                    </ExpansionPanelDetails>
                  </ExpansionPanel>
                </div>
              ))}
          </div>
        </>
      ) : (
        <>
          <h1 className={classes.branch}>
            You have not yet created any exercises
          </h1>
        </>
      )}
    </>
  );
};

Exercises.propTypes = {
  getCurrentProfile: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  profile: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  profile: state.profile
});

export default connect(
  mapStateToProps,
  { getCurrentProfile }
)(Exercises);
