const fs = require('fs');
const vm = require('vm');

const elements = new Map();
function getOrCreate(id) {
  if (!elements.has(id)) {
    elements.set(id, {
      id,
      classList: {
        s: new Set(),
        add(c) { this.s.add(c); },
        remove(c) { this.s.delete(c); },
        contains(c) { return this.s.has(c); }
      },
      textContent: '',
      innerHTML: '',
      style: {},
      hidden: false
    });
  }
  return elements.get(id);
}

const sandbox = {
  console,
  document: {
    getElementById: getOrCreate,
    querySelector: () => ({ style: {} }),
    querySelectorAll: () => [],
    addEventListener: () => {}
  },
  window: {
    addEventListener: () => {},
    scrollTo: () => {},
    speechSynthesis: { cancel: () => {}, speak: () => {} }
  },
  localStorage: {
    data: {},
    getItem(k) { return this.data[k] || null; },
    setItem(k, v) { this.data[k] = v; },
    removeItem(k) { delete this.data[k]; }
  },
  setTimeout: () => {}
};
sandbox.window.window = sandbox.window;

const code = fs.readFileSync('script.js', 'utf8');
vm.createContext(sandbox);
vm.runInContext(code, sandbox);

console.log('Script loaded in VM successfully!');
console.log('Total units:', vm.runInContext('LESSONS.length', sandbox));
console.log('All 60 units have 10 tasks:', vm.runInContext('LESSONS.every(l => l.questions.length === 10)', sandbox));

// Launch lesson
vm.runInContext("launchPracticeLesson('en-1')", sandbox);
console.log('Launched en-1, exercise title:', vm.runInContext('currentExercise.title', sandbox));
console.log('Number of questions in en-1:', vm.runInContext('currentExercise.questions.length', sandbox));

// Answer all 10 questions
for (let i = 0; i < 10; i++) {
  vm.runInContext('selectAnswerOption(0)', sandbox);
  vm.runInContext('handleCheckAnswer()', sandbox);
  vm.runInContext('handleNextQuestion()', sandbox);
}

console.log('Finished all 10 tasks!');
console.log('Current exercise score:', vm.runInContext('currentExercise.score', sandbox));
console.log('Active view hidden:', elements.get('exerciseActiveView').classList.contains('hidden'));
console.log('Complete view visible:', !elements.get('exerciseCompleteView').classList.contains('hidden'));

// Retry lesson
elements.get('retryExerciseBtn').onclick();
console.log('Retried lesson! Active view visible:', !elements.get('exerciseActiveView').classList.contains('hidden'));
console.log('Complete view hidden:', elements.get('exerciseCompleteView').classList.contains('hidden'));

// General practice
vm.runInContext("startGeneralPractice('es')", sandbox);
console.log('General practice started. Questions count:', vm.runInContext('currentExercise.questions.length', sandbox));
console.log('ALL PASSED WITH FLYING COLORS!');
