/* ===================================================
   script.js — Shared JavaScript
   Aplikasi Multimedia Pengenalan Perangkat Komputer
   =================================================== */

// ---- Navbar Hamburger Toggle ----
document.addEventListener('DOMContentLoaded', function () {
  const hamburger = document.querySelector('.hamburger');
  const navLinks  = document.querySelector('.navbar-links');

  if (hamburger && navLinks) {
    hamburger.addEventListener('click', function () {
      navLinks.classList.toggle('open');
    });
    // Tutup menu saat klik link
    navLinks.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        navLinks.classList.remove('open');
      });
    });
  }

  // Tandai link aktif berdasarkan URL saat ini
  const currentFile = window.location.pathname.split('/').pop();
  document.querySelectorAll('.navbar-links a').forEach(function (a) {
    if (a.getAttribute('href') === currentFile) {
      a.classList.add('active');
    }
  });
});

// ---- Model Viewer: ganti model ----
function switchModel(src, btn) {
  const viewer = document.getElementById('main-model-viewer');
  const fallback = document.getElementById('model-fallback');
  if (!viewer) return;

  // Reset active button
  document.querySelectorAll('.model-btn').forEach(function (b) {
    b.classList.remove('active');
  });
  btn.classList.add('active');

  viewer.setAttribute('src', src);
  viewer.style.display = 'block';
  if (fallback) fallback.style.display = 'none';
}

// Fallback jika model gagal load
document.addEventListener('DOMContentLoaded', function () {
  const viewer  = document.getElementById('main-model-viewer');
  const fallback = document.getElementById('model-fallback');
  if (viewer && fallback) {
    viewer.addEventListener('error', function () {
      viewer.style.display = 'none';
      fallback.style.display = 'block';
    });
  }
});

// ---- Kuis ----
const quizData = [
  {
    question: "Perangkat yang digunakan untuk mengetik adalah?",
    options: ["Monitor", "Keyboard", "Printer", "Speaker"],
    answer: 1
  },
  {
    question: "Perangkat yang digunakan untuk menggerakkan kursor adalah?",
    options: ["Mouse", "RAM", "SSD", "Printer"],
    answer: 0
  },
  {
    question: "Perangkat yang menampilkan hasil visual komputer adalah?",
    options: ["Scanner", "Monitor", "Keyboard", "Flashdisk"],
    answer: 1
  },
  {
    question: "Perangkat yang digunakan untuk mencetak dokumen adalah?",
    options: ["Printer", "Mouse", "CPU", "Webcam"],
    answer: 0
  },
  {
    question: "Perangkat yang berfungsi menyimpan data dengan cepat adalah?",
    options: ["SSD", "Speaker", "Monitor", "Microphone"],
    answer: 0
  },
  {
    question: "Perangkat yang digunakan untuk merekam suara adalah?",
    options: ["Microphone", "VGA Card", "Projector", "Keyboard"],
    answer: 0
  },
  {
    question: "Perangkat yang berfungsi mengolah data adalah?",
    options: ["CPU", "Printer", "Headphone", "Flashdisk"],
    answer: 0
  },
  {
    question: "Perangkat yang digunakan untuk memindai dokumen adalah?",
    options: ["Scanner", "Speaker", "Monitor", "Hard disk"],
    answer: 0
  },
  {
    question: "Perangkat yang menghasilkan suara adalah?",
    options: ["Speaker", "Keyboard", "RAM", "Mouse"],
    answer: 0
  },
  {
    question: "Perangkat yang menyimpan data secara portabel adalah?",
    options: ["Flashdisk", "Monitor", "Projector", "Webcam"],
    answer: 0
  }
];

let currentQuestion = 0;
let score = 0;
let answered = false;

function initQuiz() {
  currentQuestion = 0;
  score = 0;
  answered = false;
  renderQuestion();
}

function renderQuestion() {
  if (currentQuestion >= quizData.length) {
    finishQuiz();
    return;
  }

  const q = quizData[currentQuestion];
  answered = false;

  // Progress
  document.getElementById('q-progress-text').textContent =
    'Soal ' + (currentQuestion + 1) + ' dari ' + quizData.length;
  const pct = ((currentQuestion) / quizData.length) * 100;
  document.getElementById('q-progress-fill').style.width = pct + '%';

  // Soal
  document.getElementById('q-text').textContent = q.question;

  // Pilihan
  const keys = ['A', 'B', 'C', 'D'];
  const container = document.getElementById('q-options');
  container.innerHTML = '';
  q.options.forEach(function (opt, i) {
    const btn = document.createElement('button');
    btn.className = 'quiz-option';
    btn.innerHTML =
      '<span class="opt-key">' + keys[i] + '</span>' + opt;
    btn.addEventListener('click', function () {
      selectAnswer(i);
    });
    container.appendChild(btn);
  });

  // Sembunyikan feedback & tombol next
  const fb = document.getElementById('q-feedback');
  if (fb) { fb.className = 'quiz-feedback'; fb.textContent = ''; }
  const nextBtn = document.getElementById('btn-next');
  if (nextBtn) nextBtn.style.display = 'none';
}

function selectAnswer(index) {
  if (answered) return;
  answered = true;

  const q = quizData[currentQuestion];
  const options = document.querySelectorAll('.quiz-option');
  const fb = document.getElementById('q-feedback');
  const nextBtn = document.getElementById('btn-next');

  options.forEach(function (opt, i) {
    opt.style.pointerEvents = 'none';
    if (i === q.answer) opt.classList.add('correct');
    else if (i === index && index !== q.answer) opt.classList.add('wrong');
  });

  if (index === q.answer) {
    score++;
    if (fb) {
      fb.textContent = '✔ Benar!';
      fb.className = 'quiz-feedback show correct';
    }
  } else {
    if (fb) {
      fb.textContent = '✘ Salah! Jawaban yang benar: ' + q.options[q.answer];
      fb.className = 'quiz-feedback show wrong';
    }
  }

  if (nextBtn) nextBtn.style.display = 'inline-flex';
}

function nextQuestion() {
  currentQuestion++;
  renderQuestion();
}

function finishQuiz() {
  // Simpan skor ke localStorage
  localStorage.setItem('quiz_score', score);
  localStorage.setItem('quiz_total', quizData.length);
  localStorage.setItem('quiz_benar', score);
  localStorage.setItem('quiz_salah', quizData.length - score);
  window.location.href = 'hasil_kuis_perangkat_komputer.html';
}

// Inisialisasi kuis jika ada elemen kuis di halaman
document.addEventListener('DOMContentLoaded', function () {
  if (document.getElementById('q-text')) {
    initQuiz();
    const nextBtn = document.getElementById('btn-next');
    if (nextBtn) {
      nextBtn.style.display = 'none';
      nextBtn.addEventListener('click', nextQuestion);
    }
  }

  // Hasil kuis
  if (document.getElementById('hasil-score')) {
    const total  = parseInt(localStorage.getItem('quiz_total'))  || 10;
    const benar  = parseInt(localStorage.getItem('quiz_benar'))  || 0;
    const salah  = parseInt(localStorage.getItem('quiz_salah'))  || 0;
    const score  = parseInt(localStorage.getItem('quiz_score'))  || 0;
    const pct    = Math.round((score / total) * 100);

    document.getElementById('hasil-score').textContent = pct + '%';
    document.getElementById('hasil-benar').textContent = benar;
    document.getElementById('hasil-salah').textContent = salah;

    const el = document.getElementById('hasil-predikat');
    if (el) {
      if (pct >= 80)       el.textContent = '🏆 Luar Biasa!';
      else if (pct >= 60)  el.textContent = '👍 Bagus!';
      else if (pct >= 40)  el.textContent = '📚 Perlu Belajar Lagi';
      else                 el.textContent = '💪 Semangat Belajar!';
    }
  }
});
