const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const { check, validationResult } = require('express-validator');

const User = require('../../models/User');

//POST
//Register User
//Public
router.post(
  '/',
  [
    //second parameter for custom error message
    check('name', 'Name is required')
      .not()
      .isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check(
      'password',
      'Please enter a password with 6 or more characters'
    ).isLength({ min: 6 })
  ],
  async (req, res) => {
    //handles response (ValidationResult takes in the request)
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password } = req.body;

    try {
      //See if user exists
      let user = await User.findOne({ email });

      if (user) {
        //so we get the same type of error clientside
        return res
          .status(400)
          .json({ errors: [{ msg: 'User already exists' }] });
      }

      user = new User({
        name,
        email,
        password
      });

      //Encrypt Password
      //create salt to do hashing (higher rounds more secure/slower it will be)
      const salt = await bcrypt.genSalt(10);

      //take password and hash it
      user.password = await bcrypt.hash(password, salt);

      //save user to database
      await user.save();

      //Return JSONwebtoken-------
      //Get Payload
      const payload = {
        user: {
          id: user.id
        }
      };

      jwt.sign(
        payload,
        config.get('jwtSecret'),
        //before deployment change to 3600 (which is an hour) - When token expires
        { expiresIn: 3600 },
        (err, token) => {
          if (err) throw err;
          //could send user ID if we wanted
          res.json({ token });
        }
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

module.exports = router;
