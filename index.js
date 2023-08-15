require('dotenv').config()
const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const Recipe = require('./models/recipe');

const requestLogger = (request, response, next) => {
  console.log("Method:", request.method);
  console.log("Path:  ", request.path);
  console.log("Body:  ", request.body);
  console.log("---");
  next();
};

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(404).send({error: 'malformatted id'})
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({error: error.message})
  }

  next(error)
}

// handler of requests with unknown endpoint
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};
app.use(express.static("build"));
app.use(express.json());
app.use(cors());
app.use(requestLogger);

let recipes = [
  {
    id: 1,
    name: "Spaghetti Bolognese",
    ingredients: [
      "400g spaghetti",
      "2 tbsp olive oil",
      "1 onion, finely chopped",
      "2 cloves garlic, minced",
      "400g ground beef",
      "2 cans (400g each) crushed tomatoes",
      "1 tsp salt",
      "1 tsp black pepper",
      "1 tsp dried basil",
      "1 tsp dried oregano",
    ],
    instructions: [
      "Cook the spaghetti according to package instructions, then drain and set aside.",
      "Meanwhile, heat the oil in a large pan over medium heat. Add the onion and garlic, and sauté until soft and fragrant.",
      "Add the ground beef to the pan and cook until browned. Drain any excess fat.",
      "Stir in the crushed tomatoes, salt, pepper, basil, and oregano. Simmer for 20-30 minutes, stirring occasionally.",
      "Serve the sauce over the cooked spaghetti, garnish with extra basil or parmesan if desired.",
    ],
    category: "Pasta",
    image:
      "https://img.buzzfeed.com/thumbnailer-prod-us-east-1/8fc00a45259a49d49d9100a34f2087eb/BFV44742_PantryPasta_FB_Final.jpg",
    like: true,
  },
  {
    id: 2,
    name: "Chicken Caesar Salad",
    ingredients: [
      "2 chicken breasts, grilled and sliced",
      "1 head romaine lettuce, washed and torn",
      "1/2 cup Caesar dressing",
      "1/2 cup grated Parmesan cheese",
      "1 cup croutons",
    ],
    instructions: [
      "Arrange the lettuce on a large platter.",
      "Place the grilled chicken slices on top of the lettuce.",
      "Drizzle the Caesar dressing over the salad.",
      "Sprinkle the Parmesan cheese and croutons over the top.",
      "Serve immediately.",
    ],
    category: "Salad",
    image:
      "https://www.jessicagavin.com/wp-content/uploads/2022/06/chicken-caesar-salad-24-600x900.jpg",
    like: true,
  },
  {
    id: 3,
    name: "Chocolate Chip Cookies",
    ingredients: [
      "1 cup unsalted butter, softened",
      "1 cup white sugar",
      "1 cup packed brown sugar",
      "2 eggs",
      "2 tsp vanilla extract",
      "3 cups all-purpose flour",
      "1 tsp baking soda",
      "2 tsp hot water",
      "1/2 tsp salt",
      "2 cups semisweet chocolate chips",
    ],
    instructions: [
      "Preheat your oven to 350°F (175°C).",
      "In a large bowl, cream together the butter, white sugar, and brown sugar until smooth. Beat in the eggs one at a time, then stir in the vanilla.",
      "Dissolve baking soda in hot water and add to the batter along with salt.",
      "Stir in flour, then fold in the chocolate chips.",
      "Drop by large spoonfuls onto ungreased baking sheets.",
      "Bake for about 10 minutes, or until edges are nicely browned.",
    ],
    category: "Dessert",
    image:
      "https://handletheheat.com/wp-content/uploads/2020/10/BAKERY-STYLE-CHOCOLATE-CHIP-COOKIES-9-637x637-1.jpg",
    like: true,
  },
  {
    name: "Micho PRECIOSO",
    ingredients: ["micho", "precioso", "denys", "micho"],
    instructions: ["mix", "love", "rest"],
    category: "dessert",
    image:
      "https://static.independent.co.uk/s3fs-public/thumbnails/image/2013/01/24/12/v2-cute-cat-picture.jpg?quality=75&width=990&crop=3%3A2%2Csmart&auto=webp",
    id: 4,
    like: true,
  },
  {
    name: "Michito Bebe",
    ingredients: ["sdgfasfg"],
    instructions: ["sadfsadf"],
    category: "sagfsag",
    image:
      "https://icatcare.org/app/uploads/2018/07/Thinking-of-getting-a-cat.png",
    id: 7,
    like: true,
  },
  {
    name: "Michito Bonito",
    ingredients: ["un Michho"],
    instructions: ["sdgfsg"],
    category: "sdfsdfsa",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/4/48/RedCat_8727.jpg",
    id: 8,
    like: true,
  },
  {
    name: "Micho micho bebe",
    ingredients: [
      "gfsdgfdg",
      "fdgdfsgsdf",
      "fdgsdgdfg",
      "sdfgdfgh",
      "dfgdfhds",
    ],
    instructions: [],
    category: "fsdfsdfsadf",
    image:
      "https://bestfriends.org/sites/default/files/styles/story_desktop_1920x1230_/public/story_images/FirstKittensFoster1501sak_1124x554.jpg?h=5c78e16c&itok=zZbIP7q6",
    id: 11,
  },
  {
    name: "Dan & Micho",
    ingredients: ["Un Dan", "Un Michi"],
    instructions: ["Mucho Amor"],
    category: "yummy",
    image:
      "https://cdn.shopify.com/s/files/1/0268/6861/files/animal-kitten-cat-tabby-mammal-gray-1225772-pxhere.com_grande.jpg?v=1555763712",
    id: 17,
  },
];

let quotes = [
  {
    author: "Virginia Woolf",
    quote:
      "One cannot think well, love well, sleep well, if one has not dined well.",
  },
  {
    author: "Julia Child",
    quote: "People who love to eat are always the best people.",
  },
  {
    author: "George Bernard Shaw",
    quote: "There is no sincerer love than the love of food.",
  },
  {
    author: "J.R.R. Tolkien",
    quote:
      "If more of us valued food and cheer and song above hoarded gold, it would be a merrier world.",
  },
  {
    author: "Ernestine Ulmer",
    quote: "Life is uncertain. Eat dessert first.",
  },
  {
    author: "Alan D. Wolfelt",
    quote: "Food is symbolic of love when words are inadequate.",
  },
  {
    author: "Anthelme Brillat-Savarin",
    quote: "Tell me what you eat, and I will tell you what you are.",
  },
  {
    author: "Mark Twain",
    quote:
      "The secret of success in life is to eat what you like and let the food fight it out inside.",
  },
  {
    author: "Julia Child",
    quote:
      "The only time to eat diet food is while you're waiting for the steak to cook.",
  },
  {
    author: "Harriet van Horne",
    quote:
      "Cooking is like love. It should be entered into with abandon or not at all.",
  },
];

app.get("/info", (request, response) => {
  response.send(`
    <p>Recipe DataBase has ${recipes.length} recipes and ${
    quotes.length
  } quotes</p>
    
    <p>${new Date()}</p>`);
});

//   GET ALL RECIPES
app.get("/api/recipes", (request, response) => {
  Recipe.find({}).then(recipes => {
    response.json(recipes)
  })
});

// FETCH AN INDIVIDUAL RECIPE
app.get("/api/recipes/:id", (request, response, next ) => {
  Recipe.findById(request.params.id)
    .then(recipe => {
    if (recipe) {
      response.json(recipe)

    } else {
      response.status(404).end()
    }
  })
    .catch(error => next(error))

});

// DELETE RECIPE
app.delete("/api/recipes/:id", (request, response) => {
  Recipe.findByIdAndRemove(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
});

// POST (Save a Recipe)
app.post("/api/recipes", (request, response, next) => {
  const body = request.body;

  const recipe = new Recipe({
    name: body.name,
    ingredients: body.ingredients,
    instructions: body.instructions,
    category: body.category,
    image: body.image,
    like: false,
  })

  recipe.save().then(savedRecipe => {
    response.json(savedRecipe);
  }).catch(error => next(error))
});


// Update a Recipe
app.put("/api/recipes/:id", (request, response, next) => {
  const {name, ingredients, instructions, category, image, like} = request.body

  Recipe.findByIdAndUpdate(
    request.params.id,
    { name, ingredients, instructions, category, image, like },
    { new: true, runValidation: true, context: 'query'}
  )
    .then(updatedNote => {
      response.json(updatedNote)
    })
    .catch(error => next(error))
})

//   QUOTES
app.get("/api/quotes", (request, response) => {
  response.json(quotes);
});

// handler of requests with unknown endpoint
app.use(unknownEndpoint);
// handler of requests with result to errors
app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
