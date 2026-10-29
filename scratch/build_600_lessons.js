// scratch/build_600_lessons.js
const fs = require('fs');

function makeQ(prompt, speech, emoji, instruction, correctOpt, wrongOpts, explanation) {
  const options = [correctOpt, ...wrongOpts];
  // Deterministic shuffle
  const idx = Math.abs(prompt.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0)) % 4;
  const temp = options[0];
  options[0] = options[idx];
  options[idx] = temp;

  return {
    prompt,
    speech,
    emoji,
    instruction: instruction || 'Escolha a opção correta',
    options,
    answer: idx,
    explanation
  };
}

console.log('Generating 60 units with 10 questions each...');
