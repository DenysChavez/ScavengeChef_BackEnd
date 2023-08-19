const Recipe = require("../models/recipe");
const User = require("../models/user")

const initialRecipes = [
  {
    name: "Refreshing Fruit Salad",
    ingredients: [
      "1 cup strawberries, hulled and sliced",
      "1 cup blueberries",
      "1 cup pineapple chunks",
      "2 kiwis, peeled and sliced",
      "1 cup watermelon chunks",
      "1/2 cup freshly squeezed orange juice",
      "2 tbsp honey (optional)",
      "Mint leaves for garnish",
    ],
    instructions: [
      "In a large mixing bowl, combine strawberries, blueberries, pineapple chunks, kiwi slices, and watermelon.",
      "In a small bowl, whisk together the freshly squeezed orange juice and honey until well combined.",
      "Pour the orange juice and honey mixture over the fruits and gently toss to combine.",
      "Refrigerate the fruit salad for at least an hour before serving. This allows the flavors to meld together.",
      "Serve chilled and garnished with fresh mint leaves.",
    ],
    category: "Dessert",
    image:
      "https://hips.hearstapps.com/hmg-prod/images/pasta-salad-horizontal-jpg-1522265695.jpg?crop=1xw:0.8435812837432514xh;center,top&resize=1200:*",
    like: false,
  },
  {
    name: "Pozole de Pollo",
    ingredients: [
      "2 cups dried hominy corn",
      "1 kg pork shoulder, cubed",
      "1 onion, chopped",
      "4 cloves garlic, minced",
      "2 teaspoons dried oregano",
      "2 teaspoons ground cumin",
      "2 teaspoons chili powder",
      "1 teaspoon ground coriander",
      "1 bay leaf",
      "Salt to taste",
      "6 cups water or chicken broth",
      "Toppings: chopped lettuce, radishes, onion, dried oregano, lime wedges, tortilla chips",
    ],
    instructions: [
      "Rinse the dried hominy corn thoroughly and soak it in water overnight.",
      "Drain before using.",
      "In a large pot, combine the soaked hominy corn, cubed pork shoulder, chopped onion, minced garlic, dried oregano, ground cumin, chili powder, ground coriander, bay leaf, and salt.",
      "Add water or chicken broth to the pot and bring to a boil. Reduce the heat to a simmer, cover, and let it cook for about 2 to 3 hours or until the hominy corn is tender and the pork is fully cooked.",
      "Skim off any foam or impurities that rise to the surface during cooking.",
      "Once everything is cooked and the flavors have melded together, remove the bay leaf and adjust the seasoning if needed.",
      "Serve the Pozole hot in bowls, garnished with chopped lettuce, sliced radishes, chopped onion, dried oregano, a squeeze of lime juice, and tortilla chips on the side.",
      "Enjoy your delicious Pozole!",
    ],
    category: "Main Dish",
    image:
      "https://img.sndimg.com/food/image/upload/f_auto,c_thumb,q_55,w_860,ar_3:2/v1/img/recipes/19/62/33/sobU9LjR3qh8ul37iAvw_pork-pozole-7704.jpg",
    like: false,
  },
];

const nonExistingId = async () => {
  const recipe = new Recipe({
    name: "Micho Bonito Preciosito",
    ingredients: ["Un Micho", "Un Dan"],
    instructions: ["Mix them", "So much Love"],
    category: "family",
    image: "lalala.jpg",
    like: false,
  });
  await recipe.save();
  await recipe.deleteOne();

  return recipe.id.toString();
};

const recipeInDb = async () => {
  const recipes = await Recipe.find({});
  return recipes.map((note) => note.toJSON());
};

const usersInDb = async () => {
  const users = await User.find({})
  return users.map(u => u.toJSON())
}

module.exports = {
  initialRecipes,
  nonExistingId,
  recipeInDb,
  usersInDb
};
