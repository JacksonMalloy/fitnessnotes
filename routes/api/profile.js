const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');

const { check, validationResult } = require('express-validator');

const User = require('../../models/User');
const Profile = require('../../models/Profile');

//*******************************************//
//**********-----USER/PROFILE------**********//
//*******************************************//

//GET
//Get current users profile
//Private
router.get('/me', auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id }).populate(
      'user',
      ['name']
    );

    if (!profile) {
      return res.status(400).json({ msg: 'There is no profile for this user' });
    }

    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// POST
// Create or update user profile
// Private
router.post('/', auth, async (req, res) => {
  const {
    bio,
    status,
    website,
    youtube,
    facebook,
    twitter,
    instagram,
    linkedin
  } = req.body;

  //Build Profile Object
  const profileFields = {};
  profileFields.user = req.user.id;
  if (website) profileFields.website = website;
  if (bio) profileFields.bio = bio;
  if (status) profileFields.status = status;

  //Build Social Object
  profileFields.social = {};
  if (youtube) profileFields.social.youtube = youtube;
  if (twitter) profileFields.social.twitter = twitter;
  if (facebook) profileFields.social.facebook = facebook;
  if (linkedin) profileFields.social.linkedin = linkedin;
  if (instagram) profileFields.social.instagram = instagram;

  //Look for profile by the user
  try {
    let profile = await Profile.findOne({ user: req.user.id });
    if (profile) {
      //Update Profile
      profile = await Profile.findOneAndUpdate(
        { user: req.user.id },
        { $set: profileFields },
        { new: true }
      );

      return res.json(profile);
    }

    ///Create Profile
    profile = new Profile(profileFields);

    await profile.save();

    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// DELETE
// Delete Profile & User
// Private
router.delete('/', auth, async (req, res) => {
  try {
    //Remove Profile
    await Profile.findOneAndRemove({ user: req.user.id });
    //Remove User
    await User.findOneAndRemove({ _id: req.user.id });

    res.json({ msg: 'User Deleted' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

//*******************************************//
//************-----SESSIONS------************//
//*******************************************//

//PUT
//Add session
//Private
router.put(
  '/session',
  [
    auth,
    [
      //second parameter for custom error message
      check('workout', 'Workout is required')
        .not()
        .isEmpty()
    ]
  ],
  async (req, res) => {
    //handles response (ValidationResult takes in the request)
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    //destructuring data coming in
    const { workout, completed } = req.body;

    //create new object ('newSess') with data the user submits
    const newSess = {
      workout,
      completed
    };

    //fetch the profile we want to add the new Session to
    try {
      const profile = await Profile.findOne({ user: req.user.id });

      profile.session.unshift(newSess);

      await profile.save();

      res.json(profile);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// DELETE
// Delete session from profile
// Private
router.delete('/session/:sess_id', auth, async (req, res) => {
  try {
    //getting profile of the user
    const profile = await Profile.findOne({ user: req.user.id });

    //Get remove index
    const removeIndex = profile.session
      .map(item => item.id)
      .indexOf(req.params.sess_id);

    //splicing it out
    profile.session.splice(removeIndex, 1);

    //resaving
    await profile.save();

    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

//*******************************************//
//************-----EXERCISES------***********//
//*******************************************//

const exercise = express.Router({ mergeParams: true });
router.use(
  '/:sess_id/exercise',
  (req, res, next) => {
    req.sess_id = req.params.sess_id;
    next();
  },
  exercise
);

// POST
// Add exercise to a session
// Private

exercise.post(
  '/',
  [
    auth,
    [
      check('name', 'Exercise name is required')
        .not()
        .isEmpty()
    ]
  ],
  async (req, res) => {
    //handles response (ValidationResult takes in the request)
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    //destructuring data coming in
    const { name, notes, completed } = req.body;

    //create new object ('newExercise') with data the user submits
    const newExercise = {
      name,
      notes,
      completed
    };

    //fetch the profile
    try {
      const profile = await Profile.findOne({ user: req.user.id });

      profile.session
        .find(item => item.id === req.sess_id)
        .exercise.unshift(newExercise);

      await profile.save();

      res.json(profile);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// DELETE
// Remove exercise from a session
// Private

exercise.delete('/:exercise_id', auth, async (req, res) => {
  try {
    //getting profile of the user
    const profile = await Profile.findOne({ user: req.user.id });

    //Get remove index
    const session = profile.session.find(item => item.id === req.sess_id);

    const removeIndex = session.exercise.findIndex(
      item => item.id === req.params.exercise_id
    );

    if (removeIndex < 0) {
      return res.status(400).json({ msg: 'There is no session with that ID' });
    } else {
      session.exercise.splice(removeIndex, 1);
    }
    //splicing it out

    //resaving
    await profile.save();

    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

//*******************************************//
//***************-----SETS------*************//
//*******************************************//

const sets = express.Router({ mergeParams: true });
exercise.use(
  '/:exercise_id/sets',
  (req, res, next) => {
    req.exercise_id = req.params.exercise_id;
    next();
  },
  sets
);

// POST
// Add set to an exercise
// Private

sets.post(
  '/',
  [
    auth,
    [
      check('reps', 'Number of repetitions is required')
        .not()
        .isEmpty(),
      check('weight', 'Weight per set is required')
        .not()
        .isEmpty()
    ]
  ],
  async (req, res) => {
    //handles response (ValidationResult takes in the request)
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    //destructuring data coming in
    const { reps, weight } = req.body;

    //create new object ('newExercise') with data the user submits
    const newSet = {
      reps,
      weight
    };

    //fetch the profile
    try {
      const profile = await Profile.findOne({ user: req.user.id });
      const session = profile.session.find(
        item => item.id === req.params.sess_id
      );
      const exercise = session.exercise.find(
        item => item.id === req.params.exercise_id
      );

      exercise.sets.unshift(newSet);

      console.log(newSet);

      await profile.save();

      res.json(profile);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// DELETE
// Remove set from an exercise
// Private

sets.delete('/:sets_id', auth, async (req, res) => {
  try {
    //getting profile of the user
    const profile = await Profile.findOne({ user: req.user.id });

    //Get remove index
    const session = profile.session.find(item => item.id === req.sess_id);

    const exercise = session.exercise.find(
      item => item.id === req.params.exercise_id
    );

    const removeIndex = exercise.sets.findIndex(
      item => item.id === req.params.sets_id
    );

    console.log(removeIndex);

    //splicing it out
    if (removeIndex < 0) {
      return res.status(400).json({ msg: 'There is no session with that ID' });
    } else {
      exercise.sets.splice(removeIndex, 1);
    }

    //resaving
    await profile.save();

    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
