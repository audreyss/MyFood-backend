var express = require('express');
var router = express.Router();

const User = require('../models/users');
const { body, validationResult } = require("express-validator");
const uid2 = require('uid2');
const bcrypt = require('bcrypt');

const fields = ['muscleGain', 'healthy', 'pregnant', 'glutenFree', 'vegetarian'];

// validator for sign up
const validateSignUp = [
  body('email')
    .notEmpty()
    .isEmail().withMessage('Not valid email.')
    .normalizeEmail(),
  body('password')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters long.')
    .matches(/^[a-zA-Z0-9!@#$%^&*]+$/).withMessage('Password contains not allowed characters.'),
  body('username')
    .notEmpty().withMessage('Empty username.')
    .escape()
];

// ROUTE POST /USERS/SIGNUP
router.post('/signup', validateSignUp, (req, res) => {
  // check validation
  const result = validationResult(req);
  if (!result.isEmpty()) {
    return res.json({ result: false, error: result.array()[0].msg });;
  }

  // check if another user with same email
  User.findOne({ email: req.body.email })
    .then(data => {
      if (data) {
        // another user with same email
        return res.json({ result: false, error: 'User already exists with given email.' });
      }
      // create new User with hashed password
      const hash = bcrypt.hashSync(req.body.password, 10);
      const newUser = new User({
        username: req.body.username,
        email: req.body.email,
        password: hash,
        token: uid2(32),
      });

      // save new User 
      newUser.save()
        .then(data => {
          res.json({ result: true, username: data.username, token: data.token })
        })
        .catch(error => res.json({ result: false, error }));
    })
    .catch(error => res.json({ result: false, error }))
});

// validator for sign in
const validateSignIn = [
  body('email')
    .notEmpty()
    .isEmail().withMessage('Not valid email.')
    .normalizeEmail(),
  body('password')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters long.')
    .matches(/^[a-zA-Z0-9!@#$%^&*]+$/).withMessage('Password contains not allowed characters.'),
];

// ROUTE POST /USERS/SIGNIN
router.post('/signin', validateSignIn, (req, res) => {
  // check validation
  const result = validationResult(req);
  if (!result.isEmpty()) {
    return res.json({ result: false, error: result.array()[0].msg });
  }

  // Check if user with same email exists
  User.findOne({ email: req.body.email })
    .then(data => {
      // check if user found has same password
      if (data && bcrypt.compareSync(req.body.password, data.password)) {
        const result = { result: true, username: data.username, token: data.token };
        fields.forEach(field => result[field] = data[field]);

        res.json(result);
      } else {
        // no user found or wrong password
        res.json({ result: false, error: 'User not found or wrong password.' })
      }
    })
    .catch(error => res.json({ result: false, error }))
})

// ROUTE PUT /USERS/DIET/:TOKEN
router.put('/diet/:token', (req, res) => {
  // get user's token and field's name to update
  const token = req.params.token;
  const field = req.body.field;

  // check field is correct
  if (!fields.includes(field)) {
    return res.json({ result: false, error: 'Invalid field.' });
  }

  // find User with given token
  User.findOne({ token })
    .then(data => {
      // if user not found: error
      if (!data) {
        return res.json({ result: false, error: 'User not found.' });
      }

      // put all fields to false then change the given field to true 
      // (allow only one value to true)
      const val = {};
      fields.forEach(f => val[f] = false);
      val[field] = true;

      // get value of field
      const value = data[field];
      // update field's value in db: true
      User.updateOne({ token }, val)
        .then(() => res.json({ result: true }))
    })
    .catch(error => res.json({ result: false, error }));
});


// validator for email
const validateEmail = [
  body('email')
    .notEmpty()
    .isEmail().withMessage('Not valid email.')
    .normalizeEmail(),
];

// ROUTE PUT /USERS/EMAIL/:TOKEN
router.put('/email/:token', validateEmail, (req, res) => {
  // get user's token and new email
  const token = req.params.token;
  const newEmail = req.body.email;

  // check validation
  const result = validationResult(req);
  if (!result.isEmpty()) {
    return res.json({ result: false, error: result.array()[0].msg });
  }
  // check if another user exists with new email
  User.findOne({ email: req.body.email })
    .then(data => {
      if (data) {
        // another user with same email
        return res.json({ result: false, error: 'User with given email already exists.' });
      }
      // Find user and update email
      User.findOneAndUpdate({ token }, { email: newEmail })
        .then((data) => {
          // User not found
          if (!data) {
            return res.json({ result: false, error: 'User not found.' });
          }
          res.json({ result: true })
        })
        .catch(error => res.json({ result: false, error }));
    })
});


// validator for password
const validatePasswords = [
  body('newPassword')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters long.')
    .matches(/^[a-zA-Z0-9!@#$%^&*]+$/).withMessage('Password contains not allowed characters.'),
  body('oldPassword')
    .notEmpty().withMessage('Need old password.'),
];

// ROUTE PUT /USERS/PASSWORD/:TOKEN
router.put('/password/:token', validatePasswords, (req, res) => {
  // get user's token
  const token = req.params.token;

  // check validation
  const result = validationResult(req);
  if (!result.isEmpty()) {
    return res.json({ result: false, error: result.array()[0].msg });
  }

  // find user and update password
  User.findOne({ token })
    .then(data => {
      if (data && bcrypt.compareSync(req.body.oldPassword, data.password)) {
        // hash new password
        const hash = bcrypt.hashSync(req.body.newPassword, 10);
        User.updateOne({ token }, { password: hash })
          .then(() => res.json({ result: true }))
      } else {
        res.json({ result: false, error: 'User not found or wrong password.' })
      }
    }).catch(error => res.json({ result: false, error }));
});

// validator for password
const validatePassword = [
  body('password')
    .notEmpty().withMessage('Need password.'),
];

// ROUTE DELETE /USERS/:TOKEN
router.delete('/:token', validatePassword, (req, res) => {
  // get user's token
  const token = req.params.token;

  // check validation
  const result = validationResult(req);
  if (!result.isEmpty()) {
    return res.json({ result: false, error: result.array()[0].msg });
  }

  // find user 
  User.findOne({ token })
    .then(data => {
      // check if user found and correct password
      if (data && bcrypt.compareSync(req.body.password, data.password)) {
        // delete user
        User.deleteOne({ token })
          .then(() => res.json({ result: true }))
          .catch(error => res.json({ result: false, error }))
      } else {
        res.json({ result: false, error: 'User not found or wrong password.' })
      }
    }).catch(error => res.json({ result: false, error }));
});

module.exports = router;