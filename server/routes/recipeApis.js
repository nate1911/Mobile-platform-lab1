const express = require('express');
const router = express.Router();
const recipes = require('../models/recipes');


//gets all recipes in a json array
router.get('/', async (req,res) =>{
  const recipesFromDB = await recipes.find();
  
  res.json(recipesFromDB);
})

//retrieve a specific recipe using id,/api/recipes/:title) 

router.get('/:title', async (req, res) => {
  const recipeTitle = req.params.title;

  try {
    // Find the recipe by title in the database
    const recipe = await recipes.findOne({ title: recipeTitle });

    if (!recipe) {
      // If the recipe doesn't exist, return an appropriate response
      return res.status(404).json({ error: 'Recipe not found' });
    }

    // If the recipe is found, return it as a JSON response
    res.json(recipe);
  } catch (error) {
    // Handle any database or server errors
    console.error(error);
    res.status(500).json({ error: 'Server Error' });
  }
});

 //posts a new recipe
 router.post('/', async (req, res) => {
  const { title, ingredients, instructions, cookingtime } = req.body;

  try {
    // Check if a recipe with the same title already exists
    const existingRecipe = await recipes.findOne({ title });

    if (existingRecipe) {
      // Recipe with the same title already exists, return a conflict response
      return res.status(409).json({ error: 'Recipe already exists' });
    }

    // Create a new recipe in the database
    const newRecipe = new recipes({
      title,
      ingredients,
      instructions,
      cookingtime,
    });

    await newRecipe.save();

    // Return the newly added recipe with an HTTP status code of 201 (Created)
    res.status(201).json(newRecipe);
  } catch (error) {
    // Handle any database or server errors
    console.error(error);
    res.status(500).json({ error: 'Server Error' });
  }
});


 // PUT endpoint for updating a recipe by ID
 router.put('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    // Check if the recipe with the specified ID exists
    const existingRecipe = await recipes.findById(id);

    if (!existingRecipe) {
      return res.status(404).json({ error: 'Recipe not found' });
    }

    // Update the recipe based on the request body
    const updatedRecipe = {
      title: req.body.title || existingRecipe.title,
      ingredients: req.body.ingredients || existingRecipe.ingredients,
      instructions: req.body.instructions || existingRecipe.instructions,
      cookingtime: req.body.cookingtime || existingRecipe.cookingtime,
    };

    // Perform the update using Mongoose's findOneAndUpdate method
  const result = await recipes.findByIdAndUpdate(id, updatedRecipe, { new: true });

  // Return the updated recipe
  res.json(result);
} catch (error) {
  console.error(error);
  res.status(500).json({ error: 'Server Error' });
}
});

router.delete('/:id', async (req, res) => {

    const { id } = req.params;
  
    try {
      // Check if the recipe with the specified ID exists
      const existingRecipe = await recipes.findById(id);
  
      if (!existingRecipe) {
        return res.status(404).json({ error: 'Recipe not found' });
      }
  
      // Perform the deletion using Mongoose's findByIdAndDelete method
      await recipes.findByIdAndDelete(id);
  
      // Return a 204 (No Content) status to indicate successful deletion
      res.status(204).end();
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Server Error' });
    }
  });

  module.exports = router;