import React, { useState } from 'react';
import { Link, withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { addSession } from '../../actions/profile';

const AddSession = ({ addSession, history }) => {
  const [formData, setFormData] = useState({
    workout: '',
    date: '',
    completed: false
  });

  const [toDateDisabled, toggleDisabled] = useState(false);

  const { workout, date, completed } = formData;

  const onChange = e =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  return (
    <>
      <h1 className='large text-primary'>Add A Session</h1>
      <small>* = required field</small>
      <form
        className='form'
        onSubmit={e => {
          e.preventDefault();
          addSession(formData, history);
        }}
      >
        <div className='form-group'>
          <input
            type='text'
            placeholder='Workout'
            name='Workout'
            value={workout}
            onChange={e => onChange(e)}
            required
          />
        </div>
        <div className='form-group'>
          <input
            type='text'
            placeholder='Date'
            name='Date'
            value={date}
            onChange={e => onChange(e)}
            required
          />
        </div>
        <div className='form-group'>
          <input
            type='text'
            placeholder='Completed'
            name='Completed'
            value={completed}
            onChange={e => onChange(e)}
          />
        </div>
        <input type='submit' className='btn btn-primary my-1' />
        <Link className='btn btn-light my-1' to='/dashboard'>
          Go Back
        </Link>
      </form>
    </>
  );
};

AddSession.propTypes = {
  addSession: PropTypes.func.isRequired
};

export default connect(
  null,
  { addSession }
)(withRouter(AddSession));
