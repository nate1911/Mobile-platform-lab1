const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const RecipeSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    ingredients: {
        type: [String],
        required: true
    },
    instructions: {
        type: String,
        required: true
    },
    cookingtime: {
        type: String,
        required: true
    },
    timestamp:{
        type: String,
        default: Date.now()
    }
})


const Recipe = mongoose.model("Recipes", RecipeSchema);

module.exports = Recipe;