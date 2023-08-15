const quotesRouter = require("express").Router();

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

quotesRouter.get("/", (request, response) => {
  response.json(quotes);
});

module.exports = quotesRouter