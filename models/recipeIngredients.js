const mongoose = require('mongoose');

const recipeIngredientSchema = mongoose.Schema({
    name: String,
    id_recipes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'recipes'
    }]
});

const RecipeIngredient = mongoose.model('recipe_ingredients', recipeIngredientSchema);

module.exports = RecipeIngredient;