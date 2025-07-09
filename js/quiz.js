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
  },
  {
    question: 'Which of these products often contain aspartame?',
    options: ['Diet sodas', 'Fresh fruit', 'Whole milk'],
    answer: 0
  },
  {
    question: 'What year did the FDA first approve aspartame?',
    options: ['1981', '1995', '2005'],
    answer: 0
  },
  {
    question: 'Aspartame is made from which amino acids?',
    options: [
      'Phenylalanine and aspartic acid',
      'Glutamine and glycine',
      'Lysine and valine'
    ],
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
    const percent = Math.round((score / quizData.length) * 100);
    result.innerHTML =
      `<p>You scored ${score} out of ${quizData.length} (${percent}%).</p>` +
      '<p><a href="support">Support our work</a> if you found this helpful!</p>' +
      '<button id="restart-quiz">Restart Quiz</button>';
    const restart = document.getElementById('restart-quiz');
    if (restart) restart.onclick = restartQuiz;
    return;
  }

  const progress = document.createElement('p');
  progress.className = 'quiz-progress';
  progress.textContent = `Question ${currentQuestion + 1} of ${quizData.length}`;
  container.appendChild(progress);

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

function restartQuiz() {
  currentQuestion = 0;
  score = 0;
  const result = document.getElementById('quiz-result');
  if (result) result.style.display = 'none';
  showQuestion();
}

document.addEventListener('DOMContentLoaded', showQuestion);
