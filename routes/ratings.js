var express = require('express');
var router = express.Router();

const Rating = require('../models/ratings');

// ROUTE GET ratings/all : get all ratings
router.get('/', (req, res) => {
    Rating.find()
        .then(data => {
            if (data) {
                res.json({ result: true, number: data.length, ratings: data })
            } else {
                res.json({ result: false });
            }
        })
        .catch(error => res.json({ result: false, error }))
});


router.post('/:id', (req, res) => {
    
    const newRating = new Rating({
        id_user: req.body.token,
        id_recipe: req.params.id,
        ratings: req.body.rating
    });
    newRating.save()
        .then(data => {
            if (data) {
                res.json({ result: true, rating: data.ratings })
            } else {
                res.json({ result: false });
            }
        })
        .catch(error => res.json({ result: false, error }))
});

module.exports = router;