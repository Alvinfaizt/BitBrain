/* ==========================================================================
   1. DEKLARASI VARIABEL UTAMA & DOM ELEMENTS
   ========================================================================== */
let shuffledQuestions = []; 
let currentQuestionIndex = 0;
let score = 0;
let timer;
let timeLeft = 15;
let playerName = "";
let wrongAnswersHistory = [];

// Screen Halaman
const introScreen = document.getElementById("intro-screen");
const mainMenu = document.getElementById("main-menu");
const nameScreen = document.getElementById("name-screen");
const quizScreen = document.getElementById("quiz-screen");
const resultScreen = document.getElementById("result-screen");

// Tombol Kendali
const playBtn = document.getElementById("play-btn");
const howToBtn = document.getElementById("how-to-btn");
const startGameBtn = document.getElementById("start-game-btn");
const backToMenuBtn = document.getElementById("back-to-menu-btn");
const restartBtn = document.getElementById("restart-btn");

// Input & Output Output Teks
const usernameInput = document.getElementById("username");
const questionNumberText = document.getElementById("question-number");
const questionText = document.getElementById("question-text");
const answerOptionsContainer = document.getElementById("answer-options");
const timerDisplay = document.getElementById("timer");
const finalScoreDisplay = document.getElementById("final-score");
const playerGreeting = document.getElementById("player-greeting");
const reviewList = document.getElementById("review-list");

/* ==========================================================================
   2. SISTEM MANAJEMEN INTRO INTRO SCREEN (SPLASH SCREEN)
   ========================================================================== */
// Ketika website selesai dimuat sepenuhnya, jalankan hitung mundur intro
window.addEventListener("DOMContentLoaded", () => {
    setTimeout(() => {
        if (introScreen) {
            introScreen.classList.add("fade-out");
        }
    }, 3000); // Intro ditahan selama 3 detik sebelum masuk ke main menu
});

/* ==========================================================================
   3. ALGORITMA PENGACAK (Fisher-Yates)
   ========================================================================== */
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

/* ==========================================================================
   4. FUNGSI NAVIGASI & LOGIKA GAME
   ========================================================================== */

// Klik "PLAY GAME" di Menu Utama -> Buka layar input nama
playBtn.addEventListener("click", () => {
    mainMenu.classList.add("hide");
    nameScreen.classList.remove("hide");
});

// Klik "HOW TO PLAY" di Menu Utama -> Munculkan alert instruksi ringkas
howToBtn.addEventListener("click", () => {
    alert("📜 CARA BERMAIN BITBRAIN:\n\n1. Masukkan nickname kamu.\n2. Sistem akan memilih 10 soal IT secara acak.\n3. Kamu punya waktu 15 detik per soal.\n4. Jawab benar = +10 poin, salah/waktu habis = 0 poin.\n5. Evaluasi kesalahanmu di akhir game!");
});

// Klik "BACK" di layar nama -> Kembali ke Menu Utama
backToMenuBtn.addEventListener("click", () => {
    nameScreen.classList.add("hide");
    mainMenu.classList.remove("hide");
});

// Klik "START" setelah isi nama -> Mulai Kuis Semestinya
function initQuizData() {
    playerName = usernameInput.value.trim();
    if (playerName === "") {
        alert("Masukkan namamu dulu sebelum bertanding!");
        return;
    }

    localStorage.setItem("latestPlayer", playerName);

    nameScreen.classList.add("hide");
    quizScreen.classList.remove("hide");

    // Ambil 10 soal acak murni dari berkas berkas questions.js
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
        score += 10;
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

    playerGreeting.innerText = `GAME OVER! GG WP, ${playerName}!`;
    finalScoreDisplay.innerText = score;
    
    localStorage.setItem("latestScore", score);

    reviewList.innerHTML = "";
    if (wrongAnswersHistory.length === 0) {
        reviewList.innerHTML = "<p style='color: #00ff88; font-size: 0.95rem;'>PERFECT GAME! Kamu melibas semua soal tanpa cacat! 🚀</p>";
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
   5. EVENT LISTENERS UTAMA
   ========================================================================== */
startGameBtn.addEventListener("click", initQuizData);

restartBtn.addEventListener("click", () => {
    resultScreen.classList.add("hide");
    mainMenu.classList.remove("hide"); 
    usernameInput.value = "";
});