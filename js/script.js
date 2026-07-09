/* ==========================================================================
   1. BANK SOAL LEBIH BANYAK (10 Soal Kuis IT Variatif)
   ========================================================================== */
const masterQuizData = [
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
    },
    {
        question: "Protokol standar yang digunakan untuk mengamankan pengiriman data di website (ada ikon gembok di URL) adalah...",
        options: ["HTTP", "HTTPS", "FTP", "SMTP"],
        answer: 1
    },
    {
        question: "Satu-satunya makhluk hidup yang bisa memahami isi hati dan pikiran seorang programmer adalah...",
        options: ["Pacar", "Dosen Wali", "ChatGPT / AI", "Rubber Duck (Bebek Karet)"],
        answer: 3
    },
    {
        question: "Di bawah ini yang merupakan komponen 'otak' atau pusat pemrosesan data utama pada komputer adalah...",
        options: ["RAM", "Processor / CPU", "SSD", "GPU"],
        answer: 1
    },
    {
        question: "Istilah untuk error atau kesalahan di dalam kode program dinamakan...",
        options: ["Bug", "Virus", "Worm", "Crash"],
        answer: 0
    },
    {
        question: "Kombinasi tombol keyboard jalan pintas (shortcut) legendaris untuk menyelamatkan tugas dari pemadaman listrik tiba-tiba adalah...",
        options: ["Ctrl + C", "Ctrl + V", "Ctrl + S", "Ctrl + Z"],
        answer: 2
    }
];

/* ==========================================================================
   2. DEKLARASI VARIABEL UTAMA
   ========================================================================== */
let shuffledQuestions = []; // Array tempat menampung soal yang sudah diacak
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
   3. FUNGSI LOGIKA PERMAINAN & ALGORITMA PENGACAK
   ========================================================================== */

// Fungsi untuk mengacak urutan elemen di dalam Array (Algoritma Fisher-Yates)
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function startQuiz() {
    playerName = usernameInput.value.trim();
    if (playerName === "") {
        alert("Silakan masukkan nama kamu terlebih dahulu!");
        return;
    }

    localStorage.setItem("latestPlayer", playerName);

    startScreen.classList.add("hide");
    quizScreen.classList.remove("hide");

    // LOGIKA BARU: Gandakan bank soal asli lalu acak urutannya agar tidak merusak data master
    shuffledQuestions = shuffleArray([...masterQuizData]);

    currentQuestionIndex = 0;
    score = 0;
    wrongAnswersHistory = [];
    showQuestion();
}

function showQuestion() {
    resetTimer();
    startTimer();

    // Mengambil soal dari array yang sudah teracak
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
        score += 10; // Mengubah kalkulasi skor: 10 soal x 10 poin = total 100 poin maksimal
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