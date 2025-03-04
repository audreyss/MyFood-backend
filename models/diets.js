const mongoose = require('mongoose');

const dietSchema = mongoose.Schema({
    name: String,
    prop: String,
    icon: String,
    yesString: String,
    yes: [String],
    noString: String,
    no: [String]
});

const Diet = mongoose.model('diets', dietSchema);

module.exports = Diet;