const recipesRouter = require("express").Router();
const Recipe = require("../models/recipe");

recipesRouter.get("/", async (request, response) => {
  const recipes = await Recipe.find({});
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
recipesRouter.post("/", async (request, response) => {
  const body = request.body;

  const recipe = new Recipe({
    name: body.name,
    ingredients: body.ingredients,
    instructions: body.instructions,
    category: body.category,
    image: body.image,
    like: false,
  });

  const savedRecipe = await recipe.save();
  response.status(201).json(savedRecipe);
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
