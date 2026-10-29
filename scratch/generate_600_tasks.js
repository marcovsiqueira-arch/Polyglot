// scratch/generate_600_tasks.js
const fs = require('fs');

// We define a comprehensive generator that builds 10 varied, realistic, educational questions for each of the 60 units.
// Every question has: prompt, speech, emoji, instruction, options (4 items), answer (0), explanation.
// We shuffle options so the correct answer is well-distributed.

function shuffleOptions(prompt, speech, emoji, instruction, correctOpt, wrongOpts, explanation) {
  const allOpts = [correctOpt, ...wrongOpts];
  // Simple deterministic shuffle based on prompt string length
  const targetIndex = (prompt.length) % 4;
  const temp = allOpts[0];
  allOpts[0] = allOpts[targetIndex];
  allOpts[targetIndex] = temp;

  return {
    prompt,
    speech,
    emoji,
    instruction,
    options: allOpts,
    answer: targetIndex,
    explanation
  };
}

console.log('Building all 60 units with 10 tasks each...');
