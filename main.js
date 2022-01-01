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

// generates the url that will be fetched when the game begins but with base64 encoding
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

  let encodedUrl = Url + "encode=base64";

  return generateQuestions(encodedUrl);
}

function generateQuestions(url) {
  let gameUrl = url;
  fetch(gameUrl)
    .then((resp) => resp.json())
    .then(function (data) {
      beginGame(data.results);
    });
}

// for decoding the url from base64 to utf8
function stringDecoder(str) {
  const utf8 = atob(str);
  return utf8;
}

function replaceWeirdStrings(str) {
  const regex = /Ã/g;
  const newStr = str.replace(regex, "Ü");
  return newStr;
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

// getting rid of the weird characters in the questions (for decoding the url from base64 to utf8)
function stringDecoder(str) {
  const utf8 = atob(str);
  return utf8;
}

function beginGame(questions) {
  startGame.style.display = "none";
  buildGame.style.display = "none";
  quizHeader.style.display = "none";

  displayQuestions(questions);
}

function displayQuestions(questions) {
  const questionTotal = questions.length;
  const currentQuestion = questions[counter];
  const correctAnswer = questions[counter].correct_answer;
  const fixedCorrectAnswer = replaceWeirdStrings(stringDecoder(correctAnswer));
  const incorrectAnswers = questions[counter].incorrect_answers;
  const rawQuestion = questions[counter].question;
  const fixedQuestion = replaceWeirdStrings(stringDecoder(rawQuestion));
  const answersArr = [];
  answersArr.push(...incorrectAnswers);
  answersArr.push(correctAnswer);
  shuffle(answersArr);

  const header = createQuestionHeader(fixedQuestion);
  const section = answerChoicesSection();
  let choice;

  for (const ans of answersArr) {
    let fixedAnswers = replaceWeirdStrings(stringDecoder(ans));
    let choice = createAnswerChoice(
      fixedAnswers,
      fixedCorrectAnswer,
      section,
      header,
      questions
    );

    section.appendChild(choice);
  }
  console.log(`Question  #${counter + 1}`);
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
  let moreQuestionsLeft = position < questions.length;

  if (choiceEl.textContent == answer) {
    disableButton();
    counter++;
    score++;
    choiceEl.style.backgroundColor = "#00FF00";
    setTimeout(() => updateQuestions(questionEl, answerSection, data), 1000);
  } else if (choiceEl.textContent !== answer) {
    disableButton();
    counter++;
    choiceEl.style.backgroundColor = "#ff0000";
    setTimeout(() => updateQuestions(questionEl, answerSection, data), 1000);
  }
}

// condition for setTimeout in answerChecker
function updateQuestions(questionEl, answerSection, data) {
  let choices = document.querySelectorAll(".answer-choice");
  let position = counter + 1;
  for (const x of choices) {
    answerSection.removeChild(x);
  }
  container.removeChild(questionEl);
  container.removeChild(answerSection);

  if (counter < data.length) {
    displayQuestions(data);
  } else {
    const gameOver = gameOverHeader();
    const score = scoreBox(data.length);
    const postGame = postGameOptions(data);
  }

  console.log(position, data.length);
}

// disables onclick function after one click
function disableButton() {
  const htmlAnswerChoices = document.querySelectorAll(".answer-choice");
  for (const choice of htmlAnswerChoices) {
    choice.onclick = null;
  }
}

function runSameQuestions(data) {
  const shuffleData = shuffle(data);
  console.log(shuffleData);
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

function createPlayAgain(data) {
  const playAgain = document.createElement("p");
  playAgain.classList.add("play-again");
  playAgain.textContent = "Play Again!";
  playAgain.onclick = () => runSameQuestions(data);
  return playAgain;
}

function createNewGame() {
  const newGame = document.createElement("p");
  newGame.classList.add("new-game");
  newGame.textContent = "Build New Game!";
  return newGame;
}

function postGameOptions(data) {
  const section = document.createElement("section");
  section.classList.add("post-game-options");

  const newGame = createNewGame();
  const playAgain = createPlayAgain(data);

  section.appendChild(newGame);
  section.appendChild(playAgain);
  container.appendChild(section);
  console.log(section);
  return section;
}
