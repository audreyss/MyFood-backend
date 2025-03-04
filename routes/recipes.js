var express = require('express');
var router = express.Router();

const Recipe = require('../models/recipes');

router.get('/', (req, res) => {
    Recipe.find({ muscleGain: true})
    .then(data => {
        res.json(data.map((name) => name.name));
    })
});

module.exports = router;