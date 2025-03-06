var express = require('express');
var router = express.Router();

const Rating = require('../models/ratings');
const User = require('../models/users');

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

// ROUTE GET ratings/:id : get rating by id
router.get('/:id', (req, res) => {
    Rating.find({ id_recipe: req.params.id })
    .populate('id_user')
        .then(data => {
            if (data) {
                res.json({ result: true, ratings: data })
            } else {
                res.json({ result: false });
            }
        })
        .catch(error => res.json({ result: false, error }))
});

// ROUTE POST ratings/ : add new rating
router.post('/', (req, res) => {
    User.findOne({ token: req.body.token })
        .then(data => {
            if (data) {
                const newRating = new Rating({
                    id_user: data._id,
                    id_recipe: req.body.id_recipe,
                    rating: req.body.rating
                });
                newRating.save()
                    .then((databis) => res.json({ result: true, databis }))
            } else {
                res.json({ result: false });
            }
        })
        .catch(error => res.json({ result: false, error }))
});

module.exports = router;

// ROUTE PUT ratings/ : update rating
router.put('/', (req, res) => {
    User.findOne({ token: req.body.token })
        .then(data => {
            if (data) {
                Rating.findOneAndUpdate({ id_user: data._id, id_recipe: req.body.recipe_id }, { rating: req.body.rating })
                    .then((rating) => res.json({ result: true, rating }))
            } else {
                res.json({ result: false });
            }
        })
        .catch(error => res.json({ result: false, error }))
    });