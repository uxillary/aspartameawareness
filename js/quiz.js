const quizData = [
  {
    question: 'What is aspartame primarily used as?',
    options: ['Artificial sweetener', 'Natural sugar', 'Food coloring'],
    answer: 0
  },
  {
    question: 'Which code represents aspartame in food labeling?',
    options: ['E100', 'E951', 'E621'],
    answer: 1
  },
  {
    question: 'Aspartame breaks down into which alcohol in the body?',
    options: ['Ethanol', 'Methanol', 'Isopropanol'],
    answer: 1
  },
  {
    question: 'Which organization has evaluated aspartame for safety?',
    options: ['World Health Organization', 'NASA', 'UNESCO'],
    answer: 0
  }
];

let currentQuestion = 0;
let score = 0;

function showQuestion() {
  const container = document.getElementById('quiz-container');
  if (!container) return;
  container.innerHTML = '';

  if (currentQuestion >= quizData.length) {
    const result = document.getElementById('quiz-result');
    result.style.display = 'block';
    result.innerHTML = `<p>You scored ${score} out of ${quizData.length}.</p>` +
      '<p><a href="support">Support our work</a> if you found this helpful!</p>';
    return;
  }

  const q = quizData[currentQuestion];
  const h3 = document.createElement('h3');
  h3.textContent = q.question;
  container.appendChild(h3);

  q.options.forEach((opt, idx) => {
    const label = document.createElement('label');
    label.style.display = 'block';
    const input = document.createElement('input');
    input.type = 'radio';
    input.name = 'option';
    input.value = idx;
    label.appendChild(input);
    label.appendChild(document.createTextNode(' ' + opt));
    container.appendChild(label);
  });

  const button = document.createElement('button');
  button.textContent = 'Next';
  button.onclick = checkAnswer;
  container.appendChild(button);
}

function checkAnswer() {
  const options = document.getElementsByName('option');
  let selected = -1;
  options.forEach(o => { if (o.checked) selected = parseInt(o.value); });
  if (selected === quizData[currentQuestion].answer) {
    score++;
  }
  currentQuestion++;
  showQuestion();
}

document.addEventListener('DOMContentLoaded', showQuestion);
