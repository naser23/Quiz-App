"use strict";
// global variables
const selectNum = document.querySelector("#num-of-questions");
const selectCategory = document.querySelector("#category");
const selectDifficulty = document.querySelector("#difficulty");
const selectType = document.querySelector("#type");
const startGame = document.querySelector(".start-game");
const container = document.querySelector("#container");
const quizHeader = document.querySelector(".quiz-header");
const buildGame = document.querySelector(".build-your-game");
const options = selectNum.options;
let counter = 0;
let score = 0;

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
      beginGame(data.results);
    });
}

// for shuffling the answers before displaying them onto the screen
function shuffle(array) {
  let currentIndex = array.length,
    randomIndex;

  while (currentIndex != 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }
  return array;
}

function beginGame(questions) {
  startGame.style.display = "none";
  buildGame.style.display = "none";
  quizHeader.style.display = "none";

  displayQuestions(questions);
}

function displayQuestions(questions) {
  let questionTotal = questions.length;
  let currentQuestion = questions[counter];
  let correctAnswer = questions[counter].correct_answer;
  let incorrectAnswers = questions[counter].incorrect_answers;
  let answersArr = [];

  answersArr.push(...incorrectAnswers);
  answersArr.push(correctAnswer);
  shuffle(answersArr);

  const header = createQuestionHeader(questions[counter].question);
  const section = answerChoicesSection();
  let choice;

  for (const ans of answersArr) {
    let choice = createAnswerChoice(
      ans,
      correctAnswer,
      section,
      header,
      questions
    );
    section.appendChild(choice);
  }

  console.log(`Question  #${counter + 1}`);
  console.log(answersArr);
  console.log(`score: ${score}, counter: ${counter}`);
}

// checking answer and changing color
function answerChecker(correctAnswer, section, header, questions, choice) {
  const choiceEl = choice;
  const answer = correctAnswer;
  const answerSection = section;
  const questionEl = header;
  const data = questions;
  let position = counter + 1;

  if (choiceEl.textContent == answer && position < questions.length) {
    counter++;
    score++;
    choiceEl.style.backgroundColor = "#00FF00";
    setTimeout(function () {
      updateQuestions(questionEl, answerSection), displayQuestions(data);
    }, 1000);
  } else if (choiceEl.textContent !== answer && position < questions.length) {
    counter++;
    choiceEl.style.backgroundColor = "#ff0000";
    setTimeout(function () {
      updateQuestions(questionEl, answerSection), displayQuestions(data);
    }, 1000);
  } else {
    setTimeout(() => updateQuestions(questionEl, answerSection), 1000);
    setTimeout(function () {
      let gameOver = gameOverHeader();
      let score = scoreBox(questions.length);
    }, 1000);
  }
}

// condition for setTimeout in answerChecker
function updateQuestions(questionEl, answerSection) {
  let choices = document.querySelectorAll(".answer-choice");
  for (const x of choices) {
    answerSection.removeChild(x);
  }
  container.removeChild(questionEl);
  container.removeChild(answerSection);
}

//// COMPONENTS FOR QUIZ APP ////
function createOption(type, value, text, parentEl) {
  let option = document.createElement("option");
  option.setAttribute("name", "dropdown");
  option.setAttribute("id", type);
  option.setAttribute("value", value);
  option.textContent = text;
  parentEl.appendChild(option);
}

// components for actual quiz game
function createQuestionHeader(text) {
  let header = document.createElement("h2");
  header.classList.add("question-header");
  header.textContent = text;
  container.appendChild(header);
  return header;
}

function answerChoicesSection() {
  let section = document.createElement("section");
  section.classList.add("answer-choice-section");

  container.appendChild(section);
  return section;
}

function createAnswerChoice(ans, correctAnswer, section, header, questions) {
  let answerChoice = document.createElement("p");
  answerChoice.classList.add("answer-choice");
  answerChoice.textContent = ans;
  answerChoice.onclick = () =>
    answerChecker(correctAnswer, section, header, questions, answerChoice);
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

function scoreBox(questionTotal) {
  let scoreBox = document.createElement("p");
  scoreBox.classList.add("score-box");
  scoreBox.textContent = `Your Score ${score}/${questionTotal}`;
  container.appendChild(scoreBox);
  return scoreBox;
}
