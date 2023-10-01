// DOM elements selection
let conutSpan = document.querySelector(".quiz-info .count span");
let dotsContainer = document.querySelector(".tracker .dots");
let quizContainer = document.querySelector(".quiz .question-area");
let submitBtn = document.querySelector(".submit-btn");
let resultContainer = document.querySelector(".result");
let quizArea = document.querySelector(".quiz");
let countdownDiv = document.querySelector(".countdown");

let currentindex = 0;
let correctAnswers = 0;
let countdownInterval;

function getQuestionsFromJson() {
  let request = new XMLHttpRequest();

  request.onreadystatechange = function () {
    if (this.readyState === 4 && this.status === 200) {
      let questionsOpject = JSON.parse(this.responseText);
      let questionsCount = questionsOpject.length;
      CreateDots(questionsCount);
      showQuestion(questionsOpject[currentindex], questionsCount);

      countdown(90, questionsCount);

      submitBtn.addEventListener("click", () => {
        let rightAnswser = questionsOpject[currentindex].answers.correct_answer;
        checkAnswer(rightAnswser, questionsCount);

        // load next question
        currentindex++;
        quizContainer.innerHTML = "";
        showQuestion(questionsOpject[currentindex], questionsCount);
        handleDots();
        if (currentindex == questionsCount - 1) {
          submitBtn.innerHTML = "Finish";
        }
        // conutdown
        clearInterval(countdownInterval);
        countdown(90, questionsCount);

        showResult(questionsCount);
      });
    }
  };

  request.open("get", "questions.json", true);
  request.send();
}
getQuestionsFromJson();

// create dots = to the number of questions
function CreateDots(qNumber) {
  conutSpan.innerHTML = qNumber;
  for (let i = 0; i < qNumber; i++) {
    let dot = document.createElement("span");
    if (i == 0) {
      dot.classList.add("done");
    }
    dotsContainer.appendChild(dot);
  }
}

function showQuestion(qOpject, count) {
  if (currentindex < count) {
    // add question
    let questionTitle = document.createElement("h2");
    questionTitle.appendChild(document.createTextNode(qOpject.question));
    quizContainer.appendChild(questionTitle);

    // add answers
    let answersDiv = document.createElement("div");
    answersDiv.className = "answers";
    for (let i = 1; i <= 4; i++) {
      const answer = document.createElement("div");
      answer.className = "answer";
      // create radio input
      let radioInput = document.createElement("input");
      radioInput.type = "radio";
      radioInput.name = "question";
      radioInput.id = `answer_${i}`;
      radioInput.dataset.answer = qOpject.answers[`answer_${i}`];
      // create label
      let label = document.createElement("label");
      label.htmlFor = `answer_${i}`;
      label.appendChild(
        document.createTextNode(qOpject.answers[`answer_${i}`])
      );

      answer.appendChild(radioInput);
      answer.appendChild(label);
      answersDiv.appendChild(answer);
    }
    quizContainer.appendChild(answersDiv);
  }
}

function checkAnswer(rightAnswser, count) {
  let answers = document.getElementsByName("question");
  let choosenAnswer;
  for (let i = 0; i < answers.length; i++) {
    if (answers[i].checked) {
      choosenAnswer = answers[i].dataset.answer;
    }
  }
  if (choosenAnswer === rightAnswser) {
    correctAnswers++;
  }
}

function handleDots() {
  let dots = document.querySelectorAll(".tracker .dots span");
  dots.forEach((dot, index) => {
    if (currentindex === index) {
      dot.className = "done";
    }
  });
}

function showResult(count) {
  if (currentindex === count) {
    let result;
    quizArea.remove();
    resultContainer.style.display = "block";
    if (correctAnswers === count) {
      result = `        <span class="perfect">Perfect</span>
      <p>You scored ${correctAnswers}  / ${count}</p>
      <img src="icons/excellent.png" alt="icon" />`;
    } else if (correctAnswers > count / 2 && correctAnswers != count) {
      result = `<span class="good">Well done</span>
      <p>You scored ${correctAnswers}  / ${count}</p>
      <img src="icons/thumb-up.png" alt="icon" />`;
    } else {
      result = `<span class="bad">Next time will be better</span>
      <p>You scored ${correctAnswers}  / ${count}</p>
      <img src="icons/okay.png" alt="icon" />`;
    }

    resultContainer.innerHTML = result;
  }
}

function countdown(duration, count) {
  if (currentindex < count) {
    let min, sec;
    countdownInterval = setInterval(() => {
      min = parseInt(duration / 60);
      sec = parseInt(duration % 60);

      min = min < 10 ? `0${min}` : min;
      sec = sec < 10 ? `0${sec}` : sec;

      countdownDiv.innerHTML = `${min}:${sec}`;
      if (--duration < 0) {
        clearInterval(countdownInterval);
        submitBtn.click();
      }
    }, 1000);
  }
}
