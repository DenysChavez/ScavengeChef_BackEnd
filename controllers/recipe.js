const recipesRouter = require("express").Router();
const Recipe = require("../models/recipe");

recipesRouter.get("/", async (request, response) => {
  const recipes = await Recipe.find({});
  response.json(recipes);
});

// FETCH AN INDIVIDUAL RECIPE
recipesRouter.get("/:id", (request, response, next) => {
  Recipe.findById(request.params.id)
    .then((recipe) => {
      if (recipe) {
        response.json(recipe);
      } else {
        response.status(404).end();
      }
    })
    .catch((error) => next(error));
});

// POST (Save a Recipe)
recipesRouter.post("/", async (request, response, next) => {
  const body = request.body;

  const recipe = new Recipe({
    name: body.name,
    ingredients: body.ingredients,
    instructions: body.instructions,
    category: body.category,
    image: body.image,
    like: false,
  });

  try {
    const savedRecipe = await recipe.save();
    response.status(201).json(savedRecipe);
  } catch (exception) {
    next(exception)
  }

  // recipe
  //   .save()
  //   .then((savedRecipe) => {
  //     response.status(201).json(savedRecipe);
  //   })
  //   .catch((error) => next(error));
});

// DELETE RECIPE
recipesRouter.delete("/:id", (request, response, next) => {
  Recipe.findByIdAndRemove(request.params.id)
    .then(() => {
      response.status(204).end();
    })
    .catch((error) => next(error));
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
