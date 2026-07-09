/* ==========================================================================
   1. DEKLARASI VARIABEL UTAMA
   ========================================================================== */
let shuffledQuestions = []; 
let currentQuestionIndex = 0;
let score = 0;
let timer;
let timeLeft = 15;
let playerName = "";
let wrongAnswersHistory = [];

const startScreen = document.getElementById("start-screen");
const quizScreen = document.getElementById("quiz-screen");
const resultScreen = document.getElementById("result-screen");

const startBtn = document.getElementById("start-btn");
const restartBtn = document.getElementById("restart-btn");

const usernameInput = document.getElementById("username");
const questionNumberText = document.getElementById("question-number");
const questionText = document.getElementById("question-text");
const answerOptionsContainer = document.getElementById("answer-options");
const timerDisplay = document.getElementById("timer");
const finalScoreDisplay = document.getElementById("final-score");
const playerGreeting = document.getElementById("player-greeting");
const reviewList = document.getElementById("review-list");

/* ==========================================================================
   2. ALGORITMA PENGACAK UTAMA (Fisher-Yates)
   ========================================================================== */
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

/* ==========================================================================
   3. FUNGSI INTI JALANNYA KUIS
   ========================================================================== */
function startQuiz() {
    playerName = usernameInput.value.trim();
    if (playerName === "") {
        alert("Silakan masukkan nama kamu terlebih dahulu!");
        return;
    }

    localStorage.setItem("latestPlayer", playerName);

    startScreen.classList.add("hide");
    quizScreen.classList.remove("hide");

    // ALGORITMA SUPER: Acak seluruh 105 soal, lalu potong (.slice) ambil 10 soal acak teratas saja!
    shuffledQuestions = shuffleArray([...masterQuizData]).slice(0, 10);

    currentQuestionIndex = 0;
    score = 0;
    wrongAnswersHistory = [];
    showQuestion();
}

function showQuestion() {
    resetTimer();
    startTimer();

    const currentQuiz = shuffledQuestions[currentQuestionIndex];
    questionNumberText.innerText = `Soal ${currentQuestionIndex + 1} dari ${shuffledQuestions.length}`;
    questionText.innerText = currentQuiz.question;
    answerOptionsContainer.innerHTML = "";

    currentQuiz.options.forEach((option, index) => {
        const button = document.createElement("button");
        button.innerText = option;
        button.classList.add("option-btn");
        button.addEventListener("click", () => checkAnswer(index));
        answerOptionsContainer.appendChild(button);
    });
}

function checkAnswer(selectedIndex) {
    clearInterval(timer);
    const currentQuiz = shuffledQuestions[currentQuestionIndex];
    const correctIndex = currentQuiz.answer;

    if (selectedIndex === correctIndex) {
        score += 10; // 10 soal acak x 10 poin = 100 poin maksimal
    } else {
        wrongAnswersHistory.push({
            question: currentQuiz.question,
            userAnswer: selectedIndex === -1 ? "Waktu Habis" : currentQuiz.options[selectedIndex],
            correctAnswer: currentQuiz.options[correctIndex]
        });
    }

    if (currentQuestionIndex < shuffledQuestions.length - 1) {
        currentQuestionIndex++;
        showQuestion();
    } else {
        showResult();
    }
}

function startTimer() {
    timeLeft = 15;
    timerDisplay.innerText = timeLeft;

    timer = setInterval(() => {
        timeLeft--;
        timerDisplay.innerText = timeLeft;

        if (timeLeft <= 0) {
            clearInterval(timer);
            checkAnswer(-1); 
        }
    }, 1000);
}

function resetTimer() {
    clearInterval(timer);
}

function showResult() {
    quizScreen.classList.add("hide");
    resultScreen.classList.remove("hide");

    playerGreeting.innerText = `Hebat, ${playerName}! Kamu telah menyelesaikan kuis BitBrain.`;
    finalScoreDisplay.innerText = score;
    
    localStorage.setItem("latestScore", score);

    reviewList.innerHTML = "";
    if (wrongAnswersHistory.length === 0) {
        reviewList.innerHTML = "<p style='color: #00ff88; font-size: 0.95rem;'>Sempurna! Kamu menjawab semua pertanyaan dengan benar! 🚀</p>";
    } else {
        wrongAnswersHistory.forEach((item, index) => {
            const reviewItem = document.createElement("div");
            reviewItem.style.marginBottom = "15px";
            reviewItem.style.borderBottom = "1px solid #1f232b";
            reviewItem.style.paddingBottom = "10px";

            reviewItem.innerHTML = `
                <p style="color: #ffffff; font-weight: 600; font-size: 0.95rem;">${index + 1}. ${item.question}</p>
                <p style="color: #ff5252; font-size: 0.85rem; margin-left: 10px;">❌ Jawabanmu: ${item.userAnswer}</p>
                <p style="color: #00ff88; font-size: 0.85rem; margin-left: 10px;">✅ Jawaban Benar: ${item.correctAnswer}</p>
            `;
            reviewList.appendChild(reviewItem);
        });
    }
}

/* ==========================================================================
   4. EVENT LISTENERS
   ========================================================================== */
startBtn.addEventListener("click", startQuiz);

restartBtn.addEventListener("click", () => {
    resultScreen.classList.add("hide");
    startScreen.classList.remove("hide");
    usernameInput.value = "";
});