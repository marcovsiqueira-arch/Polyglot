const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

console.log('Includes style.css:', html.includes('style.css'));
console.log('Includes script.js:', html.includes('script.js'));

const ids = [
  'sidebar', 'menuToggle', 'pageName', 'themeToggle', 'headerXP', 'avatarButton',
  'page-home', 'welcomeName', 'totalXP', 'streakStat', 'completedStat', 'todayLabel',
  'goalCurrent', 'goalTarget', 'goalProgress', 'goalMessage', 'languageList',
  'page-lessons', 'lessonSearch', 'lessonFilters', 'lessonCount', 'lessonGrid',
  'page-practice', 'exercisePanel', 'exerciseActiveView', 'exerciseCompleteView',
  'questionCounter', 'exerciseProgress', 'questionEmoji', 'questionInstruction',
  'questionText', 'audioButton', 'answerList', 'feedback', 'checkAnswer', 'nextQuestion',
  'completeTitle', 'completeSubtitle', 'completeXpBadge', 'retryExerciseBtn',
  'page-ranking', 'rankingTable',
  'page-profile', 'profileDisplayName', 'profileAvatar', 'userName', 'dailyGoal', 'profileForm', 'resetProgress', 'achievements'
];

let missing = 0;
ids.forEach(id => {
  if (!html.includes(`id="${id}"`)) {
    console.error('Missing ID:', id);
    missing++;
  }
});

if (missing === 0) {
  console.log('All essential IDs present in index.html! (Checked ' + ids.length + ' IDs)');
}
