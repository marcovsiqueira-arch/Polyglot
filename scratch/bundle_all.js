const fs = require('fs');

const en = JSON.parse(fs.readFileSync('scratch/lessons_en.json', 'utf8'));
const es = JSON.parse(fs.readFileSync('scratch/lessons_es.json', 'utf8'));
const pt = JSON.parse(fs.readFileSync('scratch/lessons_pt.json', 'utf8'));

const allLessons = [...en, ...es, ...pt];

const origScript = fs.readFileSync('script.js', 'utf8');
const lines = origScript.split('\n');

// Part 1: from start up to before "const LESSONS =" (line 187)
const cutStart = lines.findIndex(l => l.startsWith('const LESSONS ='));
const part1 = lines.slice(0, cutStart).join('\n');

// Part 2: after the old LESSONS array ends (line 745)
const cutEnd = lines.findIndex((l, idx) => idx > cutStart && l.startsWith('// Achievements Definitions'));
let part2 = lines.slice(cutEnd).join('\n');

// Surgical fixes in part2:

// 1. In renderCurrentQuestion: ensure views toggle
const renderQSignature = 'function renderCurrentQuestion() {';
const renderQReplacement = `function renderCurrentQuestion() {
  const activeView = document.getElementById('exerciseActiveView');
  const completeView = document.getElementById('exerciseCompleteView');
  if (activeView) activeView.classList.remove('hidden');
  if (completeView) completeView.classList.add('hidden');`;

part2 = part2.replace(renderQSignature, renderQReplacement);

// 2. In startGeneralPractice: make it 10 questions
part2 = part2.replace(
  'slice(0, 4);',
  'slice(0, 10);'
);

// 3. Make launchPracticeLesson explicitly on window
part2 = part2.replace(
  'function launchPracticeLesson(lessonId) {',
  'window.launchPracticeLesson = function(lessonId) {'
);

// 4. In finishExercise: toggle views instead of destroying innerHTML
const oldFinishRegex = /function finishExercise\(\) \{[\s\S]*?\n\}\n\n\/\/ ============================================================================\n\/\/ Profile/m;

const newFinishCode = `function finishExercise() {
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

  // Toggle views without wiping DOM
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
        window.launchPracticeLesson(currentExercise.lessonId);
      } else {
        startGeneralPractice();
      }
    };
  }

  updateUI();
}

// ============================================================================
// Profile`;

part2 = part2.replace(oldFinishRegex, newFinishCode);

// 5. In renderLanguagesHome: indicate 10 tasks per unit
part2 = part2.replace(
  '<p>${done} de ${l.total} lições concluídas</p>',
  '<p>${done} de ${l.total} lições concluídas (10 tarefas cada)</p>'
);

// 6. Add global delegation for [data-go] and mobile sidebar dismiss
const oldDataGoBlock = `  // Navigation via data-go buttons anywhere
  document.querySelectorAll('[data-go]').forEach(btn => {
    btn.addEventListener('click', () => {
      const page = btn.getAttribute('data-go');
      playSound('click');
      if (page === 'practice' && !currentExercise.lessonId) {
        startGeneralPractice();
      } else {
        navigateToPage(page);
      }
    });
  });`;

const newDataGoBlock = `  // Global delegation for data-go buttons anywhere (including dynamic items)
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

  // Close mobile sidebar when clicking outside
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
  });`;

part2 = part2.replace(oldDataGoBlock, newDataGoBlock);

// Assemble final script
const fullScript = `${part1}const LESSONS = ${JSON.stringify(allLessons, null, 2)};\n\n${part2}`;

fs.writeFileSync('script.js', fullScript, 'utf8');
console.log('script.js generated successfully!');
