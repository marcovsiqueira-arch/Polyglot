const fs = require('fs');

const en = JSON.parse(fs.readFileSync('scratch/lessons_en.json', 'utf8'));
const es = JSON.parse(fs.readFileSync('scratch/lessons_es.json', 'utf8'));
const pt = JSON.parse(fs.readFileSync('scratch/lessons_pt.json', 'utf8'));

const allLessons = [...en, ...es, ...pt];

const scriptTemplate = `/**
 * Polyglot — Modern Language Learning Platform
 * Comprehensive 60-Unit Curriculum (English, Spanish, Portuguese),
 * 10 Tasks Per Unit (600 Interactive Pedagogical Tasks),
 * Web Audio FX, Speech Synthesis, Daily Goals, Dark Mode & Leaderboard.
 */

// ============================================================================
// State Management & Persistence
// ============================================================================

const STORAGE_KEY = 'polyglot_user_app_v3';

function getTodayString() {
  return new Date().toISOString().split('T')[0];
}

let appState = {
  name: 'Aprendiz',
  xp: 0,
  streak: 1,
  completedLessons: [],
  lastActiveDate: getTodayString(),
  dailyXP: 0,
  dailyGoal: 50,
  theme: 'light',
  achievements: [],
  currentLanguageFilter: 'all',
  currentSearchQuery: '',
  practiceLanguage: 'en'
};

function loadState() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      appState = Object.assign({}, appState, parsed);
    }
  } catch (err) {
    console.warn('Could not load user progress from localStorage:', err);
  }

  checkDailyReset();
  checkStreak();
}

function saveState() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(appState));
  } catch (err) {
    console.warn('Could not save user progress to localStorage:', err);
  }
}

function checkDailyReset() {
  const today = getTodayString();
  if (appState.lastActiveDate !== today) {
    appState.dailyXP = 0;
    saveState();
  }
}

function checkStreak() {
  const today = getTodayString();
  if (!appState.lastActiveDate) {
    appState.lastActiveDate = today;
    appState.streak = 1;
    saveState();
    return;
  }

  const last = new Date(appState.lastActiveDate);
  const now = new Date(today);
  const diffDays = Math.round((now - last) / (1000 * 60 * 60 * 24));

  if (diffDays > 1) {
    appState.streak = 1;
  }
  saveState();
}

function recordActivity(xpGained = 0) {
  const today = getTodayString();
  if (appState.lastActiveDate !== today) {
    appState.streak += 1;
    appState.lastActiveDate = today;
    appState.dailyXP = 0;
  }
  appState.dailyXP += xpGained;
  checkAchievements();
  saveState();
  updateUI();
}

// ============================================================================
// Audio Synthesizer (Web Audio API)
// ============================================================================

let audioCtx = null;

function getAudioContext() {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

function playSound(type) {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    if (type === 'click') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.exponentialRampToValueAtTime(140, now + 0.04);
      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
      osc.start(now);
      osc.stop(now + 0.05);
    } else if (type === 'correct') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(523.25, now); // C5
      osc.frequency.setValueAtTime(659.25, now + 0.09); // E5
      osc.frequency.setValueAtTime(783.99, now + 0.18); // G5
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.32);
      osc.start(now);
      osc.stop(now + 0.33);
    } else if (type === 'wrong') {
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(260, now);
      osc.frequency.setValueAtTime(190, now + 0.12);
      gain.gain.setValueAtTime(0.1, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);
      osc.start(now);
      osc.stop(now + 0.29);
    } else if (type === 'level-up') {
      osc.type = 'triangle';
      const notes = [440, 554, 659, 880];
      notes.forEach((freq, idx) => {
        osc.frequency.setValueAtTime(freq, now + idx * 0.08);
      });
      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);
      osc.start(now);
      osc.stop(now + 0.46);
    }
  } catch (e) {
    // Audio context may fail if user hasn't interacted yet
  }
}

// ============================================================================
// Text-to-Speech (Web Speech API)
// ============================================================================

function speakText(text, langCode = 'en') {
  if (!('speechSynthesis' in window)) return;

  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);

  const langMap = {
    en: 'en-US',
    es: 'es-ES',
    pt: 'pt-BR'
  };

  utterance.lang = langMap[langCode] || 'en-US';
  utterance.rate = 0.9;
  utterance.pitch = 1.0;

  window.speechSynthesis.speak(utterance);
}

// ============================================================================
// Curriculum: 60 Units (English, Spanish, Portuguese), 10 Tasks Each (600 Tasks)
// ============================================================================

const LESSONS = ${JSON.stringify(allLessons, null, 2)};

// ============================================================================
// Achievements & Leaderboard Mock Data
// ============================================================================

const ACHIEVEMENTS_LIST = [
  { id: 'first_win', icon: '🌟', title: 'Primeiro Passo', desc: 'Conclua sua primeira lição.' },
  { id: 'streak_3', icon: '🔥', title: 'Na Chama', desc: 'Mantenha 3 dias de sequência.' },
  { id: 'xp_100', icon: '⚡', title: 'Centurião do XP', desc: 'Acumule mais de 100 XP.' },
  { id: 'daily_goal', icon: '🎯', title: 'Foco Total', desc: 'Bata sua meta diária de XP.' },
  { id: 'english_fan', icon: '🇬🇧', title: 'Globetrotter', desc: 'Pratique lições em Inglês.' },
  { id: 'spanish_fan', icon: '🇪🇸', title: 'Hispano', desc: 'Pratique lições em Espanhol.' },
  { id: 'portuguese_fan', icon: '🇧🇷', title: 'Brasileirinho', desc: 'Pratique lições em Português.' },
  { id: 'top_podium', icon: '🏆', title: 'Pódio dos Campeões', desc: 'Alcance o Top 3 no Ranking.' }
];

const MOCK_LEADERBOARD = [
  { name: 'Mariana Souza', xp: 580, avatar: '👩' },
  { name: 'Lucas Silva', xp: 420, avatar: '👨' },
  { name: 'Beatriz Costa', xp: 310, avatar: '👩‍🦰' },
  { name: 'Thiago Mendes', xp: 230, avatar: '🧔' },
  { name: 'Ana Clara', xp: 140, avatar: '👱‍♀️' },
  { name: 'Rafael Lima', xp: 75, avatar: '🧑' },
  { name: 'Sofia Oliveira', xp: 30, avatar: '👧' }
];

// ============================================================================
// UI Rendering & Synchronization
// ============================================================================

function updateUI() {
  const { name, xp, streak, completedLessons, dailyXP, dailyGoal } = appState;

  // Header & Sidebar
  const headerXpEl = document.getElementById('headerXP');
  if (headerXpEl) headerXpEl.textContent = \`\${xp} XP\`;

  const streakCountEl = document.getElementById('streakCount');
  if (streakCountEl) streakCountEl.textContent = \`\${streak} \${streak === 1 ? 'dia' : 'dias'}\`;

  const streakStatEl = document.getElementById('streakStat');
  if (streakStatEl) streakStatEl.textContent = \`\${streak} \${streak === 1 ? 'dia' : 'dias'}\`;

  const totalXpEl = document.getElementById('totalXP');
  if (totalXpEl) totalXpEl.textContent = \`\${xp} XP\`;

  const completedStatEl = document.getElementById('completedStat');
  if (completedStatEl) completedStatEl.textContent = completedLessons.length;

  const welcomeNameEl = document.getElementById('welcomeName');
  if (welcomeNameEl) welcomeNameEl.textContent = name || 'Aprendiz';

  const avatarInitial = (name && name[0]) ? name[0].toUpperCase() : 'A';
  const avatarBtn = document.getElementById('avatarButton');
  if (avatarBtn) avatarBtn.textContent = avatarInitial;

  const profileAvatar = document.getElementById('profileAvatar');
  if (profileAvatar) profileAvatar.textContent = avatarInitial;

  const profileDisplayName = document.getElementById('profileDisplayName');
  if (profileDisplayName) profileDisplayName.textContent = name || 'Aprendiz';

  const userNameInput = document.getElementById('userName');
  if (userNameInput && !userNameInput.value) userNameInput.value = name || '';

  const dailyGoalSelect = document.getElementById('dailyGoal');
  if (dailyGoalSelect) dailyGoalSelect.value = String(dailyGoal);

  // Today Date Label
  const todayLabel = document.getElementById('todayLabel');
  if (todayLabel) {
    const now = new Date();
    const options = { weekday: 'long', day: 'numeric', month: 'long' };
    todayLabel.textContent = \`Hoje, \${now.toLocaleDateString('pt-BR', options)}\`;
  }

  // Daily Goal Meter
  const goalCurrentEl = document.getElementById('goalCurrent');
  if (goalCurrentEl) goalCurrentEl.textContent = dailyXP;

  const goalTargetEl = document.getElementById('goalTarget');
  if (goalTargetEl) goalTargetEl.textContent = dailyGoal;

  const goalProgressEl = document.getElementById('goalProgress');
  const goalPct = Math.min(100, Math.round((dailyXP / dailyGoal) * 100));
  if (goalProgressEl) goalProgressEl.style.width = \`\${goalPct}%\`;

  const goalMessageEl = document.getElementById('goalMessage');
  if (goalMessageEl) {
    if (dailyXP >= dailyGoal) {
      goalMessageEl.textContent = '🎉 Incrível! Você atingiu sua meta diária de hoje!';
      goalMessageEl.style.color = 'var(--accent-green)';
    } else {
      goalMessageEl.textContent = \`Faltam apenas \${dailyGoal - dailyXP} XP para cumprir sua meta.\`;
      goalMessageEl.style.color = 'var(--text-muted)';
    }
  }

  renderLanguagesHome();
  renderLessonsList();
  renderRankingTable();
  renderAchievements();
}

function renderLanguagesHome() {
  const container = document.getElementById('languageList');
  if (!container) return;

  const langs = [
    { code: 'en', name: 'Inglês', flag: '🇬🇧', total: 20 },
    { code: 'es', name: 'Espanhol', flag: '🇪🇸', total: 20 },
    { code: 'pt', name: 'Português', flag: '🇧🇷', total: 20 }
  ];

  container.innerHTML = langs.map(l => {
    const done = appState.completedLessons.filter(id => id.startsWith(l.code)).length;
    const pct = Math.round((done / l.total) * 100);
    return \`
      <div class="language-item" onclick="filterByLangFromHome('\${l.code}')">
        <div class="language-flag">\${l.flag}</div>
        <div class="language-info">
          <h3>\${l.name}</h3>
          <p>\${done} de \${l.total} lições concluídas (10 tarefas cada)</p>
          <div class="language-progress">
            <span style="width: \${pct}%;"></span>
          </div>
        </div>
        <div class="language-percent">\${pct}%</div>
      </div>
    \`;
  }).join('');
}

window.filterByLangFromHome = function(code) {
  appState.currentLanguageFilter = code;
  appState.practiceLanguage = code;
  saveState();
  navigateToPage('lessons');

  document.querySelectorAll('#lessonFilters .filter-chip').forEach(btn => {
    if (btn.getAttribute('data-language') === code) {
      btn.classList.add('selected');
      btn.classList.add('active');
    } else {
      btn.classList.remove('selected');
      btn.classList.remove('active');
    }
  });

  renderLessonsList();
};

function renderLessonsList() {
  const grid = document.getElementById('lessonGrid');
  const countEl = document.getElementById('lessonCount');
  if (!grid) return;

  let filtered = LESSONS;
  const lang = appState.currentLanguageFilter;
  const query = (appState.currentSearchQuery || '').toLowerCase().trim();

  if (lang !== 'all') {
    filtered = filtered.filter(l => l.language === lang);
  }

  if (query) {
    filtered = filtered.filter(l =>
      l.title.toLowerCase().includes(query) ||
      l.description.toLowerCase().includes(query) ||
      l.level.toLowerCase().includes(query)
    );
  }

  if (countEl) {
    countEl.textContent = \`\${filtered.length} \${filtered.length === 1 ? 'lição' : 'lições'}\`;
  }

  if (filtered.length === 0) {
    grid.innerHTML = \`
      <div style="grid-column: 1/-1; text-align: center; padding: 48px 20px; color: var(--text-muted);">
        <div style="font-size: 3rem; margin-bottom: 10px;">🔍</div>
        <h3>Nenhuma lição encontrada</h3>
        <p>Tente ajustar sua busca ou selecionar outro idioma.</p>
      </div>
    \`;
    return;
  }

  grid.innerHTML = filtered.map(lesson => {
    const isDone = appState.completedLessons.includes(lesson.id);
    return \`
      <article class="lesson-card \${isDone ? 'completed' : ''}">
        <div>
          <div class="lesson-card-top">
            <div class="lesson-emoji">\${lesson.emoji}</div>
            <div class="lesson-card-info">
              <h3>\${lesson.title}</h3>
              <p>\${lesson.description}</p>
            </div>
          </div>
          <div class="lesson-card-footer">
            <span class="lesson-badge badge level">\${lesson.level}</span>
            <span class="lesson-badge badge xp">⚡ +\${lesson.xp} XP</span>
            <span>\${lesson.questions.length} tarefas</span>
          </div>
        </div>
        <button class="lesson-start-btn \${isDone ? 'done' : ''}" onclick="launchPracticeLesson('\${lesson.id}')">
          \${isDone ? '✓ Concluída (Revisar)' : 'Iniciar lição →'}
        </button>
      </article>
    \`;
  }).join('');
}

function renderRankingTable() {
  const table = document.getElementById('rankingTable');
  if (!table) return;

  const userEntry = {
    name: appState.name || 'Você',
    xp: appState.xp,
    avatar: '👤',
    isUser: true
  };

  const combined = [...MOCK_LEADERBOARD, userEntry].sort((a, b) => b.xp - a.xp);

  table.innerHTML = combined.map((item, index) => {
    const pos = index + 1;
    let badgeClass = '';
    let badgeText = \`#\${pos}\`;
    if (pos === 1) { badgeClass = 'gold'; badgeText = '🥇'; }
    else if (pos === 2) { badgeClass = 'silver'; badgeText = '🥈'; }
    else if (pos === 3) { badgeClass = 'bronze'; badgeText = '🥉'; }

    return \`
      <div class="ranking-row ranking-item \${item.isUser ? 'current-user' : ''}">
        <span class="ranking-position ranking-pos \${badgeClass}">\${badgeText}</span>
        <div class="ranking-avatar">\${item.avatar}</div>
        <div class="ranking-info ranking-name">
          \${item.name} \${item.isUser ? '<strong>(Você)</strong>' : ''}
        </div>
        <span class="ranking-score ranking-xp">⚡ \${item.xp} XP</span>
      </div>
    \`;
  }).join('');
}

function renderAchievements() {
  const container = document.getElementById('achievements');
  if (!container) return;

  container.innerHTML = ACHIEVEMENTS_LIST.map(ach => {
    const isUnlocked = appState.achievements.includes(ach.id);
    return \`
      <div class="achievement achievement-badge \${isUnlocked ? 'unlocked' : 'locked'}">
        <span class="achievement-icon icon">\${ach.icon}</span>
        <div>
          <strong class="title">\${ach.title}</strong>
          <p class="desc">\${ach.desc}</p>
        </div>
      </div>
    \`;
  }).join('');
}

function checkAchievements() {
  const unlocked = new Set(appState.achievements || []);

  if (appState.completedLessons.length >= 1) unlocked.add('first_win');
  if (appState.streak >= 3) unlocked.add('streak_3');
  if (appState.xp >= 100) unlocked.add('xp_100');
  if (appState.dailyXP >= appState.dailyGoal) unlocked.add('daily_goal');
  if (appState.completedLessons.some(id => id.startsWith('en'))) unlocked.add('english_fan');
  if (appState.completedLessons.some(id => id.startsWith('es'))) unlocked.add('spanish_fan');
  if (appState.completedLessons.some(id => id.startsWith('pt'))) unlocked.add('portuguese_fan');

  // Check ranking top 3
  const userRank = [...MOCK_LEADERBOARD, { xp: appState.xp }]
    .sort((a, b) => b.xp - a.xp)
    .findIndex(item => item.xp === appState.xp);
  if (userRank >= 0 && userRank < 3) unlocked.add('top_podium');

  if (unlocked.size > appState.achievements.length) {
    showToast('🏆 Nova conquista desbloqueada!', 'success');
    playSound('level-up');
  }

  appState.achievements = Array.from(unlocked);
  saveState();
}

// ============================================================================
// Navigation System
// ============================================================================

function navigateToPage(pageKey) {
  document.querySelectorAll('section[id^="page-"], .page').forEach(p => {
    p.classList.remove('active');
    p.hidden = true;
  });
  document.querySelectorAll('.nav-item').forEach(btn => {
    if (btn.getAttribute('data-page') === pageKey) btn.classList.add('active');
    else btn.classList.remove('active');
  });

  const target = document.getElementById(\`page-\${pageKey}\`);
  if (target) {
    target.classList.add('active');
    target.hidden = false;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // Update Breadcrumb
  const pageNameEl = document.getElementById('pageName');
  if (pageNameEl) {
    const titles = {
      home: 'Início',
      lessons: 'Minhas lições',
      practice: 'Praticar',
      ranking: 'Ranking',
      profile: 'Meu perfil'
    };
    pageNameEl.textContent = titles[pageKey] || 'Início';
  }

  // Close mobile sidebar if open
  const sidebar = document.getElementById('sidebar');
  if (sidebar) sidebar.classList.remove('open');
}

// ============================================================================
// Interactive Practice Engine (10 Tasks Per Unit, Audio, Scoring)
// ============================================================================

let currentExercise = {
  lessonId: null,
  language: 'en',
  title: '',
  questions: [],
  currentIndex: 0,
  selectedAnswer: null,
  score: 0,
  xpReward: 25
};

window.launchPracticeLesson = function(lessonId) {
  const lesson = LESSONS.find(l => l.id === lessonId);
  if (!lesson) return;

  currentExercise = {
    lessonId: lesson.id,
    language: lesson.language,
    title: lesson.title,
    questions: lesson.questions,
    currentIndex: 0,
    selectedAnswer: null,
    score: 0,
    xpReward: lesson.xp
  };

  navigateToPage('practice');
  renderCurrentQuestion();
};

function startGeneralPractice(preferredLang) {
  const lang = preferredLang || appState.practiceLanguage || 'en';
  const langLessons = LESSONS.filter(l => l.language === lang);
  let pool = [];
  langLessons.forEach(l => { pool = pool.concat(l.questions); });

  // Shuffle and take 10 tasks
  const shuffled = [...pool].sort(() => 0.5 - Math.random()).slice(0, 10);

  currentExercise = {
    lessonId: null,
    language: lang,
    title: \`Treino Rápido (\${lang === 'en' ? 'Inglês' : lang === 'es' ? 'Espanhol' : 'Português'})\`,
    questions: shuffled,
    currentIndex: 0,
    selectedAnswer: null,
    score: 0,
    xpReward: 25
  };

  navigateToPage('practice');
  renderCurrentQuestion();
}

function renderCurrentQuestion() {
  // Ensure active view is visible and complete view is hidden
  const activeView = document.getElementById('exerciseActiveView');
  const completeView = document.getElementById('exerciseCompleteView');
  if (activeView) activeView.classList.remove('hidden');
  if (completeView) completeView.classList.add('hidden');

  if (!currentExercise.questions || currentExercise.questions.length === 0) {
    if (activeView) activeView.innerHTML = '<p style="padding: 24px; text-align: center;">Nenhuma questão disponível.</p>';
    return;
  }

  const q = currentExercise.questions[currentExercise.currentIndex];
  const total = currentExercise.questions.length;
  currentExercise.selectedAnswer = null;

  // Question Counter
  const counterEl = document.getElementById('questionCounter');
  if (counterEl) counterEl.textContent = \`Questão \${currentExercise.currentIndex + 1} de \${total}\`;

  // Progress Bar
  const progressFill = document.querySelector('#exerciseProgress');
  if (progressFill) {
    const pct = ((currentExercise.currentIndex) / total) * 100;
    progressFill.style.width = \`\${pct}%\`;
  }

  // Emoji, Instruction, Question text
  const emojiEl = document.getElementById('questionEmoji');
  if (emojiEl) emojiEl.textContent = q.emoji || '💬';

  const instructionEl = document.getElementById('questionInstruction');
  if (instructionEl) instructionEl.textContent = q.instruction || 'Escolha a tradução correta';

  const textEl = document.getElementById('questionText');
  if (textEl) textEl.textContent = q.prompt;

  // Audio Speech Button
  const audioBtn = document.getElementById('audioButton');
  if (audioBtn) {
    audioBtn.onclick = () => speakText(q.speech || q.prompt, currentExercise.language);
  }

  // Options
  const answerList = document.getElementById('answerList');
  if (answerList) {
    answerList.innerHTML = q.options.map((opt, idx) => \`
      <button class="answer-option" onclick="selectAnswerOption(\${idx}, this)">
        <span>\${String.fromCharCode(65 + idx)}.</span> \${opt}
      </button>
    \`).join('');
  }

  // Feedback text
  const feedbackEl = document.getElementById('feedback');
  if (feedbackEl) {
    feedbackEl.textContent = '';
    feedbackEl.className = 'feedback';
  }

  // Buttons state
  const checkBtn = document.getElementById('checkAnswer');
  const nextBtn = document.getElementById('nextQuestion');
  if (checkBtn) {
    checkBtn.disabled = true;
    checkBtn.classList.remove('hidden');
  }
  if (nextBtn) {
    nextBtn.classList.add('hidden');
  }

  // Auto-play speech prompt gently
  if (q.speech) {
    setTimeout(() => speakText(q.speech, currentExercise.language), 300);
  }
}

window.selectAnswerOption = function(index, buttonEl) {
  currentExercise.selectedAnswer = index;
  playSound('click');

  document.querySelectorAll('.answer-option').forEach(btn => btn.classList.remove('selected'));
  if (buttonEl) buttonEl.classList.add('selected');

  const checkBtn = document.getElementById('checkAnswer');
  if (checkBtn) checkBtn.disabled = false;
};

function handleCheckAnswer() {
  if (currentExercise.selectedAnswer === null) return;

  const q = currentExercise.questions[currentExercise.currentIndex];
  const isCorrect = (currentExercise.selectedAnswer === q.answer);
  const feedbackEl = document.getElementById('feedback');
  const checkBtn = document.getElementById('checkAnswer');
  const nextBtn = document.getElementById('nextQuestion');

  const allBtns = document.querySelectorAll('.answer-option');
  allBtns.forEach((btn, idx) => {
    btn.disabled = true;
    if (idx === q.answer) btn.classList.add('correct');
    else if (idx === currentExercise.selectedAnswer) btn.classList.add('wrong');
  });

  if (isCorrect) {
    currentExercise.score++;
    playSound('correct');
    if (feedbackEl) {
      feedbackEl.textContent = '🎉 Muito bem! Resposta correta.';
      feedbackEl.className = 'feedback correct';
    }
  } else {
    playSound('wrong');
    if (feedbackEl) {
      feedbackEl.textContent = \`❌ Ops! A resposta certa era: "\${q.options[q.answer]}". \${q.explanation || ''}\`;
      feedbackEl.className = 'feedback wrong';
    }
  }

  if (checkBtn) checkBtn.classList.add('hidden');
  if (nextBtn) nextBtn.classList.remove('hidden');
}

function handleNextQuestion() {
  currentExercise.currentIndex++;
  if (currentExercise.currentIndex < currentExercise.questions.length) {
    renderCurrentQuestion();
  } else {
    finishExercise();
  }
}

function finishExercise() {
  const activeView = document.getElementById('exerciseActiveView');
  const completeView = document.getElementById('exerciseCompleteView');
  if (!activeView || !completeView) return;

  const total = currentExercise.questions.length;
  const earnedXp = Math.max(5, Math.round((currentExercise.score / total) * currentExercise.xpReward));

  appState.xp += earnedXp;

  if (currentExercise.lessonId && !appState.completedLessons.includes(currentExercise.lessonId)) {
    appState.completedLessons.push(currentExercise.lessonId);
  }

  recordActivity(earnedXp);
  playSound('level-up');

  // Switch to complete view without destroying DOM
  activeView.classList.add('hidden');
  completeView.classList.remove('hidden');

  const completeTitle = document.getElementById('completeTitle');
  if (completeTitle) {
    completeTitle.textContent = currentExercise.score === total ? 'Perfeito! 🌟' : 'Exercício Concluído! 🏆';
  }

  const completeSubtitle = document.getElementById('completeSubtitle');
  if (completeSubtitle) {
    completeSubtitle.innerHTML = \`Você acertou <strong>\${currentExercise.score} de \${total}</strong> tarefas nesta lição.\`;
  }

  const completeXpBadge = document.getElementById('completeXpBadge');
  if (completeXpBadge) {
    completeXpBadge.textContent = \`⚡ +\${earnedXp} XP Ganhos\`;
  }

  const retryBtn = document.getElementById('retryExerciseBtn');
  if (retryBtn) {
    retryBtn.onclick = () => {
      if (currentExercise.lessonId) {
        launchPracticeLesson(currentExercise.lessonId);
      } else {
        startGeneralPractice();
      }
    };
  }

  updateUI();
}

// ============================================================================
// Profile & Settings
// ============================================================================

function handleProfileSave(e) {
  e.preventDefault();
  const input = document.getElementById('userName');
  const goalSelect = document.getElementById('dailyGoal');

  if (input && input.value.trim()) {
    appState.name = input.value.trim();
  }
  if (goalSelect) {
    appState.dailyGoal = parseInt(goalSelect.value, 10) || 50;
  }

  saveState();
  updateUI();
  playSound('click');
  showToast('✓ Perfil atualizado com sucesso!', 'success');
}

function handleResetProgress() {
  const confirmed = confirm('Tem certeza de que deseja resetar todo o seu progresso? Esta ação não pode ser desfeita.');
  if (confirmed) {
    localStorage.removeItem(STORAGE_KEY);
    appState = {
      name: 'Aprendiz',
      xp: 0,
      streak: 1,
      completedLessons: [],
      lastActiveDate: getTodayString(),
      dailyXP: 0,
      dailyGoal: 50,
      theme: 'light',
      achievements: [],
      currentLanguageFilter: 'all',
      currentSearchQuery: '',
      practiceLanguage: 'en'
    };
    saveState();
    updateUI();
    playSound('wrong');
    showToast('Progresso resetado com sucesso.', 'info');
  }
}

// ============================================================================
// Theme & Toasts
// ============================================================================

function toggleTheme() {
  const nextTheme = document.body.classList.contains('dark') ? 'light' : 'dark';
  applyTheme(nextTheme);
  appState.theme = nextTheme;
  saveState();
  playSound('click');
}

function applyTheme(theme) {
  const toggleBtn = document.getElementById('themeToggle');
  if (theme === 'dark') {
    document.body.classList.add('dark');
    if (toggleBtn) {
      toggleBtn.textContent = '☀️';
      toggleBtn.setAttribute('title', 'Ativar modo claro');
      toggleBtn.setAttribute('aria-label', 'Ativar modo claro');
    }
  } else {
    document.body.classList.remove('dark');
    if (toggleBtn) {
      toggleBtn.textContent = '🌙';
      toggleBtn.setAttribute('title', 'Ativar modo escuro');
      toggleBtn.setAttribute('aria-label', 'Ativar modo escuro');
    }
  }
}

function showToast(message, type = 'info') {
  let toastContainer = document.getElementById('toastContainer');
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.id = 'toastContainer';
    toastContainer.style.cssText = 'position: fixed; bottom: 24px; right: 24px; z-index: 9999; display: flex; flex-direction: column; gap: 10px; pointer-events: none;';
    document.body.appendChild(toastContainer);
  }

  const toast = document.createElement('div');
  const bg = type === 'success' ? 'var(--success)' : type === 'wrong' ? 'var(--danger)' : 'var(--primary)';
  toast.style.cssText = \`background: \${bg}; color: #ffffff; padding: 12px 20px; border-radius: var(--radius-md); box-shadow: var(--shadow-lg); font-weight: 600; font-size: 0.95rem; pointer-events: auto; animation: toastIn 0.3s ease both;\`;
  toast.textContent = message;

  toastContainer.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 3200);
}

// ============================================================================
// Initialization & Global Event Listeners
// ============================================================================

document.addEventListener('DOMContentLoaded', () => {
  loadState();
  applyTheme(appState.theme || 'light');
  updateUI();

  // Navigation via data-page in sidebar
  document.querySelectorAll('.nav-item[data-page]').forEach(btn => {
    btn.addEventListener('click', () => {
      const page = btn.getAttribute('data-page');
      playSound('click');
      navigateToPage(page);
    });
  });

  // Global delegation for data-go buttons anywhere (including dynamic items)
  document.addEventListener('click', (e) => {
    const goBtn = e.target.closest('[data-go]');
    if (goBtn) {
      const page = goBtn.getAttribute('data-go');
      playSound('click');
      if (page === 'practice' && !currentExercise.lessonId) {
        startGeneralPractice();
      } else {
        navigateToPage(page);
      }
    }
  });

  // Mobile menu toggle
  const menuToggle = document.getElementById('menuToggle');
  const sidebar = document.getElementById('sidebar');
  if (menuToggle && sidebar) {
    menuToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      sidebar.classList.toggle('open');
      playSound('click');
    });
  }

  // Close sidebar on mobile when clicking outside
  document.addEventListener('click', (e) => {
    if (window.innerWidth <= 960) {
      const s = document.getElementById('sidebar');
      const toggle = document.getElementById('menuToggle');
      if (s && s.classList.contains('open')) {
        if (!s.contains(e.target) && !toggle.contains(e.target)) {
          s.classList.remove('open');
        }
      }
    }
  });

  // Theme toggle
  const themeToggle = document.getElementById('themeToggle');
  if (themeToggle) {
    themeToggle.addEventListener('click', toggleTheme);
  }

  // Avatar button opens profile
  const avatarBtn = document.getElementById('avatarButton');
  if (avatarBtn) {
    avatarBtn.addEventListener('click', () => navigateToPage('profile'));
  }

  // Help button in sidebar
  const helpBtn = document.getElementById('helpButton');
  if (helpBtn) {
    helpBtn.addEventListener('click', () => {
      showToast('💡 Dica: Complete as 10 tarefas de cada unidade para fixar o vocabulário!', 'info');
      playSound('click');
    });
  }

  // Lesson search input & Keyboard shortcut "/"
  const searchInput = document.getElementById('lessonSearch');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      appState.currentSearchQuery = e.target.value;
      renderLessonsList();
    });
    window.addEventListener('keydown', (e) => {
      if (e.key === '/' && document.activeElement !== searchInput) {
        e.preventDefault();
        searchInput.focus();
      }
      if (e.key === 'Escape' && document.activeElement === searchInput) {
        searchInput.blur();
      }
    });
  }

  // Lesson language filter chips
  document.querySelectorAll('#lessonFilters .filter-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      document.querySelectorAll('#lessonFilters .filter-chip').forEach(c => {
        c.classList.remove('selected');
        c.classList.remove('active');
      });
      chip.classList.add('selected');
      chip.classList.add('active');
      appState.currentLanguageFilter = chip.getAttribute('data-language') || 'all';
      playSound('click');
      renderLessonsList();
    });
  });

  // Exercise Buttons
  const checkBtn = document.getElementById('checkAnswer');
  if (checkBtn) checkBtn.addEventListener('click', handleCheckAnswer);

  const nextBtn = document.getElementById('nextQuestion');
  if (nextBtn) nextBtn.addEventListener('click', handleNextQuestion);

  // Profile Form
  const profileForm = document.getElementById('profileForm');
  if (profileForm) profileForm.addEventListener('submit', handleProfileSave);

  const resetBtn = document.getElementById('resetProgress');
  if (resetBtn) resetBtn.addEventListener('click', handleResetProgress);

  // Set initial default practice if on practice tab
  if (!currentExercise.lessonId) {
    const firstLesson = LESSONS[0];
    currentExercise = {
      lessonId: firstLesson.id,
      language: firstLesson.language,
      title: firstLesson.title,
      questions: firstLesson.questions,
      currentIndex: 0,
      selectedAnswer: null,
      score: 0,
      xpReward: firstLesson.xp
    };
    renderCurrentQuestion();
  }
});
\`;

fs.writeFileSync('script.js', scriptTemplate, 'utf8');
console.log('script.js successfully generated! Total lessons: ' + allLessons.length + ', Total tasks: ' + (allLessons.length * 10));
