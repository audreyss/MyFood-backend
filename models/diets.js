const mongoose = require('mongoose');

const dietSchema = mongoose.Schema({
    name: String,
    yes: [String],
    no: [String]
});

const Diet = mongoose.model('diets', dietSchema);

module.exports = Diet;