var express = require('express');
var router = express.Router();

const Recipe = require('../models/recipes');

// Get all recipes with the restriction
router.get('/', (req, res) => {
    Recipe.find({ muscleGain: true})
    .then(data => {
        res.json(data);
    })
});


// Get all recipes name with the restriction
router.get('/name', (req, res) => {
    Recipe.find({ muscleGain: true})
    .then(data => {
        res.json(data.map((name) => name.name));
    })
});

module.exports = router;