"use strict";
// global variables
const selectNum = document.querySelector("#num-of-questions");
const selectCategory = document.querySelector("#category");
const selectDifficulty = document.querySelector("#difficulty");
const selectType = document.querySelector("#type");
const startGame = document.querySelector(".start-game");
const options = selectNum.options;

// display the start game button if the number of questions dropbox is updated.
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
  // if the player chooses a category and a difficulty
  if (selectCategory.value !== "" && selectDifficulty.value !== "") {
    cateAndDiffQuestionCount();

    // if the player chooses a category but not a difficulty
  } else if (selectCategory.value !== "" && selectDifficulty.value === "") {
    cateQuestionCount();

    // if the player only chooses the question amount
  } else generateUrl(selectNum.value);
});

// gerating url based on user game settings
function cateAndDiffQuestionCount() {
  let numberOfQuestions;
  let difficulty = selectDifficulty.value;

  // comparing the amount of questions the user asked for to the actual amount of questions available in the database. will return the amount asked for if said amount is available.

  fetch(`https://opentdb.com/api_count.php?category=${selectCategory.value}`)
    .then((response) => response.json())
    .then(function (data) {
      console.log(data);

      let questionCount = eval(
        `data.category_question_count.total_${difficulty.toLowerCase()}_question_count`
      );

      if (selectNum.value > questionCount) {
        numberOfQuestions = questionCount;
      } else if (selectNum.value < questionCount) {
        numberOfQuestions = selectNum.value;
      } else if (selectNum == "") {
        numberOfQuestions = 10;
      }
      return generateUrl(numberOfQuestions);
    });
}

function cateQuestionCount() {
  let numberOfQuestions;

  // comparing the amount of questions the user asked for to the actual amount of questions available in the database. will return the amount asked for if said amount is available.
  fetch(`https://opentdb.com/api_count.php?category=${selectCategory.value}`)
    .then((resp) => resp.json())
    .then(function (data) {
      console.log(data);
      let questionCount = data.category_question_count.total_question_count;

      if (selectNum.value > questionCount) {
        numberOfQuestions = questionCount;
      } else if (selectNum.value < questionCount) {
        numberOfQuestions = selectNum.value;
      } else if (selectNum == "") {
        numberOfQuestions = 10;
      }

      return generateUrl(numberOfQuestions);
    });
}

function generateUrl(questions) {
  let questionCount = questions;
  let category = selectCategory.value;
  let difficulty = selectDifficulty.value;
  let amountString = `amount=${questionCount}`;
  let categoryString = `category=${category}`;
  let difficultyString = `difficulty=${difficulty}`;
  let partialUrl = "https://opentdb.com/api.php?";

  let valueArr = [questionCount, category, difficulty];
  let stringArr = [amountString, categoryString, difficultyString];

  // for (const x of valueArr) {
  //   let index = valueArr.indexOf(x);
  //   if (x[index] !== "") {
  //     console.log(x);
  //   } else {
  //     console.log("no value");
  //   }
  // }

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
