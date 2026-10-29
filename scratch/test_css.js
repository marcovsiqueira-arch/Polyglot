const fs = require('fs');
const css = fs.readFileSync('style.css', 'utf8');

const classes = [
  'dark', 'hidden', 'app-shell', 'sidebar', 'main-area', 'topbar',
  'btn', 'btn-primary', 'btn-outline', 'lesson-card', 'lesson-card-top',
  'lesson-badge', 'lesson-start-btn', 'answer-option', 'feedback',
  'ranking-row', 'achievement-badge'
];

classes.forEach(c => {
  const has = css.includes('.' + c);
  console.log(`Class .${c}: ${has ? 'FOUND' : 'MISSING'}`);
});
