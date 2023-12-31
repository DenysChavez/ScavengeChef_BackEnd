const mongoose = require("mongoose");

const recipeSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 5,
    required: true
  },
  ingredients: {
    type: [String],
    validate: function (array) {
      return array.length >= 2
    }
  },
  instructions: {
    type: [String],
    validate: function (array) {
      return array.length >= 2
    }
  },
  category: String,
  image: String,
  like: Boolean,
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
});

recipeSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model("Recipe", recipeSchema);
