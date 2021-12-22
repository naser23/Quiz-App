"use strict";
// global variables
const selectNum = document.querySelector("#num-of-questions");
const selectCategory = document.querySelector("#category");
const selectDifficulty = document.querySelector("#difficulty");
const selectType = document.querySelector("#type");
const startGame = document.querySelector(".start-game");
const options = selectNum.options;

// alert("please select the rules of the game (must select number of questions).");

// display the start game button if the numbe of questions dropbox is updated.
selectNum.addEventListener("change", optionSelected);
function optionSelected() {
  for (let i = 1; i < options.length; i++) {
    selectNum.textContent !== options[i].length
      ? (startGame.style.display = "block")
      : console.log("they are the same.");
  }
}
// fetch list of categories
let categoryUrl = "https://opentdb.com/api_category.php";
fetch(categoryUrl)
  .then((response) => response.json())
  .then(function (data) {
    let categoryList = data.trivia_categories;
    displayCategoryOptions(categoryList);
  });

// creating and displaying all options
// displaying category options
function displayCategoryOptions(categories) {
  for (const item of categories) {
    createOption("category", item.id, item.name, selectCategory);
  }
}

// displaying number options
function displayNumberOfQuestions() {
  for (let i = 1; i < 51; i++) {
    createOption("num-of-questions", i, i, selectNum);
  }
}
displayNumberOfQuestions();

// displaying difficulty options
function displayDifficulty() {
  let difficultyTypes = ["Easy", "Medium", "Hard"];

  for (const type of difficultyTypes) {
    createOption("difficulty", type, type, selectDifficulty);
  }
}
displayDifficulty();

startGame.addEventListener("click", () => {
  generateQuestionCount();
});
// gerating url based on user game settings
function generateQuestionCount() {
  let numberOfQuestions;
  let category = selectCategory.value;
  let difficulty = selectDifficulty.value;

  // comparing the amount of questions the user asked for to the actual amount of questions available in the database. will return the amount asked for if said amount is available.
  fetch(`https://opentdb.com/api_count.php?category=${category}`)
    .then((response) => response.json())
    .then(function (data) {
      console.log(data);

      let questionCount = eval(
        `data.category_question_count.total_${difficulty.toLowerCase()}_question_count`
      );

      selectNum.value > questionCount
        ? (numberOfQuestions = questionCount)
        : (numberOfQuestions = selectNum.value);
      return generateUrl(numberOfQuestions);
    });
}

function generateUrl(questions) {
  let questionCount = questions;
  let category = selectCategory.value;
  let difficulty = selectDifficulty.value;
  let completeUrl;
  console.log(questionCount, category, difficulty);
}

// components for Quiz App
function createOption(type, value, text, parentEl) {
  let option = document.createElement("option");
  option.setAttribute("name", "dropdown");
  option.setAttribute("id", type);
  option.setAttribute("value", value);
  option.textContent = text;
  parentEl.appendChild(option);
}

// fetching the type of questions from any category

// fetch(
//   "https://opentdb.com/api.php?&amount=all&category=24&difficulty=hard&type=boolean"
// )
//   .then((response) => response.json())
//   .then(function (data) {
//     console.log(data);
//   });
