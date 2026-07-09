/* ==========================================================================
   1. BANK SOAL (Array Objek Kuis Tebak-Tebakan IT)
   ========================================================================== */
const quizData = [
    {
        question: "Tag HTML yang digunakan untuk membuat judul utama atau terbesar adalah...",
        options: ["<heading>", "<h6>", "<h1>", "<head>"],
        answer: 2
    },
    {
        question: "Sifat komputer yang paling mirip dengan sifat mantan kekasih adalah...",
        options: ["Suka nge-ghosting", "Suka tidak merespons (Not Responding)", "Boros memori", "Gampang panas"],
        answer: 1
    },
    {
        question: "Bahasa pemrograman yang berjalan di sisi browser untuk membuat halaman menjadi interaktif adalah...",
        options: ["HTML", "CSS", "JavaScript", "PHP"],
        answer: 2
    },
    {
        question: "Kenapa programmer suka pakai baju warna hitam atau gelap?",
        options: ["Biar kelihatan keren", "Karena warna favorit dosen", "Biar bisa menyembunyikan 'bug' di tempat gelap", "Karena malas mencuci baju"],
        answer: 2
    },
    {
        question: "Jika kamu membuat kesalahan penulisan kode di CSS, efek yang paling sering terjadi adalah...",
        options: ["Komputer meledak", "Tampilan web menjadi berantakan", "Kuota internet habis", "Dapat nilai A otomatis"],
        answer: 1
    }
];

/* ==========================================================================
   2. DEKLARASI VARIABEL UTAMA
   ========================================================================== */
let currentQuestionIndex = 0;
let score = 0;
let timer;
let timeLeft = 15;
let playerName = "";
let wrongAnswersHistory = []; // Array baru untuk menyimpan riwayat kesalahan pemain

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
   3. FUNGSI LOGIKA PERMAINAN
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

    currentQuestionIndex = 0;
    score = 0;
    wrongAnswersHistory = []; // Reset riwayat kesalahan setiap kuis baru dimulai
    showQuestion();
}

function showQuestion() {
    resetTimer();
    startTimer();

    const currentQuiz = quizData[currentQuestionIndex];
    questionNumberText.innerText = `Soal ${currentQuestionIndex + 1} dari ${quizData.length}`;
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
    const currentQuiz = quizData[currentQuestionIndex];
    const correctIndex = currentQuiz.answer;

    if (selectedIndex === correctIndex) {
        score += 20;
    } else {
        // Logika Baru: Jika jawaban salah atau kehabisan waktu, simpan ke dalam history riwayat
        wrongAnswersHistory.push({
            question: currentQuiz.question,
            userAnswer: selectedIndex === -1 ? "Waktu Habis" : currentQuiz.options[selectedIndex],
            correctAnswer: currentQuiz.options[correctIndex]
        });
    }

    if (currentQuestionIndex < quizData.length - 1) {
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
            checkAnswer(-1); // Kirim nilai indeks -1 sebagai penanda waktu habis (jawaban otomatis salah)
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

    // Menampilkan daftar review soal yang dijawab salah
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