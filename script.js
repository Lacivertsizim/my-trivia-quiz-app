let numberOfQuestionElm = document.querySelector("#number-of-question");
let categoryElm = document.querySelector("#category");
let difficultyElm = document.querySelector("#difficulty");
let startBtn = document.querySelector("#start");
let loadingWrapper = document.querySelector("#loading-wrapper");
let quizWrapper = document.querySelector("#quiz-wrapper");
let selection = document.querySelector("#selection");

let questions = [];
let numberOfQuestion = 10;
let numberOfCurrentQuestion = 0;
let selections = { correct: 0, wrong: 0 };

startBtn.onclick = () => {
  loadingWrapper.style.display = "block";
  selection.style.display = "none";
  numberOfQuestion = numberOfQuestionElm.value;
  let category = categoryElm.value;
  let difficulty = difficultyElm.value;
  fetchQuestions(numberOfQuestion, category, difficulty);
};

const fetchQuestions = async (numberOfQuestion, category, difficulty) => {
  let response = await fetch(
    "https://opentdb.com/api.php?amount=" +
      numberOfQuestion +
      "&category=" +
      category +
      "&difficulty=" +
      difficulty +
      "&type=multiple"
  );
  response = await response.json();
  questions = response.results;
  showQuestions();
};

const showQuestions = () => {
  if (selections.correct + selections.wrong == numberOfQuestion) {
    quizWrapper.innerHTML =
      "<div id='end'> Correct:" +
      selections.correct +
      "<br> Wrong:" +
      selections.wrong +
      "<br>" +
      '<button id="again">Play Again </button>' +
      "</div>";
    document.getElementById("again").onclick = () => {
      location.reload();
    };
  } else {
    loadingWrapper.style.display = "none";
    let question = questions[numberOfCurrentQuestion];
    let correctAnswerIndex = generateRandomNumber(0, 3);
    let answers = [...question.incorrect_answers];
    answers.splice(correctAnswerIndex, 0, question.correct_answer);
    let newQuestionElm = "<div id='new-question'>";
    newQuestionElm += "<h2>" + question.question + "</h2>";
    answers.forEach((element) => {
      newQuestionElm += '<p class="option">' + element + "</p>";
    });
    newQuestionElm +=
      '<p> Correct: <span id="correct">' + selections.correct + "</span></p>";
    newQuestionElm +=
      '<p> Wrong: <span id="wrong">' + selections.wrong + "</span></p>";
    newQuestionElm += "</div>";
    quizWrapper.innerHTML = newQuestionElm;
    addClickEvent();
  }
};

function generateRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

const addClickEvent = () => {
  let options = document.getElementsByClassName("option");
  console.log(options);
  for (let index = 0; index < options.length; index++) {
    const element = options[index];
    let question = questions[numberOfCurrentQuestion];
    element.addEventListener("click", function () {
      if (element.innerHTML === question.correct_answer) {
        selections.correct = selections.correct + 1;
        correctSelection();
      } else {
        selections.wrong = selections.wrong + 1;
        wrongSelection();
      }
      quizWrapper.innerHTML += '<button id="next"> Next Question </button>';
      document.getElementById("next").onclick = () => {
        numberOfCurrentQuestion++;
        showQuestions();
      };
    });
  }
};

const correctSelection = () => {
  quizWrapper.innerHTML += "<p>Bravo</p>";
  document.getElementById("correct").innerHTML = selections.correct;
};
const wrongSelection = () => {
  quizWrapper.innerHTML += "<p>Try Again</p>";
  document.getElementById("wrong").innerHTML = selections.wrong;
};
