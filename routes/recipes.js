var express = require('express');
var router = express.Router();

const Recipe = require('../models/recipes');

// Get all recipes
router.get('/all', (req, res) => {
    Recipe.find()
        .then(data => {
            if (data) {
                res.json({ result: true, number: data.length, recipes: data })
            } else {
                res.json({ result: false });
            }
        })
        .catch(error => res.json({ result: false, error }))
});

// Get all recipes with restriction
router.get('/search', (req, res) => {
    let options = {};
    for (let diet in req.query) {
        options[diet] = req.query[diet] == 'true' ? true : false;
    }
    Recipe.find(options)
        .then(data => {
            res.json({ result: true, number: data.length, recipes: data })
        })
        .catch(error => res.json({ result: false, error }))
});


// Get all recipes name with the restriction
router.get('/name', (req, res) => {
    Recipe.find({ muscleGain: true })
        .then(data => {
            res.json(data.map((name) => name.name));
        })
});

module.exports = router;