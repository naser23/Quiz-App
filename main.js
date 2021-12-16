"use strict";
// global variables
const numOfQuestions = document.querySelector("#num-of-questions");
const questionAmountOptions = document.getElementsByName("dropdown");
const dropdown = document.getElementsByName("dropdown");
const startGame = document.querySelector(".start-game");
const options = numOfQuestions.options;

console.log(options);
let apiUrl =
  "https://opentdb.com/api.php?amount=10&category=24&difficulty=easy&type=boolean";

function createUrl(amount, category, difficulty, type) {
  let unfinishedUrl = "https://opentdb.com/api.php?";
}

fetch(apiUrl)
  .then((response) => response.json())
  .then(function (data) {
    console.log(data);
  });

numOfQuestions.addEventListener("change", optionSelected);

function optionSelected() {
  for (let i = 1; i < options.length; i++) {
    numOfQuestions.textContent !== options[i].length
      ? (startGame.style.display = "block")
      : console.log("they are the same.");
  }
}
