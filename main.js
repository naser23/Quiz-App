"use strict";

let apiUrl =
  "https://opentdb.com/api.php?amount=10&category=24&difficulty=easy&type=boolean";

fetch(apiUrl)
  .then((response) => response.json())
  .then(function (data) {
    console.log(data);
  });
