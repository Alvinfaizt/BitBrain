/* ==========================================================================
   1. BANK SOAL (Array Objek Kuis Tebak-Tebakan IT)
   ========================================================================== */
const quizData = [
    {
        question: "Tag HTML yang digunakan untuk membuat judul utama atau terbesar adalah...",
        options: ["<heading>", "<h6>", "<h1>", "<head>"],
        answer: 2 // Indeks ke-2 yaitu "<h1>"
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

// Mengambil elemen HTML menggunakan DOM (Document Object Model)
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

/* ==========================================================================
   3. FUNGSI LOGIKA PERMAINAN
   ========================================================================== */

// Fungsi untuk memulai kuis
function startQuiz() {
    playerName = usernameInput.value.trim();
    
    // Validasi: Input nama tidak boleh kosong
    if (playerName === "") {
        alert("Silakan masukkan nama kamu terlebih dahulu!");
        return;
    }

    // Menyimpan nama pemain ke localStorage sesuai tema fungsionalitas
    localStorage.setItem("latestPlayer", playerName);

    // Pindah halaman menggunakan manipulasi class CSS
    startScreen.classList.add("hide");
    quizScreen.classList.remove("hide");

    currentQuestionIndex = 0;
    score = 0;
    showQuestion();
}

// Fungsi untuk menampilkan soal kuis
function showQuestion() {
    resetTimer();
    startTimer();

    const currentQuiz = quizData[currentQuestionIndex];
    
    // Mengatur teks nomor soal dan isi pertanyaan
    questionNumberText.innerText = `Soal ${currentQuestionIndex + 1} dari ${quizData.length}`;
    questionText.innerText = currentQuiz.question;

    // Mengosongkan pilihan jawaban sebelumnya
    answerOptionsContainer.innerHTML = "";

    // Perulangan (Loop) untuk menampilkan 4 pilihan jawaban berupa tombol
    currentQuiz.options.forEach((option, index) => {
        const button = document.createElement("button");
        button.innerText = option;
        button.classList.add("option-btn");
        
        // Menambahkan event click pada setiap tombol opsi jawaban
        button.addEventListener("click", () => checkAnswer(index));
        answerOptionsContainer.appendChild(button);
    });
}

// Fungsi untuk memeriksa jawaban pengguna
function checkAnswer(selectedIndex) {
    clearInterval(timer);
    const correctIndex = quizData[currentQuestionIndex].answer;

    // Kondisi (If-Else) untuk memeriksa kebenaran jawaban
    if (selectedIndex === correctIndex) {
        score += 20; // Jika benar, skor bertambah 20 (Total 5 soal x 20 = 100)
    }

    // Melanjutkan ke soal berikutnya atau ke halaman hasil akhir
    if (currentQuestionIndex < quizData.length - 1) {
        currentQuestionIndex++;
        showQuestion();
    } else {
        showResult();
    }
}

// Fungsi Pengatur Waktu (Timer)
function startTimer() {
    timeLeft = 15;
    timerDisplay.innerText = timeLeft;

    timer = setInterval(() => {
        timeLeft--;
        timerDisplay.innerText = timeLeft;

        if (timeLeft <= 0) {
            clearInterval(timer);
            // Jika waktu habis, otomatis dianggap salah dan lanjut ke soal berikutnya
            if (currentQuestionIndex < quizData.length - 1) {
                currentQuestionIndex++;
                showQuestion();
            } else {
                showResult();
            }
        }
    }, 1000);
}

function resetTimer() {
    clearInterval(timer);
}

// Fungsi untuk menampilkan halaman skor akhir
function showResult() {
    quizScreen.classList.add("hide");
    resultScreen.classList.remove("hide");

    playerGreeting.innerText = `Hebat, ${playerName}! Kamu telah menyelesaikan kuis BitBrain.`;
    finalScoreDisplay.innerText = score;
    
    // Menyimpan skor akhir ke localStorage
    localStorage.setItem("latestScore", score);
}

/* ==========================================================================
   4. EVENT LISTENERS (Penanganan Aksi Pengguna)
   ========================================================================== */
startBtn.addEventListener("click", startQuiz);

restartBtn.addEventListener("click", () => {
    resultScreen.classList.add("hide");
    startScreen.classList.remove("hide");
    usernameInput.value = "";
});