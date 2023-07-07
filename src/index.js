import './styles.scss';

const API_URL = 'https://opentdb.com/api.php';

// Obtener referencias a los elementos HTML
const triviaForm = document.getElementById('trivia-form');
const triviaContainer = document.getElementById('trivia-container');
const scoreContainer = document.getElementById('score-container');
const categorySelect = document.getElementById('category-select');
const difficultySelect = document.getElementById('difficulty-select');
const typeSelect = document.getElementById('type-select');
const createTriviaButton = document.getElementById('create-trivia-button');

// Manejar el evento de envío del formulario
triviaForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const category = categorySelect.value;
  const difficulty = difficultySelect.value;
  const type = typeSelect.value;
  const amount = 10; // Siempre 10 preguntas

  createTrivia(category, difficulty, type, amount)
    .then((trivia) => {
      renderTrivia(trivia);
    })
    .catch((error) => {
      console.error(error);
    });
});

// Manejar el evento de clic en el botón "Crear nueva trivia"
createTriviaButton.addEventListener('click', () => {
  triviaContainer.innerHTML = '';
  scoreContainer.innerHTML = '';
});

// Crear una nueva trivia utilizando la API
async function createTrivia(category, difficulty, type, amount) {
  const url = `${API_URL}?amount=${amount}&category=${category}&difficulty=${difficulty}&type=${type}`;
  const response = await fetch(url);
  const data = await response.json();
  return data.results;
}

// Renderizar las preguntas y respuestas de la trivia
function renderTrivia(trivia) {
  let score = 0;
  trivia.forEach((question, index) => {
    const questionElement = document.createElement('div');
    questionElement.classList.add('question');
    questionElement.innerHTML = `<p class="question-text">${index + 1}. ${question.question}</p>`;
    triviaContainer.appendChild(questionElement);

    const answers = [...question.incorrect_answers, question.correct_answer];
    answers.sort(); // Ordenar aleatoriamente las respuestas

    answers.forEach((answer) => {
      const answerElement = document.createElement('div');
      answerElement.classList.add('answer');
      answerElement.innerHTML = `<label class="answer-label">
        <input type="radio" name="answer-${index}" value="${answer}">
        ${answer}
      </label>`;
      questionElement.appendChild(answerElement);
    });

    const answerInputs = questionElement.querySelectorAll(`input[name="answer-${index}"]`);
    answerInputs.forEach((input) => {
      input.addEventListener('change', () => {
        if (input.value === question.correct_answer) {
          score += 100;
        }
      });
    });
  });

  const submitButton = document.createElement('button');
  submitButton.textContent = 'Submit';
  submitButton.addEventListener('click', () => {
    showScore(score);
  });

  triviaContainer.appendChild(submitButton);
}

// Mostrar el puntaje final
function showScore(score) {
  triviaContainer.innerHTML = '';
  const scoreElement = document.createElement('p');
  scoreElement.textContent = `Final Score: ${score}`;
  scoreContainer.appendChild(scoreElement);
}

