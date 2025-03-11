var express = require('express');
var router = express.Router();

const Recipe = require('../models/recipes');
const RecipeIngredient = require('../models/recipeIngredients');

// ROUTE GET /RECIPES/ALL: get all recipes
router.get('/all', (req, res) => {
    Recipe.find()
        .then(data => {
            if (data) {
                // keep certains fields of recipe
                const recipes = data.map((recipe) => ({
                    id: recipe._id, name: recipe.name, healthy: recipe.healthy, vegetarian: recipe.vegetarian,
                    glutenFree: recipe.glutenFree, pregnant: recipe.pregnant, muscleGain: recipe.muscleGain, picture: recipe.picture,
                }))
                res.json({ result: true, number: recipes.length, recipes })
            } else {
                res.json({ result: false });
            }
        })
        .catch(error => res.json({ result: false, error }))
});

// ROUTE GET /RECIPES/SEARCH: search recipes with given query parameters
// example: http://localhost:3000/recipes/search?diets=vegetarian,glutenFree&name=soup
// query parameter: name and diets
// diets: vegetarian, pregnant, glutenFree, muscleGain, healthy
router.get('/search', async (req, res) => {
    let options = {};
    let ingredientsOpt = [];
    // loop on req.query
    for (let opt in req.query) {
        const value = req.query[opt];

        if (value == '') {
            continue;
        }
        if (opt == 'name') {
            // name query
            options['name'] = { $regex: new RegExp(value, "i") }
        } else if (opt == 'diets') {
            // diets query
            for (let diet of value.split(',')) {
                options[diet] = true;
            }
        } else if (opt == 'ingredients') {
            // ingredients query
            for (let ingredient of value.split(',')) {
                ingredientsOpt.push(ingredient);
            }
        } else {
            // unknown query
            return res.json({ result: false, error: "Invalid value for query parameter." })
        }
    }

    if (ingredientsOpt.length > 0) {
        const ingredient = await RecipeIngredient.findOne({ name: { $regex: new RegExp(ingredientsOpt[0], "i") } });
        console.log(ingredient);
        if (!ingredient) {
            return res.json({ result: true, number: 0, recipes: [] });
        }
        options['_id'] = { $in: ingredient.id_recipes };
    }


    // get recipes with given options
    Recipe.find(options)
        .then(data => {
            // keep certains fields of recipe
            const recipes = data.map((recipe) => ({
                id: recipe._id, name: recipe.name, healthy: recipe.healthy, vegetarian: recipe.vegetarian,
                glutenFree: recipe.glutenFree, pregnant: recipe.pregnant, muscleGain: recipe.muscleGain, picture: recipe.picture
            }))
            res.json({ result: true, number: recipes.length, recipes })
        })
        .catch(error => res.json({ result: false, error }))
});

// ROUTE GET /RECIPES/RECIPE/:ID : get information of recipe with given id
router.get('/recipe/:id', (req, res) => {
    // get recipe with _id = given id
    Recipe.find({ _id: req.params.id })
        .then(data => {
            if (data) {
                res.json({ result: true, recipe: data })
            } else {
                res.json({ result: false });
            }
        })
        .catch(error => res.json({ result: false, error }))
});

module.exports = router;