import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { makeStyles } from '@material-ui/core/styles';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import clsx from 'clsx';
import ErrorIcon from '@material-ui/icons/Error';
import IconButton from '@material-ui/core/IconButton';

const variantIcon = {
  error: ErrorIcon
};

const useStyles1 = makeStyles(theme => ({
  error: {
    backgroundColor: theme.palette.error.dark
  },
  icon: {
    fontSize: 20
  },
  iconVariant: {
    opacity: 0.9,
    marginRight: theme.spacing(3)
  },
  message: {
    display: 'flex',
    alignItems: 'center'
  },
  branch: {
    padding: '64px 0'
  }
}));

function MySnackbarContentWrapper(props) {
  const classes = useStyles1();
  const { className, message, onClose, variant, ...other } = props;
  const Icon = variantIcon[variant];

  return (
    <SnackbarContent
      className={clsx(classes[variant], className)}
      aria-describedby='client-snackbar'
      message={
        <span id='client-snackbar' className={classes.message}>
          <Icon className={clsx(classes.icon, classes.iconVariant)} />
          {message}
        </span>
      }
      action={[
        <IconButton
          key='close'
          aria-label='close'
          color='inherit'
          onClick={onClose}
        />
      ]}
      {...other}
    />
  );
}

const useStyles2 = makeStyles(theme => ({
  margin: {
    margin: theme.spacing(1)
  }
}));

//11. destructuring alerts
const Alert = ({ alerts }) => {
  const classes = useStyles2();

  return (
    alerts !== null &&
    alerts.length > 0 &&
    alerts.map(alert => (
      // <div key={alert.id} className={`alert alert-${alert.alertType}`}>
      //   {alert.msg}
      // </div>
      <div key={alert.id} className={classes.root}>
        <MySnackbarContentWrapper
          variant='error'
          className={classes.margin}
          message={alert.msg}
        />
      </div>
    ))
  );
};

Alert.propTypes = {
  alerts: PropTypes.array.isRequired
};

MySnackbarContentWrapper.propTypes = {
  className: PropTypes.string,
  message: PropTypes.string,
  onClose: PropTypes.func,
  variant: PropTypes.oneOf(['error', 'info', 'success', 'warning']).isRequired
};

const mapStateToProps = state => ({
  alerts: state.alert
});

export default connect(mapStateToProps)(Alert);
