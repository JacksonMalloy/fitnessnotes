import React from 'react';
import PropTypes from 'prop-types';

const ProfileTop = ({ profile: { bio, status, website, social } }) => {
  return (
    <div class='profile-top bg-primary p-2'>
      <p class='lead'>{status}</p>
      <p class='lead'>{bio}</p>
      <div class='icons my-1'>
        {website && (
          <a href={website} target='_blank' rel='noopener noreferrer'>
            <i class='fas fa-globe fa-2x' />
          </a>
        )}

        {social && social.twitter && (
          <a href={social.twitter} target='_blank' rel='noopener noreferrer'>
            <i class='fab fa-twitter fa-2x' />
          </a>
        )}

        {social && social.facebook && (
          <a href={social.facebook} target='_blank' rel='noopener noreferrer'>
            <i class='fab fa-facebook fa-2x' />
          </a>
        )}

        {social && social.linkedin && (
          <a href={social.linkedin} target='_blank' rel='noopener noreferrer'>
            <i class='fab fa-linkedin fa-2x' />
          </a>
        )}

        {social && social.youtube && (
          <a href={social.youtube} target='_blank' rel='noopener noreferrer'>
            <i class='fab fa-youtube fa-2x' />
          </a>
        )}

        {social && social.instagram && (
          <a href={social.instagram} target='_blank' rel='noopener noreferrer'>
            <i class='fab fa-instagram fa-2x' />
          </a>
        )}
      </div>
    </div>
  );
};

ProfileTop.propTypes = {
  profile: PropTypes.object.isRequired
};

export default ProfileTop;
