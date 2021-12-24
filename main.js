"use strict";
// global variables
const selectNum = document.querySelector("#num-of-questions");
const selectCategory = document.querySelector("#category");
const selectDifficulty = document.querySelector("#difficulty");
const selectType = document.querySelector("#type");
const startGame = document.querySelector(".start-game");
const container = document.querySelector("#container");
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

// creating and displaying all options //

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

// starting the game depending on player input
startGame.addEventListener("click", () => {
  searchSpecificCriteria();
});

function searchSpecificCriteria() {
  // if the player chooses a category and a difficulty
  if (selectCategory.value !== "" && selectDifficulty.value !== "") {
    cateAndDiffQuestionCount();

    // if the player chooses a category but not a difficulty
  } else if (selectCategory.value !== "" && selectDifficulty.value == "") {
    cateQuestionCount();

    // if the player only chooses the question amount and/or difficulty
  } else generateUrl(selectNum.value);
}

// gerating url based on user game settings
function cateAndDiffQuestionCount() {
  let numberOfQuestions;
  let difficulty = selectDifficulty.value;

  // comparing the amount of questions the user asked for to the actual amount of questions available in the database. will return the amount asked for if said amount is available.

  fetch(`https://opentdb.com/api_count.php?category=${selectCategory.value}`)
    .then((response) => response.json())
    .then(function (data) {
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
  let difficultyString = `difficulty=${difficulty.toLowerCase()}`;
  let Url = "https://opentdb.com/api.php?";

  let valueArr = [questionCount, category, difficulty];
  let stringArr = [amountString, categoryString, difficultyString];

  for (const x of valueArr) {
    let index = valueArr.indexOf(x);
    if (x !== "") {
      Url += stringArr[index] + "&";
    } else if (x == "") {
      Url;
    }
  }
  return generateQuestions(Url);
}

function generateQuestions(url) {
  let gameUrl = url;
  fetch(gameUrl)
    .then((resp) => resp.json())
    .then(function (data) {
      data.results.forEach(function (question) {
        new Question(question);
      });
    });
}

// constructor fuction that will be used for creating questions
function Question(question) {
  {
    this.category = question.category;
    this.correctAnswer = question.correct_answer;
    this.difficulty = question.difficulty;
    this.incorrectAnswers = question.incorrect_answers;
    this.question = question.question;
    this.type = question.type;
  }
  console.log(this.question);
}

// components for Quiz App //
function createOption(type, value, text, parentEl) {
  let option = document.createElement("option");
  option.setAttribute("name", "dropdown");
  option.setAttribute("id", type);
  option.setAttribute("value", value);
  option.textContent = text;
  parentEl.appendChild(option);
}

// components for actual quiz game
function createQuestionHeader() {
  let header = document.createElement("h2");
  header.classList.add("question-header");
  header.textContent =
    "What is the answer to this question that I'm asking you?";
  container.appendChild(header);
  console.log(header);
  return header;
}
// createQuestionHeader();

function answerChoicesSection() {
  let section = document.createElement("section");
  section.classList.add("answer-choice-section");

  let answer1 = createAnswerChoice();
  let answer2 = createAnswerChoice();
  let answer3 = createAnswerChoice();
  let answer4 = createAnswerChoice();

  section.appendChild(answer1);
  section.appendChild(answer2);
  section.appendChild(answer3);
  section.appendChild(answer4);

  container.appendChild(section);
  console.log(section);
  return section;
}
// answerChoicesSection();

function createAnswerChoice() {
  let answerChoice = document.createElement("p");
  answerChoice.classList.add("answer-choice");
  answerChoice.textContent = "this is an answer choice to the question";
  return answerChoice;
}

// Game Over Screen //
function gameOverHeader() {
  let header = document.createElement("h2");
  header.classList.add("game-over-header");
  header.textContent = "Game Over";
  container.appendChild(header);
  return header;
}
gameOverHeader();

function scoreBox() {
  let scoreBox = document.createElement("p");
  scoreBox.classList.add("score-box");
  scoreBox.textContent = "Your Score: 0/10";
  container.appendChild(scoreBox);
  return scoreBox;
}
scoreBox();
