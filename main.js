"use strict";

let questionAmountOptions = document.getElementsByClassName("num-of-questions");
console.log(questionAmountOptions);

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
