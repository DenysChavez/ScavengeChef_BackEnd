const mongoose = require("mongoose");
const supertest = require("supertest");
const helper = require("./test_helper");
const app = require("../app");
const api = supertest(app);
const bcrypt = require("bcrypt");

const User = require("../models/user");
const Recipe = require("../models/recipe");

// The database is cleared out at the beginning, and after that, we save the two recipes stored in the initialRecipes array to the database. By doing this, we ensure that the database is in the same state before every test is run.
beforeEach(async () => {
  await Recipe.deleteMany({});
  await Recipe.insertMany(helper.initialRecipes);
});

describe("when there is initially some recipes saved", () => {
  test("are returned as json", async () => {
    await api
      .get("/api/recipes")
      .expect(200)
      .expect("Content-Type", /application\/json/);
  }, 100000);

  test("all recipes are returned", async () => {
    const response = await api.get("/api/recipes");

    expect(response.body).toHaveLength(helper.initialRecipes.length);
  });

  test("a specific recipe is within the returned recipes", async () => {
    const response = await api.get("/api/recipes");

    const names = response.body.map((r) => r.name);
    expect(names).toContain("Pozole de Pollo");
  });
});

describe("viewing a specific recipe", () => {
  test("succed with a valid id", async () => {
    const recipeAtStart = await helper.recipeInDb();

    const recipeToView = recipeAtStart[0];

    const resultRecipe = await api
      .get(`/api/recipes/${recipeToView.id}`)
      .expect(200)
      .expect("Content-Type", /application\/json/);

    expect(resultRecipe.body).toEqual(recipeToView);
  });

  test("fails with statuescode 404 if recipe does not exist", async () => {
    const validNonexistingId = await helper.nonExistingId();

    await api.get(`/api/recipes/${validNonexistingId}`).expect(404);
  });

  test("fails with statuescode 400 if id is invalid", async () => {
    const invalid = "5a3d5da59070081a82a3445";

    await api.get(`/api/recipes/${invalid}`).expect(404);
  });
});

describe("addition of a new note", () => {
  test("succeds with valid data", async () => {
    const newRecipe = {
      name: "Vegetable Quinoa Stir-Fry",
      ingredients: [
        "1 cup quinoa",
        "2 cups vegetable broth",
        "2 tbsp olive oil",
        "1 onion, finely chopped",
        "2 cloves garlic, minced",
        "1 bell pepper, diced",
        "1 zucchini, diced",
        "1 carrot, julienned",
        "1/2 cup snap peas or green beans, chopped",
        "2 tbsp soy sauce",
        "1 tbsp sesame oil",
        "1 tsp ginger, grated",
        "2 green onions, sliced",
        "Sesame seeds for garnish",
      ],
      instructions: [
        "Rinse quinoa under cold water until the water runs clear. This helps to remove its natural coating that can make it taste bitter.",
        "In a saucepan, bring the vegetable broth to a boil. Add the quinoa, reduce the heat to low, cover, and cook for 15 minutes, or until the quinoa is tender and the liquid has been absorbed. Remove from heat and let it stand for 5 minutes, then fluff with a fork.",
        "While the quinoa is cooking, heat olive oil in a large skillet or wok over medium-high heat. Add the onions and garlic and sauté until translucent.",
        "Add the bell pepper, zucchini, carrot, and snap peas or green beans to the skillet. Stir-fry for about 5-7 minutes, or until the vegetables are tender but still crisp.",
        "In a small bowl, combine the soy sauce, sesame oil, and grated ginger. Mix well.",
        "Add the cooked quinoa to the skillet with the vegetables. Pour the soy sauce mixture over the top and stir-fry for another 2-3 minutes, ensuring everything is well combined and heated through.",
        "Serve the stir-fry in bowls, garnished with sliced green onions and a sprinkle of sesame seeds.",
      ],
      category: "Main Course",
      image:
        "https://handletheheat.com/wp-content/uploads/2010/03/quinoa-stir-fry.jpg",
      like: false,
    };

    await api
      .post("/api/recipes")
      .send(newRecipe)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const recipesAtEnd = await helper.recipeInDb();
    expect(recipesAtEnd).toHaveLength(helper.initialRecipes.length + 1);

    const names = recipesAtEnd.map((r) => r.name);
    expect(names).toContain("Vegetable Quinoa Stir-Fry");
  });

  test("fails with status code 400 if data invalid", async () => {
    const newRecipe = {
      name: "Vegetable Quinoa Stir-Fry",
      instructions: [
        "Rinse quinoa under cold water until the water runs clear. This helps to remove its natural coating that can make it taste bitter.",
        "In a saucepan, bring the vegetable broth to a boil. Add the quinoa, reduce the heat to low, cover, and cook for 15 minutes, or until the quinoa is tender and the liquid has been absorbed. Remove from heat and let it stand for 5 minutes, then fluff with a fork.",
        "While the quinoa is cooking, heat olive oil in a large skillet or wok over medium-high heat. Add the onions and garlic and sauté until translucent.",
        "Add the bell pepper, zucchini, carrot, and snap peas or green beans to the skillet. Stir-fry for about 5-7 minutes, or until the vegetables are tender but still crisp.",
        "In a small bowl, combine the soy sauce, sesame oil, and grated ginger. Mix well.",
        "Add the cooked quinoa to the skillet with the vegetables. Pour the soy sauce mixture over the top and stir-fry for another 2-3 minutes, ensuring everything is well combined and heated through.",
        "Serve the stir-fry in bowls, garnished with sliced green onions and a sprinkle of sesame seeds.",
      ],
      category: "Main Course",
      image:
        "https://handletheheat.com/wp-content/uploads/2010/03/quinoa-stir-fry.jpg",
      like: false,
    };

    await api.post("/api/recipes").send(newRecipe).expect(400);

    const recipesAtEnd = await helper.recipeInDb();
    expect(recipesAtEnd).toHaveLength(helper.initialRecipes.length);
  });
});

describe("deletion of a note", () => {
  test("suceeds with status code 204 if id is valid", async () => {
    const recipeAtStart = await helper.recipeInDb();

    const recipeToView = recipeAtStart[0];

    const resultRecipe = await api
      .get(`/api/recipes/${recipeToView.id}`)
      .expect(200)
      .expect("Content-Type", /application\/json/);

    expect(resultRecipe.body).toEqual(recipeToView);
  });

  test("a recipe can be deleted", async () => {
    const recipeAtStart = await helper.recipeInDb();

    const recipeToDelete = recipeAtStart[0];

    await api.delete(`/api/recipes/${recipeToDelete.id}`).expect(204);

    const recipeAtEnd = await helper.recipeInDb();
    expect(recipeAtEnd).toHaveLength(helper.initialRecipes.length - 1);

    const names = recipeAtEnd.map((r) => r.name);
    expect(names).not.toContain(recipeToDelete.name);
  });
});

describe('when there is initially one user in db', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({ username: 'root', passwordHash })

    await user.save()
  })

  test('creation succeeds with a fresh username', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'mluukkai',
      name: 'Matti Luukkainen',
      password: 'salainen',
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)

    const usernames = usersAtEnd.map(u => u.username)
    expect(usernames).toContain(newUser.username)
  })

  test('creation fails with proper statuscode and message if username already taken', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'root',
      name: 'Superuser',
      password: 'salainen',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain('expected `username` to be unique')

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toEqual(usersAtStart)
  })

})

afterAll(async () => {
  await mongoose.connection.close();
});
