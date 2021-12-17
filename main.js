"use strict";
// global variables
const selectNum = document.querySelector("#num-of-questions");
const selectCategory = document.querySelector("#category");
const questionAmountOptions = document.getElementsByName("dropdown");
const dropdown = document.getElementsByName("dropdown");
const startGame = document.querySelector(".start-game");
const options = selectNum.options;

// alert("please select the rules of the game (must select number of questions).");

let apiUrl =
  "https://opentdb.com/api.php?amount=10&category=24&difficulty=easy&type=boolean";

fetch(apiUrl)
  .then((response) => response.json())
  .then(function (data) {
    // console.log(data);
  });

// display the start game button if the numbe of questions dropbox is updated.
selectNum.addEventListener("change", optionSelected);
function optionSelected() {
  for (let i = 1; i < options.length; i++) {
    selectNum.textContent !== options[i].length
      ? (startGame.style.display = "block")
      : console.log("they are the same.");
  }
}

// creating and displaying all options
function displayCategoryOptions() {
  for (let i = 9; i < 33; i++) {
    let unfinishedUrl = `https://opentdb.com/api.php?amount=1&category=${i}`;
    fetch(unfinishedUrl)
      .then((response) => response.json())
      .then(function (data) {
        data.results.forEach(function (piece) {
          createOption("category", piece.category, selectCategory);
        });
      });
  }
}

function displayNumberOfQuestions() {
  for (let i = 1; i < 51; i++) {
    createOption("num-of-questions", i, selectNum);
  }
}

function displayDifficulty() {
  let Url = `https://opentdb.com/api.php?amount=1&difficulty=easy`;
  fetch(Url);
}

displayDifficulty();
displayCategoryOptions();
displayNumberOfQuestions();

// components for Quiz App
function createOption(category, data, parentEl) {
  let option = document.createElement("option");
  option.setAttribute("name", "dropdown");
  option.setAttribute("id", category);
  option.textContent = data;
  parentEl.appendChild(option);
}
