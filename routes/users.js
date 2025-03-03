var express = require('express');
var router = express.Router();

const User = require('../models/users');
const { body, validationResult } = require("express-validator");
const uid2 = require('uid2');
const bcrypt = require('bcrypt');

// validator for sign up
const validateSignIn = [
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


router.post('/signup', validateSignIn, (req, res) => {
  // check errors for validation
  const result = validationResult(req);
  if (result.notEmpty()) {
    return res.json({ result: false, error: result.array() });;
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
          res.json({ result: true, username: data.username })
        })
        .catch(error => res.json({ result: false, error }));
    })
    .catch(error => res.json({ result: false, error }))
});

module.exports = router;
