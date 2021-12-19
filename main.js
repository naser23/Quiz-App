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
    createOption("category", item.name, item.name, selectCategory);
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

function displayTypeOptions() {
  let types = ["Multiple Choice", "True/False"];
  for (const type of types) {
    createOption("type", type, type, selectType);
  }
}
displayTypeOptions();

startGame.addEventListener("click", generateQuestions);
// gerating url based on user game settings
function generateQuestions() {
  let numberOfQuestions = selectNum.value;
  let category = selectCategory.value;
  let difficulty = selectDifficulty.value;
  let type = selectType.value;
  console.log(numberOfQuestions, category, difficulty, type);
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
