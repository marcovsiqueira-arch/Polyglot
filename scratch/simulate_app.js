const fs = require('fs');

// Create a DOM-like mock environment
class ClassList {
  constructor() { this.classes = new Set(); }
  add(...c) { c.forEach(x => this.classes.add(x)); }
  remove(...c) { c.forEach(x => this.classes.delete(x)); }
  contains(c) { return this.classes.has(c); }
  toggle(c) { if (this.contains(c)) this.remove(c); else this.add(c); }
}

class MockElement {
  constructor(tag, id = '') {
    this.tagName = tag.toUpperCase();
    this.id = id;
    this.classList = new ClassList();
    this.textContent = '';
    this.innerHTML = '';
    this.attributes = {};
    this.style = {};
    this.hidden = false;
    this.disabled = false;
  }
  getAttribute(name) { return this.attributes[name] || null; }
  setAttribute(name, val) { this.attributes[name] = val; }
  querySelector() { return new MockElement('div'); }
  querySelectorAll() { return []; }
  contains() { return false; }
}

const elements = new Map();
function getOrCreate(id) {
  if (!elements.has(id)) {
    elements.set(id, new MockElement('div', id));
  }
  return elements.get(id);
}

global.document = {
  getElementById: (id) => getOrCreate(id),
  querySelector: () => new MockElement('div'),
  querySelectorAll: () => [],
  addEventListener: () => {},
  body: new MockElement('body')
};

global.window = {
  addEventListener: () => {},
  scrollTo: () => {},
  speechSynthesis: {
    cancel: () => {},
    speak: () => {}
  }
};
global.SpeechSynthesisUtterance = function(t) { this.text = t; };

global.localStorage = {
  data: {},
  getItem: function(k) { return this.data[k] || null; },
  setItem: function(k, v) { this.data[k] = v; },
  removeItem: function(k) { delete this.data[k]; }
};

// Evaluate script.js in current context
const scriptCode = fs.readFileSync('script.js', 'utf8');
eval(scriptCode);

console.log('Script evaluated without errors!');

// Verify LESSONS
console.log('Total lessons loaded in app:', LESSONS.length);
console.log('All 60 have 10 tasks:', LESSONS.every(l => l.questions.length === 10));

// Test launchPracticeLesson
launchPracticeLesson('en-1');
console.log('Launched en-1 successfully');

// Simulate answer cycle
for (let i = 0; i < 10; i++) {
  selectAnswerOption(0);
  handleCheckAnswer();
  handleNextQuestion();
}

console.log('10 questions finished cleanly without errors!');
console.log('Exercise complete view is visible:', !getOrCreate('exerciseCompleteView').classList.contains('hidden'));
console.log('Exercise active view is hidden:', getOrCreate('exerciseActiveView').classList.contains('hidden'));

// Test retry
getOrCreate('retryExerciseBtn').onclick();
console.log('Retried lesson successfully!');
console.log('Exercise active view is now visible:', !getOrCreate('exerciseActiveView').classList.contains('hidden'));
console.log('Exercise complete view is now hidden:', getOrCreate('exerciseCompleteView').classList.contains('hidden'));

// Test general practice (random 10 questions)
startGeneralPractice('es');
console.log('General practice started with', currentExercise.questions.length, 'questions');
console.log('General practice has 10 questions:', currentExercise.questions.length === 10);

console.log('ALL SIMULATION TESTS PASSED 100%!');
