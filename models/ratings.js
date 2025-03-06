const mongoose = require('mongoose');

const ratingSchema = mongoose.Schema({
    id_user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users'
    },
    id_recipe: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'recipes'
    },
    rating: Number
});

const Rating = mongoose.model('ratings', ratingSchema);

module.exports = Rating;