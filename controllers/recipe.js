const recipesRouter = require("express").Router();
const Recipe = require("../models/recipe");
const User = require('../models/user')
const jwt = require('jsonwebtoken')

recipesRouter.get("/", async (request, response) => {
  const recipes = await Recipe.find({}).populate('user', { username: 1 })
  response.json(recipes);
});

// FETCH AN INDIVIDUAL RECIPE
recipesRouter.get("/:id", async (request, response) => {
  const recipe = await Recipe.findById(request.params.id);
  if (recipe) {
    response.json(recipe);
  } else {
    response.status(404).end();
  }
});

// POST (Save a Recipe)
const getTokenFrom = request => {
  const authorization = request.get('authorization')
  if (authorization && authorization.startsWith('Bearer ')) {
    return authorization.replace('Bearer ', '')
  }
  return null
}

recipesRouter.post("/", async (request, response) => {
  const body = request.body;

  const decodedToken = jwt.verify(getTokenFrom(request), process.env.SECRET)
  if (!decodedToken.id) {
    return response.status(401).json({ error: 'token invalid' })
  }
  const user = await User.findById(decodedToken.id)

  const recipe = new Recipe({
    name: body.name,
    ingredients: body.ingredients,
    instructions: body.instructions,
    category: body.category,
    image: body.image,
    like: false,
    user: user.id
  });

  const savedRecipe = await recipe.save();
  user.recipes = user.recipes.concat(savedRecipe._id)
  await user.save()

  response.json(savedRecipe);
});

// DELETE RECIPE
recipesRouter.delete("/:id", async (request, response) => {
  await Recipe.findByIdAndRemove(request.params.id);
  response.status(204).end();
});

// Update a Recipe
recipesRouter.put("/:id", (request, response, next) => {
  const { name, ingredients, instructions, category, image, like } =
    request.body;

  Recipe.findByIdAndUpdate(
    request.params.id,
    { name, ingredients, instructions, category, image, like },
    { new: true, runValidation: true, context: "query" }
  )
    .then((updatedNote) => {
      response.json(updatedNote);
    })
    .catch((error) => next(error));
});

module.exports = recipesRouter;
