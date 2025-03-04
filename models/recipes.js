const mongoose = require('mongoose');

const ingredientSchema = mongoose.Schema({
    name: String,
    unit: String,
    quantity: Number
})

const recipeSchema = mongoose.Schema({
    name: String,
    picture: String,
    numberOfServings: Number,
    muscleGain: Boolean,
    healthy: Boolean,
    pregnant: Boolean,
    glutenFree: Boolean,
    Vegetarian: Boolean,
    calories: Number,
    glucides: String,
    lipides: String,
    proteins: String,
    readyInMinutes: Number,
    ingredients: [ingredientSchema]
});

const Recipe = mongoose.model('recipes', recipeSchema);

module.exports = Recipe;