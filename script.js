/**
 * Polyglot — Modern Language Learning Platform
 * Comprehensive 60-Unit Curriculum (English, Spanish, Portuguese A1 to B2),
 * Interactive Practice, Audio Pronunciation, Daily Goals, Dark Mode & Achievements
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
  lastActiveDate: getTodayString(),
  completedLessons: [],
  dailyXP: 0,
  dailyGoal: 15,
  dailyGoalDate: getTodayString(),
  achievements: [],
  theme: 'light',
  currentLanguageFilter: 'all',
  currentSearchQuery: '',
  practiceLanguage: 'en'
};

function loadState() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      appState = { ...appState, ...parsed };
    } else {
      // Migrate from prior version if exists
      const prev = localStorage.getItem('polyglot_user_state_v2') || localStorage.getItem('polyglot_user_state_v1');
      if (prev) {
        const p = JSON.parse(prev);
        if (p.name && p.name !== 'Estudante') appState.name = p.name;
        if (p.xp) appState.xp = p.xp;
        if (p.streak) appState.streak = p.streak;
        if (p.completedLessons) appState.completedLessons = p.completedLessons;
      }
    }
    checkDailyReset();
    checkStreak();
  } catch (err) {
    console.error('Error loading state:', err);
  }
}

function saveState() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(appState));
  } catch (err) {
    console.error('Error saving state:', err);
  }
}

function checkDailyReset() {
  const today = getTodayString();
  if (appState.dailyGoalDate !== today) {
    appState.dailyGoalDate = today;
    appState.dailyXP = 0;
    saveState();
  }
}

function checkStreak() {
  const today = getTodayString();
  if (!appState.lastActiveDate) {
    appState.lastActiveDate = today;
    return;
  }
  const last = new Date(appState.lastActiveDate);
  const curr = new Date(today);
  const diffDays = Math.floor((curr - last) / (1000 * 60 * 60 * 24));

  if (diffDays > 1) {
    appState.streak = 1;
    appState.lastActiveDate = today;
    saveState();
  }
}

function recordActivity(xpGained = 0) {
  const today = getTodayString();
  if (appState.lastActiveDate !== today) {
    appState.streak = (appState.streak || 0) + 1;
    appState.lastActiveDate = today;
  }
  appState.dailyXP += xpGained;
  checkAchievements();
  saveState();
  updateUI();
}

// ============================================================================
// Audio System (Text-to-Speech & Web Audio Synthesizer)
// ============================================================================

let audioCtx = null;

function getAudioContext() {
  if (!audioCtx) {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (AudioContext) audioCtx = new AudioContext();
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

    if (type === 'correct') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(523.25, now);
      osc.frequency.exponentialRampToValueAtTime(783.99, now + 0.12);
      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
      osc.start(now);
      osc.stop(now + 0.3);
    } else if (type === 'wrong') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.exponentialRampToValueAtTime(140, now + 0.22);
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.26);
      osc.start(now);
      osc.stop(now + 0.26);
    } else if (type === 'level-up') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.setValueAtTime(554.37, now + 0.08);
      osc.frequency.setValueAtTime(659.25, now + 0.16);
      osc.frequency.setValueAtTime(880, now + 0.24);
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);
      osc.start(now);
      osc.stop(now + 0.45);
    } else if (type === 'click') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(650, now);
      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);
      osc.start(now);
      osc.stop(now + 0.06);
    }
  } catch (e) {
    console.warn('Audio note warning:', e);
  }
}

function speakText(text, langCode = 'en') {
  if (!('speechSynthesis' in window)) return;
  try {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    if (langCode === 'en' || langCode === 'Inglês') utterance.lang = 'en-US';
    else if (langCode === 'es' || langCode === 'Espanhol') utterance.lang = 'es-ES';
    else if (langCode === 'pt' || langCode === 'Português') utterance.lang = 'pt-BR';
    utterance.rate = 0.92;
    window.speechSynthesis.speak(utterance);
  } catch (e) {
    console.warn('Speech error:', e);
  }
}

// ============================================================================
// COMPLETE 60-UNIT CURRICULUM (20 English, 20 Spanish, 20 Portuguese)
// ============================================================================
const LESSONS = [
  {
    "id": "en-1",
    "language": "en",
    "level": "A1 · Iniciante",
    "emoji": "🔤",
    "title": "Alfabeto & Sons Fundamentais",
    "description": "Domine as vogais, dígrafos e sons das consoantes em inglês.",
    "xp": 20,
    "questions": [
      {
        "prompt": "Como se pronuncia a letra \"A\" no alfabeto?",
        "speech": "A",
        "emoji": "🔤",
        "instruction": "Escolha a pronúncia correta",
        "options": [
          "Ah",
          "Ei",
          "Ai",
          "Ou"
        ],
        "answer": 1,
        "explanation": "A letra \"A\" soa como \"Ei\" em palavras como \"Name\"."
      },
      {
        "prompt": "Qual palavra tem o som de \"th\" suave entre os dentes?",
        "speech": "Thanks",
        "emoji": "🗣️",
        "instruction": "Selecione a palavra com \"th\"",
        "options": [
          "Tree",
          "Thanks",
          "Tank",
          "Tom"
        ],
        "answer": 1,
        "explanation": "\"Thanks\" pronuncia-se colocando a ponta da língua nos dentes."
      },
      {
        "prompt": "Como se pronuncia a letra \"E\" em inglês?",
        "speech": "E",
        "emoji": "🔤",
        "instruction": "Identifique a pronúncia",
        "options": [
          "Ou",
          "É",
          "Ei",
          "I"
        ],
        "answer": 3,
        "explanation": "A letra \"E\" soa como \"I\" (como em \"He\")."
      },
      {
        "prompt": "Como se pronuncia a letra \"I\" em inglês?",
        "speech": "I",
        "emoji": "🔤",
        "instruction": "Escolha o som da letra",
        "options": [
          "Eu",
          "I",
          "Ei",
          "Ai"
        ],
        "answer": 3,
        "explanation": "A letra \"I\" tem som de \"Ai\" (como em \"Hi\")."
      },
      {
        "prompt": "Qual palavra possui o som clássico de \"ch\" (tch)?",
        "speech": "Cheese",
        "emoji": "🧀",
        "instruction": "Selecione a palavra",
        "options": [
          "Character",
          "School",
          "Echo",
          "Cheese"
        ],
        "answer": 3,
        "explanation": "\"Cheese\" pronuncia-se com som de \"tch\"."
      },
      {
        "prompt": "Como soa a letra \"W\" no início de \"Water\"?",
        "speech": "Water",
        "emoji": "💧",
        "instruction": "Identifique o som inicial",
        "options": [
          "Som de \"U\" suave",
          "Som de \"V\"",
          "Som de \"D\"",
          "Mudo"
        ],
        "answer": 0,
        "explanation": "\"W\" tem som semivogal de \"U\"."
      },
      {
        "prompt": "Em qual palavra a letra \"H\" é aspirada?",
        "speech": "House",
        "emoji": "🏠",
        "instruction": "Escolha a palavra",
        "options": [
          "Honest",
          "Hour",
          "House",
          "Honor"
        ],
        "answer": 2,
        "explanation": "Em \"House\" o H é pronunciado aspirado."
      },
      {
        "prompt": "Como se pronuncia o \"R\" americano em \"Red\"?",
        "speech": "Red",
        "emoji": "🔴",
        "instruction": "Identifique o fonema",
        "options": [
          "Com a garganta",
          "Com a língua curvada para trás sem tocar o céu da boca",
          "Como o R brando do português",
          "Totalmente mudo"
        ],
        "answer": 1,
        "explanation": "O R americano é retroflexo."
      },
      {
        "prompt": "Qual palavra rima perfeitamente com \"cat\"?",
        "speech": "Hat",
        "emoji": "🐱",
        "instruction": "Selecione a rima",
        "options": [
          "Cot",
          "Cut",
          "Hat",
          "Kate"
        ],
        "answer": 2,
        "explanation": "\"Hat\" rima com \"cat\" pelo som aberto /æ/."
      },
      {
        "prompt": "Como se soletra a palavra \"DOG\" (Cachorro)?",
        "speech": "D-O-G",
        "emoji": "🐕",
        "instruction": "Identifique o soletrar",
        "options": [
          "Di - A - Gi",
          "De - O - Ge",
          "Da - U - Ga",
          "Di - Ou - Dji"
        ],
        "answer": 3,
        "explanation": "Soletrando: D (/diː/), O (/oʊ/), G (/dʒiː/)."
      }
    ]
  },
  {
    "id": "en-2",
    "language": "en",
    "level": "A1 · Iniciante",
    "emoji": "👋",
    "title": "Saudações & Verbo To Be",
    "description": "Aprenda a dizer olá, se apresentar e conjugar I am, You are, He is.",
    "xp": 20,
    "questions": [
      {
        "prompt": "Como se diz \"Meu nome é Lucas\"?",
        "speech": "My name is Lucas",
        "emoji": "👋",
        "instruction": "Escolha a tradução",
        "options": [
          "Lucas my is",
          "I name Lucas",
          "My call Lucas",
          "My name is Lucas"
        ],
        "answer": 3,
        "explanation": "\"My name is...\" é a apresentação padrão."
      },
      {
        "prompt": "Qual a resposta cordial para \"Nice to meet you\"?",
        "speech": "Nice to meet you too",
        "emoji": "🤝",
        "instruction": "Selecione a resposta",
        "options": [
          "Nice to meet you too",
          "Good night",
          "I am thirsty",
          "Please go away"
        ],
        "answer": 0,
        "explanation": "\"Nice to meet you too\" significa prazer em conhecê-lo também."
      },
      {
        "prompt": "Complete: \"I ___ a language student.\"",
        "speech": "I am a language student",
        "emoji": "📚",
        "instruction": "Complete com o verbo",
        "options": [
          "be",
          "is",
          "are",
          "am"
        ],
        "answer": 3,
        "explanation": "Com \"I\" usamos \"am\"."
      },
      {
        "prompt": "Complete: \"They ___ from Brazil.\"",
        "speech": "They are from Brazil",
        "emoji": "🇧🇷",
        "instruction": "Complete a frase",
        "options": [
          "are",
          "is",
          "am",
          "be"
        ],
        "answer": 0,
        "explanation": "Com \"They\" usamos \"are\"."
      },
      {
        "prompt": "Como se diz \"Bom dia\" em inglês?",
        "speech": "Good morning",
        "emoji": "🌅",
        "instruction": "Escolha a saudação",
        "options": [
          "Good afternoon",
          "Good morning",
          "Good night",
          "Good evening"
        ],
        "answer": 1,
        "explanation": "\"Good morning\" é usado pela manhã."
      },
      {
        "prompt": "Como se pergunta \"Como você está?\"?",
        "speech": "How are you?",
        "emoji": "💬",
        "instruction": "Selecione a pergunta",
        "options": [
          "Why are you?",
          "Who are you?",
          "Where are you?",
          "How are you?"
        ],
        "answer": 3,
        "explanation": "\"How are you?\" é a saudação de cortesia."
      },
      {
        "prompt": "Qual a diferença entre \"Good evening\" e \"Good night\"?",
        "speech": "Good evening and Good night",
        "emoji": "🌙",
        "instruction": "Escolha a diferença",
        "options": [
          "Good evening é à tarde",
          "São idênticos",
          "Good night é de manhã",
          "Good evening é ao chegar; Good night é despedida"
        ],
        "answer": 3,
        "explanation": "Usa-se Good evening na chegada e Good night na despedida."
      },
      {
        "prompt": "Complete: \"He ___ very smart.\"",
        "speech": "He is very smart",
        "emoji": "🧠",
        "instruction": "Complete com to be",
        "options": [
          "is",
          "are",
          "am",
          "be"
        ],
        "answer": 0,
        "explanation": "Com He/She/It usamos \"is\"."
      },
      {
        "prompt": "Como se diz \"De nada\" após um agradecimento?",
        "speech": "You are welcome",
        "emoji": "🙏",
        "instruction": "Escolha a resposta",
        "options": [
          "Please",
          "You are welcome",
          "Excuse me",
          "See you"
        ],
        "answer": 1,
        "explanation": "\"You are welcome\" significa \"De nada\"."
      },
      {
        "prompt": "Qual a contração de \"I am\"?",
        "speech": "I am",
        "emoji": "✏️",
        "instruction": "Selecione a forma contraída",
        "options": [
          "Ime",
          "I'am",
          "Im'",
          "I'm"
        ],
        "answer": 3,
        "explanation": "\"I am\" contrai-se para \"I'm\"."
      }
    ]
  },
  {
    "id": "en-3",
    "language": "en",
    "level": "A1 · Iniciante",
    "emoji": "⏰",
    "title": "Números, Horas & Dias",
    "description": "Conte até 100, marque reuniões e pergunte as horas.",
    "xp": 25,
    "questions": [
      {
        "prompt": "Como perguntar \"Que horas são?\" em inglês?",
        "speech": "What time is it?",
        "emoji": "⏰",
        "instruction": "Escolha a pergunta",
        "options": [
          "Where is time?",
          "How many hours?",
          "What time is it?",
          "Which hour now?"
        ],
        "answer": 2,
        "explanation": "\"What time is it?\" é a pergunta padrão."
      },
      {
        "prompt": "Como se diz \"Quarta-feira\"?",
        "speech": "Wednesday",
        "emoji": "📅",
        "instruction": "Selecione o dia",
        "options": [
          "Tuesday",
          "Thursday",
          "Wednesday",
          "Monday"
        ],
        "answer": 2,
        "explanation": "Wednesday é quarta-feira."
      },
      {
        "prompt": "Qual é o número \"50\" por extenso?",
        "speech": "Fifty",
        "emoji": "🔢",
        "instruction": "Escolha o número",
        "options": [
          "Fifteen",
          "Fifty",
          "Five",
          "Fivety"
        ],
        "answer": 1,
        "explanation": "50 é Fifty (15 é Fifteen)."
      },
      {
        "prompt": "Como se diz \"São 8 e meia\" (8:30)?",
        "speech": "Half past eight",
        "emoji": "🕗",
        "instruction": "Identifique as horas",
        "options": [
          "Half past eight",
          "Half to eight",
          "Eight thirty minutes",
          "Middle eight"
        ],
        "answer": 0,
        "explanation": "\"Half past eight\" ou \"Eight thirty\" indicam 8:30."
      },
      {
        "prompt": "Qual dia vem logo após a sexta-feira (Friday)?",
        "speech": "Saturday",
        "emoji": "🗓️",
        "instruction": "Identifique o dia",
        "options": [
          "Monday",
          "Sunday",
          "Saturday",
          "Thursday"
        ],
        "answer": 2,
        "explanation": "Saturday é sábado."
      },
      {
        "prompt": "Qual é o primeiro mês do ano?",
        "speech": "January",
        "emoji": "❄️",
        "instruction": "Escolha o mês",
        "options": [
          "January",
          "June",
          "July",
          "February"
        ],
        "answer": 0,
        "explanation": "Janeiro é January."
      },
      {
        "prompt": "Como se diz \"Meio-dia\" (12:00 PM)?",
        "speech": "Noon",
        "emoji": "☀️",
        "instruction": "Identifique o termo",
        "options": [
          "Noon",
          "Midnight",
          "Night",
          "Afternoon"
        ],
        "answer": 0,
        "explanation": "Noon significa meio-dia."
      },
      {
        "prompt": "Como se diz \"Meia-noite\" (12:00 AM)?",
        "speech": "Midnight",
        "emoji": "🌙",
        "instruction": "Identifique o termo",
        "options": [
          "Midnight",
          "Noon",
          "Darkness",
          "Midday"
        ],
        "answer": 0,
        "explanation": "Midnight significa meia-noite."
      },
      {
        "prompt": "Como se diz \"Hoje é meu aniversário\"?",
        "speech": "Today is my birthday",
        "emoji": "🎂",
        "instruction": "Escolha a frase",
        "options": [
          "Today has my birth",
          "Today is my birthday",
          "I am anniversary",
          "My year today"
        ],
        "answer": 1,
        "explanation": "Birthday é aniversário de nascimento."
      },
      {
        "prompt": "Qual preposição usamos antes de dias da semana?",
        "speech": "On Monday",
        "emoji": "📌",
        "instruction": "Complete a regra",
        "options": [
          "on",
          "in",
          "at",
          "by"
        ],
        "answer": 0,
        "explanation": "Usa-se \"on\" para dias: \"on Monday\"."
      }
    ]
  },
  {
    "id": "en-4",
    "language": "en",
    "level": "A1 · Iniciante",
    "emoji": "☕",
    "title": "Comidas, Bebidas & No Café",
    "description": "Faça pedidos educados em cafeterias e restaurantes.",
    "xp": 20,
    "questions": [
      {
        "prompt": "Como pedir um café educadamente?",
        "speech": "I would like a coffee, please",
        "emoji": "☕",
        "instruction": "Escolha o pedido educado",
        "options": [
          "I want coffee quickly",
          "Give me coffee right now",
          "I would like a coffee, please",
          "Coffee bring here"
        ],
        "answer": 2,
        "explanation": "\"I would like...\" significa \"Eu gostaria de...\"."
      },
      {
        "prompt": "Como se diz \"A conta, por favor\"?",
        "speech": "The check, please",
        "emoji": "🧾",
        "instruction": "Selecione a frase",
        "options": [
          "The count, please",
          "The check, please",
          "The price, now",
          "Money, please"
        ],
        "answer": 1,
        "explanation": "\"The check\" ou \"the bill\" refere-se à conta."
      },
      {
        "prompt": "Qual é a palavra para \"Água com gás\"?",
        "speech": "Sparkling water",
        "emoji": "💧",
        "instruction": "Escolha o termo",
        "options": [
          "Bubble drink",
          "Gas water",
          "Soda juice",
          "Sparkling water"
        ],
        "answer": 3,
        "explanation": "\"Sparkling water\" é água com gás."
      },
      {
        "prompt": "O que significa \"Breakfast\"?",
        "speech": "Breakfast",
        "emoji": "🍳",
        "instruction": "Identifique a refeição",
        "options": [
          "Almoço",
          "Café da manhã",
          "Jantar",
          "Lanche da tarde"
        ],
        "answer": 1,
        "explanation": "Breakfast é a primeira refeição do dia."
      },
      {
        "prompt": "Qual alimento significa \"Pão\"?",
        "speech": "Bread",
        "emoji": "🍞",
        "instruction": "Escolha a palavra",
        "options": [
          "Cheese",
          "Butter",
          "Bread",
          "Beef"
        ],
        "answer": 2,
        "explanation": "Bread é pão."
      },
      {
        "prompt": "Como se diz \"Eu sou vegetariano\"?",
        "speech": "I am vegetarian",
        "emoji": "🥗",
        "instruction": "Escolha a tradução",
        "options": [
          "I eat only grass",
          "I have vegetarian",
          "I am vegetarian",
          "No meat I am"
        ],
        "answer": 2,
        "explanation": "\"I am vegetarian\" é a frase correta."
      },
      {
        "prompt": "O que o garçom quer saber com: \"Are you ready to order?\"",
        "speech": "Are you ready to order?",
        "emoji": "📋",
        "instruction": "Interprete a pergunta",
        "options": [
          "Vocês já pagaram a conta?",
          "Vocês estão prontos para pedir?",
          "Onde vocês moram?",
          "A comida está fria?"
        ],
        "answer": 1,
        "explanation": "\"Ready to order\" significa pronto para fazer o pedido."
      },
      {
        "prompt": "Qual é a tradução de \"Delicious\"?",
        "speech": "Delicious",
        "emoji": "😋",
        "instruction": "Identifique o significado",
        "options": [
          "Apimentado",
          "Doce",
          "Salgado",
          "Delicioso / Muito gostoso"
        ],
        "answer": 3,
        "explanation": "Delicious significa delicioso."
      },
      {
        "prompt": "Como se diz \"Uma mesa para dois, por favor\"?",
        "speech": "A table for two, please",
        "emoji": "🍽️",
        "instruction": "Selecione a frase",
        "options": [
          "Table with two men",
          "Two chairs here",
          "A desk for pair",
          "A table for two, please"
        ],
        "answer": 3,
        "explanation": "\"A table for two, please\" é a solicitação usual."
      },
      {
        "prompt": "O que significa \"Tip\" em um restaurante nos EUA?",
        "speech": "Tip",
        "emoji": "💵",
        "instruction": "Identifique o termo",
        "options": [
          "Gorjeta para o garçom",
          "Cardápio de sobremesas",
          "A conta final",
          "Um tipo de prato"
        ],
        "answer": 0,
        "explanation": "Tip é a gorjeta nos EUA."
      }
    ]
  },
  {
    "id": "en-5",
    "language": "en",
    "level": "A1 · Iniciante",
    "emoji": "👨‍👩‍👧",
    "title": "Família & Pessoas Próximas",
    "description": "Fale sobre pais, irmãos, filhos e parentes.",
    "xp": 25,
    "questions": [
      {
        "prompt": "Como se diz \"Meus pais moram em Londres\"?",
        "speech": "My parents live in London",
        "emoji": "👨‍👩‍👧",
        "instruction": "Escolha a tradução",
        "options": [
          "My parents live in London",
          "My relatives lives in London",
          "My father mother in London",
          "My people live London"
        ],
        "answer": 0,
        "explanation": "\"Parents\" significa pais (pai e mãe). Parente é \"relative\"."
      },
      {
        "prompt": "Como se diz \"Irmão\" e \"Irmã\"?",
        "speech": "Brother and Sister",
        "emoji": "👫",
        "instruction": "Escolha o par",
        "options": [
          "Son and Daughter",
          "Father and Mother",
          "Brother and Sister",
          "Uncle and Aunt"
        ],
        "answer": 2,
        "explanation": "Brother é irmão e Sister é irmã."
      },
      {
        "prompt": "Qual é o termo para \"Avô\"?",
        "speech": "Grandfather",
        "emoji": "👴",
        "instruction": "Selecione a palavra",
        "options": [
          "Grandfather",
          "Father",
          "Uncle",
          "Nephew"
        ],
        "answer": 0,
        "explanation": "Grandfather é avô."
      },
      {
        "prompt": "Como se diz \"Filho\" e \"Filha\"?",
        "speech": "Son and Daughter",
        "emoji": "👶",
        "instruction": "Identifique os termos",
        "options": [
          "Nephew and Niece",
          "Boy and Girl",
          "Child and Little",
          "Son and Daughter"
        ],
        "answer": 3,
        "explanation": "Son é filho e Daughter é filha."
      },
      {
        "prompt": "O que significa \"Siblings\"?",
        "speech": "Siblings",
        "emoji": "👦👧",
        "instruction": "Escolha o significado",
        "options": [
          "Primos",
          "Irmãos e irmãs em geral",
          "Padrinhos",
          "Sobrinhos"
        ],
        "answer": 1,
        "explanation": "\"Siblings\" engloba irmãos de ambos os sexos."
      },
      {
        "prompt": "Como se diz \"Minha esposa\"?",
        "speech": "My wife",
        "emoji": "💍",
        "instruction": "Identifique o termo",
        "options": [
          "My wife",
          "My woman",
          "My girl",
          "My partneress"
        ],
        "answer": 0,
        "explanation": "Wife é esposa."
      },
      {
        "prompt": "Como se diz \"Meu marido trabalha aqui\"?",
        "speech": "My husband works here",
        "emoji": "💼",
        "instruction": "Escolha a frase",
        "options": [
          "My husband work here",
          "My man job here",
          "My husband works here",
          "My spouse is work"
        ],
        "answer": 2,
        "explanation": "Husband é marido e com he usa-se works com -s."
      },
      {
        "prompt": "Qual o significado de \"Uncle\" e \"Aunt\"?",
        "speech": "Uncle and Aunt",
        "emoji": "🏡",
        "instruction": "Identifique os parentes",
        "options": [
          "Sogro e Sogra",
          "Primo e Prima",
          "Tio e Tia",
          "Padrasto e Madrasta"
        ],
        "answer": 2,
        "explanation": "Uncle é tio e Aunt é tia."
      },
      {
        "prompt": "Como se diz \"Eu tenho dois primos\"?",
        "speech": "I have two cousins",
        "emoji": "👦👦",
        "instruction": "Selecione a frase",
        "options": [
          "I have two nephews",
          "I have two cousins",
          "I has two cousins",
          "I am with two cousins"
        ],
        "answer": 1,
        "explanation": "Cousin serve tanto para primo quanto para prima."
      },
      {
        "prompt": "Qual é o possessivo para \"dela\"?",
        "speech": "Her car",
        "emoji": "🚗",
        "instruction": "Escolha o possessivo",
        "options": [
          "Its",
          "His",
          "Her",
          "Their"
        ],
        "answer": 2,
        "explanation": "\"Her\" significa dela (his é dele)."
      }
    ]
  },
  {
    "id": "en-6",
    "language": "en",
    "level": "A2 · Básico",
    "emoji": "🏠",
    "title": "A Casa, Móveis & Cômodos",
    "description": "Vocabulário da sala, cozinha, quarto e banheiro.",
    "xp": 25,
    "questions": [
      {
        "prompt": "Onde fica a geladeira em uma casa?",
        "speech": "In the kitchen",
        "emoji": "🧊",
        "instruction": "Identifique o cômodo",
        "options": [
          "In the kitchen",
          "In the bedroom",
          "In the bathroom",
          "In the garden"
        ],
        "answer": 0,
        "explanation": "Kitchen é cozinha."
      },
      {
        "prompt": "Onde você dorme?",
        "speech": "In the bedroom",
        "emoji": "🛏️",
        "instruction": "Escolha o cômodo",
        "options": [
          "In the garage",
          "In the living room",
          "In the bedroom",
          "In the attic"
        ],
        "answer": 2,
        "explanation": "Bedroom é o quarto."
      },
      {
        "prompt": "Como se diz \"Sala de estar\"?",
        "speech": "Living room",
        "emoji": "🛋️",
        "instruction": "Identifique o termo",
        "options": [
          "Dining room",
          "Living room",
          "Restroom",
          "Hallway"
        ],
        "answer": 1,
        "explanation": "Living room é a sala de estar."
      },
      {
        "prompt": "Qual móvel significa \"Mesa\"?",
        "speech": "Table",
        "emoji": "🪑",
        "instruction": "Escolha a palavra",
        "options": [
          "Table",
          "Chair",
          "Couch",
          "Shelf"
        ],
        "answer": 0,
        "explanation": "Table é mesa."
      },
      {
        "prompt": "Como se diz \"Eu moro em um apartamento\"?",
        "speech": "I live in an apartment",
        "emoji": "🏢",
        "instruction": "Selecione a frase",
        "options": [
          "I live on flat",
          "I stay in home",
          "I have apartment",
          "I live in an apartment"
        ],
        "answer": 3,
        "explanation": "Usa-se \"I live in an apartment\"."
      },
      {
        "prompt": "O que significa \"Mirror\"?",
        "speech": "Mirror",
        "emoji": "🪞",
        "instruction": "Identifique o objeto",
        "options": [
          "Janela",
          "Espelho",
          "Tapete",
          "Armário"
        ],
        "answer": 1,
        "explanation": "Mirror é espelho."
      },
      {
        "prompt": "Como se diz \"Abra a janela, por favor\"?",
        "speech": "Open the window, please",
        "emoji": "🪟",
        "instruction": "Escolha a frase",
        "options": [
          "Close the door now",
          "Open the window, please",
          "Clean the glass",
          "Break the window"
        ],
        "answer": 1,
        "explanation": "Window é janela."
      },
      {
        "prompt": "Onde você toma banho?",
        "speech": "In the bathroom",
        "emoji": "🚿",
        "instruction": "Identifique o local",
        "options": [
          "In the bathroom",
          "In the kitchen",
          "In the office",
          "In the balcony"
        ],
        "answer": 0,
        "explanation": "Bathroom é o banheiro."
      },
      {
        "prompt": "Qual é a preposição em \"The keys are ___ the table\"?",
        "speech": "On the table",
        "emoji": "🔑",
        "instruction": "Escolha a preposição",
        "options": [
          "on",
          "in",
          "at",
          "under"
        ],
        "answer": 0,
        "explanation": "Usa-se \"on\" para sobre uma superfície."
      },
      {
        "prompt": "Como se diz \"Telhado\"?",
        "speech": "Roof",
        "emoji": "🏠",
        "instruction": "Identifique a parte da casa",
        "options": [
          "Floor",
          "Roof",
          "Wall",
          "Ceiling"
        ],
        "answer": 1,
        "explanation": "Roof é o telhado externo."
      }
    ]
  },
  {
    "id": "en-7",
    "language": "en",
    "level": "A2 · Básico",
    "emoji": "🌅",
    "title": "Rotina Diária & Simple Present",
    "description": "Conjugue verbos e use o \"-s\" na terceira pessoa.",
    "xp": 30,
    "questions": [
      {
        "prompt": "Complete: \"He ___ up at 7 AM every day.\"",
        "speech": "He wakes up at 7 AM",
        "emoji": "⏰",
        "instruction": "Conjugue o verbo",
        "options": [
          "is wake",
          "wake",
          "waking",
          "wakes"
        ],
        "answer": 3,
        "explanation": "3ª pessoa singular recebe -s: wakes."
      },
      {
        "prompt": "Como se diz \"Eu tomo banho pela manhã\"?",
        "speech": "I take a shower in the morning",
        "emoji": "🚿",
        "instruction": "Escolha a frase",
        "options": [
          "I do shower early",
          "I make a bath today",
          "I take a shower in the morning",
          "I am shower now"
        ],
        "answer": 2,
        "explanation": "\"Take a shower\" é tomar banho."
      },
      {
        "prompt": "Qual auxiliar usamos para perguntas no presente com \"You\"?",
        "speech": "Do you work here?",
        "emoji": "❓",
        "instruction": "Identifique o auxiliar",
        "options": [
          "Does",
          "Do",
          "Is",
          "Are"
        ],
        "answer": 1,
        "explanation": "Usa-se \"Do\" com I/you/we/they."
      },
      {
        "prompt": "Qual auxiliar usamos para perguntas com \"She\"?",
        "speech": "Does she live here?",
        "emoji": "❓",
        "instruction": "Identifique o auxiliar",
        "options": [
          "Do",
          "Does",
          "Has",
          "Is"
        ],
        "answer": 1,
        "explanation": "Usa-se \"Does\" com he/she/it."
      },
      {
        "prompt": "O que significa o advérbio \"Always\"?",
        "speech": "Always",
        "emoji": "🔄",
        "instruction": "Identifique o significado",
        "options": [
          "Às vezes",
          "Nunca",
          "Sempre",
          "Raramente"
        ],
        "answer": 2,
        "explanation": "Always significa sempre."
      },
      {
        "prompt": "O que significa \"Never\"?",
        "speech": "Never",
        "emoji": "🚫",
        "instruction": "Identifique o significado",
        "options": [
          "Talvez",
          "Sempre",
          "Nunca",
          "Logo"
        ],
        "answer": 2,
        "explanation": "Never significa nunca."
      },
      {
        "prompt": "Como se diz \"Ele escova os dentes\"?",
        "speech": "He brushes his teeth",
        "emoji": "🪥",
        "instruction": "Selecione a frase",
        "options": [
          "He brushes his teeth",
          "He clean teeth",
          "He brush tooth",
          "He does teeth"
        ],
        "answer": 0,
        "explanation": "Brushes recebe -es na 3ª pessoa."
      },
      {
        "prompt": "Complete: \"They ___ soccer on weekends.\"",
        "speech": "They play soccer on weekends",
        "emoji": "⚽",
        "instruction": "Complete com o verbo",
        "options": [
          "playing",
          "plays",
          "play",
          "are play"
        ],
        "answer": 2,
        "explanation": "Com They o verbo fica na forma base: play."
      },
      {
        "prompt": "Como se diz \"Eu costumo ler antes de dormir\"?",
        "speech": "I usually read before sleeping",
        "emoji": "📖",
        "instruction": "Escolha a frase",
        "options": [
          "I usually read before sleeping",
          "I always sleep reading",
          "I read for bed",
          "I do read sleep"
        ],
        "answer": 0,
        "explanation": "\"Usually\" significa habitualmente / costumo."
      },
      {
        "prompt": "Qual a forma negativa de \"He works\"?",
        "speech": "He does not work",
        "emoji": "💼",
        "instruction": "Identifique a negação",
        "options": [
          "He does not works",
          "He not work",
          "He no works",
          "He does not work"
        ],
        "answer": 3,
        "explanation": "Com o auxiliar \"does not\", o verbo principal volta à forma base."
      }
    ]
  },
  {
    "id": "en-8",
    "language": "en",
    "level": "A2 · Básico",
    "emoji": "🗺️",
    "title": "Na Cidade & Pedindo Direções",
    "description": "Aprenda turn left, turn right e go straight.",
    "xp": 30,
    "questions": [
      {
        "prompt": "O que significa \"Go straight and turn left\"?",
        "speech": "Go straight and turn left",
        "emoji": "🧭",
        "instruction": "Escolha o sentido",
        "options": [
          "Vire à direita na praça",
          "Siga em frente e vire à esquerda",
          "Atravesse a rua e pare",
          "Volte duas quadras"
        ],
        "answer": 1,
        "explanation": "\"Go straight\" = siga em frente; \"Turn left\" = vire à esquerda."
      },
      {
        "prompt": "Como perguntar \"Onde fica o banco mais próximo?\"?",
        "speech": "Where is the nearest bank?",
        "emoji": "🏦",
        "instruction": "Selecione a pergunta",
        "options": [
          "Where does bank go?",
          "How is bank near?",
          "What bank has here?",
          "Where is the nearest bank?"
        ],
        "answer": 3,
        "explanation": "\"Nearest\" significa o mais próximo."
      },
      {
        "prompt": "Como se diz \"Vire à direita\"?",
        "speech": "Turn right",
        "emoji": "➡️",
        "instruction": "Identifique a direção",
        "options": [
          "Turn right",
          "Turn left",
          "Go straight",
          "Stop here"
        ],
        "answer": 0,
        "explanation": "Turn right é vire à direita."
      },
      {
        "prompt": "Como se chama a \"Faixa de pedestres\"?",
        "speech": "Crosswalk",
        "emoji": "🚶",
        "instruction": "Identifique o termo",
        "options": [
          "Sidewalk",
          "Crosswalk",
          "Highway",
          "Bridge"
        ],
        "answer": 1,
        "explanation": "Crosswalk (ou zebra crossing) é faixa de pedestres."
      },
      {
        "prompt": "O que significa \"Between\"?",
        "speech": "Between the bank and the pharmacy",
        "emoji": "📍",
        "instruction": "Identifique a preposição",
        "options": [
          "Entre dois lugares",
          "Atrás de",
          "Em frente a",
          "Ao lado de"
        ],
        "answer": 0,
        "explanation": "Between significa entre dois pontos."
      },
      {
        "prompt": "Como se diz \"Em frente ao parque\"?",
        "speech": "In front of the park",
        "emoji": "🌳",
        "instruction": "Escolha a frase",
        "options": [
          "In front of the park",
          "Behind the park",
          "Next park",
          "Near from park"
        ],
        "answer": 0,
        "explanation": "\"In front of\" é em frente a."
      },
      {
        "prompt": "Como se chama a calçada para caminhar?",
        "speech": "Sidewalk",
        "emoji": "🚶‍♂️",
        "instruction": "Identifique o termo",
        "options": [
          "Sidewalk",
          "Street",
          "Road",
          "Tunnel"
        ],
        "answer": 0,
        "explanation": "Sidewalk é a calçada em inglês americano."
      },
      {
        "prompt": "Como perguntar \"É longe daqui?\"?",
        "speech": "Is it far from here?",
        "emoji": "📍",
        "instruction": "Selecione a pergunta",
        "options": [
          "Is it long place?",
          "Has distance now?",
          "Is it far from here?",
          "Where is far?"
        ],
        "answer": 2,
        "explanation": "\"Far from here\" significa longe daqui."
      },
      {
        "prompt": "Como se diz \"Fica na esquina\"?",
        "speech": "It is on the corner",
        "emoji": "📐",
        "instruction": "Escolha a frase",
        "options": [
          "It is on the corner",
          "It has corner",
          "In the edge",
          "On the side"
        ],
        "answer": 0,
        "explanation": "\"On the corner\" é na esquina."
      },
      {
        "prompt": "Como se diz \"Pegue o ônibus número 10\"?",
        "speech": "Take bus number ten",
        "emoji": "🚌",
        "instruction": "Identifique a instrução",
        "options": [
          "Drive bus ten",
          "Catch train ten",
          "Take bus number ten",
          "Make bus ten"
        ],
        "answer": 2,
        "explanation": "Usa-se o verbo \"take\" para pegar transporte público."
      }
    ]
  },
  {
    "id": "en-9",
    "language": "en",
    "level": "A2 · Básico",
    "emoji": "🛍️",
    "title": "Compras, Preços & No Shopping",
    "description": "Pergunte How much does it cost? e negocie.",
    "xp": 25,
    "questions": [
      {
        "prompt": "Qual frase pergunta o preço de uma camiseta?",
        "speech": "How much is this T-shirt?",
        "emoji": "👕",
        "instruction": "Selecione a pergunta",
        "options": [
          "How much is this T-shirt?",
          "How many cost this shirt?",
          "What price are shirt?",
          "Which money for this?"
        ],
        "answer": 0,
        "explanation": "\"How much is...?\" pergunta o preço."
      },
      {
        "prompt": "Como dizer \"Posso experimentar este casaco?\"?",
        "speech": "Can I try this coat on?",
        "emoji": "🧥",
        "instruction": "Escolha a frase",
        "options": [
          "May I wear this coat?",
          "Can I try this coat on?",
          "Can I put coat now?",
          "Do I use coat?"
        ],
        "answer": 1,
        "explanation": "\"Try on\" é provar roupas."
      },
      {
        "prompt": "O que significa \"Expensive\"?",
        "speech": "Expensive",
        "emoji": "🏷️",
        "instruction": "Identifique o significado",
        "options": [
          "Barato",
          "Caro",
          "Bonito",
          "Antigo"
        ],
        "answer": 1,
        "explanation": "Expensive é caro (cheap é barato)."
      },
      {
        "prompt": "O que significa \"Cheap\"?",
        "speech": "Cheap",
        "emoji": "🏷️",
        "instruction": "Identifique o significado",
        "options": [
          "Pesado",
          "Caro",
          "Rápido",
          "Barato"
        ],
        "answer": 3,
        "explanation": "Cheap é barato."
      },
      {
        "prompt": "Onde você experimenta roupas em uma loja?",
        "speech": "In the fitting room",
        "emoji": "🚪",
        "instruction": "Identifique o local",
        "options": [
          "In the warehouse",
          "In the restroom",
          "In the fitting room",
          "In the office"
        ],
        "answer": 2,
        "explanation": "Fitting room é o provador."
      },
      {
        "prompt": "Como se diz \"Tamanho médio\"?",
        "speech": "Medium size",
        "emoji": "📏",
        "instruction": "Escolha o tamanho",
        "options": [
          "Half size",
          "Middle size",
          "Medium size",
          "Center size"
        ],
        "answer": 2,
        "explanation": "Tamanhos: Small (P), Medium (M), Large (G)."
      },
      {
        "prompt": "Como perguntar \"Vocês aceitam cartão de crédito?\"?",
        "speech": "Do you accept credit cards?",
        "emoji": "💳",
        "instruction": "Selecione a pergunta",
        "options": [
          "Do you accept credit cards?",
          "Can I give plastic?",
          "Have you card here?",
          "Credit card take?"
        ],
        "answer": 0,
        "explanation": "\"Do you accept credit cards?\" é a pergunta formal."
      },
      {
        "prompt": "O que é um \"Receipt\"?",
        "speech": "Receipt",
        "emoji": "🧾",
        "instruction": "Identifique o documento",
        "options": [
          "Comprovante / Nota fiscal",
          "Receita médica",
          "Etiqueta de preço",
          "Envelope"
        ],
        "answer": 0,
        "explanation": "Receipt é recibo / comprovante de compra."
      },
      {
        "prompt": "O que significa \"Discount\"?",
        "speech": "Discount",
        "emoji": "💰",
        "instruction": "Identifique o termo",
        "options": [
          "Aumento",
          "Taxa extra",
          "Devolução",
          "Desconto no preço"
        ],
        "answer": 3,
        "explanation": "Discount é desconto."
      },
      {
        "prompt": "Como se diz \"É apenas uma olhadinha, obrigado\"?",
        "speech": "I am just looking, thanks",
        "emoji": "👀",
        "instruction": "Escolha a resposta comum",
        "options": [
          "No money today",
          "I don’t want buy",
          "Leave me alone",
          "I am just looking, thanks"
        ],
        "answer": 3,
        "explanation": "\"I am just looking, thanks\" é a resposta educada a um vendedor."
      }
    ]
  },
  {
    "id": "en-10",
    "language": "en",
    "level": "A2 · Básico",
    "emoji": "🌦️",
    "title": "Clima, Estações & Roupas",
    "description": "Fale sobre sol, chuva, neve e temperatura.",
    "xp": 25,
    "questions": [
      {
        "prompt": "Como se diz \"Está chovendo muito hoje\"?",
        "speech": "It is raining a lot today",
        "emoji": "🌧️",
        "instruction": "Escolha a frase correta",
        "options": [
          "Today does rain",
          "It has rain today",
          "Is rain much now",
          "It is raining a lot today"
        ],
        "answer": 3,
        "explanation": "Usa-se \"It is raining\" para tempo meteorológico."
      },
      {
        "prompt": "Como se diz \"Está ensolarado e quente\"?",
        "speech": "It is sunny and hot",
        "emoji": "☀️",
        "instruction": "Identifique a frase",
        "options": [
          "It is sunny and hot",
          "It is sun with warm",
          "Has sun today",
          "Sun is high now"
        ],
        "answer": 0,
        "explanation": "Sunny é ensolarado e hot é quente."
      },
      {
        "prompt": "Qual é a estação do outono?",
        "speech": "Autumn / Fall",
        "emoji": "🍂",
        "instruction": "Identifique a estação",
        "options": [
          "Spring",
          "Autumn (ou Fall)",
          "Summer",
          "Winter"
        ],
        "answer": 1,
        "explanation": "Outono é Autumn (Reino Unido) ou Fall (EUA)."
      },
      {
        "prompt": "Qual é a estação das flores?",
        "speech": "Spring",
        "emoji": "🌸",
        "instruction": "Identifique a estação",
        "options": [
          "Winter",
          "Spring",
          "Summer",
          "Autumn"
        ],
        "answer": 1,
        "explanation": "Spring é a primavera."
      },
      {
        "prompt": "Como se diz \"Está nevando\"?",
        "speech": "It is snowing",
        "emoji": "❄️",
        "instruction": "Escolha a frase",
        "options": [
          "It is snowing",
          "It is ice now",
          "Snow is dropping",
          "Has white rain"
        ],
        "answer": 0,
        "explanation": "Snowing é nevando."
      },
      {
        "prompt": "O que significa \"Windy\"?",
        "speech": "Windy",
        "emoji": "💨",
        "instruction": "Identifique o significado",
        "options": [
          "Ensolarado",
          "Com muito vento",
          "Nublado",
          "Seco"
        ],
        "answer": 1,
        "explanation": "Windy significa ventoso / com vento."
      },
      {
        "prompt": "O que você usa quando está chovendo?",
        "speech": "An umbrella",
        "emoji": "☂️",
        "instruction": "Identifique o acessório",
        "options": [
          "Sandals",
          "Sunglasses",
          "Swimsuit",
          "An umbrella"
        ],
        "answer": 3,
        "explanation": "Umbrella é guarda-chuva."
      },
      {
        "prompt": "Como se diz \"Previsão do tempo\"?",
        "speech": "Weather forecast",
        "emoji": "📺",
        "instruction": "Identifique a expressão",
        "options": [
          "Rain calendar",
          "Climate vision",
          "Sky news",
          "Weather forecast"
        ],
        "answer": 3,
        "explanation": "Weather forecast é previsão do tempo."
      },
      {
        "prompt": "Como dizer \"Está muito frio lá fora\"?",
        "speech": "It is very cold outside",
        "emoji": "🥶",
        "instruction": "Escolha a frase",
        "options": [
          "Makes cold out",
          "Has ice outside",
          "Outside is frozen",
          "It is very cold outside"
        ],
        "answer": 3,
        "explanation": "Cold é frio e outside é lá fora."
      },
      {
        "prompt": "Qual é a temperatura de congelamento em graus Celsius?",
        "speech": "Zero degrees",
        "emoji": "🧊",
        "instruction": "Identifique a resposta",
        "options": [
          "Hundred degrees",
          "Ten degrees",
          "Thirty degrees",
          "Zero degrees"
        ],
        "answer": 3,
        "explanation": "Zero degrees Celsius é ponto de congelamento."
      }
    ]
  },
  {
    "id": "en-11",
    "language": "en",
    "level": "B1 · Intermediário",
    "emoji": "✈️",
    "title": "No Aeroporto & Imigração",
    "description": "Check-in, portão de embarque e alfândega.",
    "xp": 30,
    "questions": [
      {
        "prompt": "Onde você embarca no avião no aeroporto?",
        "speech": "At the boarding gate",
        "emoji": "🛫",
        "instruction": "Identifique o local",
        "options": [
          "At the baggage claim",
          "At the boarding gate",
          "At the ticket counter",
          "At the taxi stand"
        ],
        "answer": 1,
        "explanation": "\"Boarding gate\" é o portão de embarque."
      },
      {
        "prompt": "O que o oficial de imigração pergunta com: \"What is the purpose of your visit?\"",
        "speech": "Purpose of visit",
        "emoji": "🛂",
        "instruction": "Interprete a pergunta",
        "options": [
          "Qual é seu hotel?",
          "Quanto dinheiro você tem?",
          "Onde está sua mala?",
          "Qual o objetivo da sua viagem?"
        ],
        "answer": 3,
        "explanation": "\"Purpose\" é o propósito / finalidade."
      },
      {
        "prompt": "Como responder que você está viajando a turismo?",
        "speech": "I am here for tourism",
        "emoji": "🏖️",
        "instruction": "Escolha a resposta",
        "options": [
          "I am walking here",
          "I am here for tourism",
          "I have tourist visa only",
          "Just wandering around"
        ],
        "answer": 1,
        "explanation": "\"I am here for tourism\" é a resposta clara e direta."
      },
      {
        "prompt": "Como se chama a esteira onde você retira as malas?",
        "speech": "Baggage claim",
        "emoji": "🧳",
        "instruction": "Identifique o local",
        "options": [
          "Check-in desk",
          "Customs office",
          "Baggage claim",
          "Runway"
        ],
        "answer": 2,
        "explanation": "Baggage claim é a restituição de bagagem."
      },
      {
        "prompt": "O que é o \"Boarding pass\"?",
        "speech": "Boarding pass",
        "emoji": "🎫",
        "instruction": "Identifique o documento",
        "options": [
          "Visto de entrada",
          "Passaporte oficial",
          "Cartão de embarque",
          "Seguro viagem"
        ],
        "answer": 2,
        "explanation": "Boarding pass é o cartão de embarque."
      },
      {
        "prompt": "Como se diz \"Voo atrasado\"?",
        "speech": "Delayed flight",
        "emoji": "⏳",
        "instruction": "Identifique o status",
        "options": [
          "On time flight",
          "Canceled flight",
          "Early flight",
          "Delayed flight"
        ],
        "answer": 3,
        "explanation": "Delayed significa atrasado."
      },
      {
        "prompt": "O que significa \"Carry-on bag\"?",
        "speech": "Carry-on bag",
        "emoji": "🎒",
        "instruction": "Identifique a bagagem",
        "options": [
          "Mochila escolar",
          "Mala despachada pesada",
          "Carrinho de malas",
          "Mala de mão / bagagem de cabine"
        ],
        "answer": 3,
        "explanation": "Carry-on bag é a mala de mão."
      },
      {
        "prompt": "Como perguntar onde fica a esteira de bagagens?",
        "speech": "Where is the baggage claim?",
        "emoji": "🧳",
        "instruction": "Selecione a pergunta",
        "options": [
          "Where bags drop?",
          "Where is the baggage claim?",
          "Where is suitcase park?",
          "Which luggage area?"
        ],
        "answer": 1,
        "explanation": "\"Where is the baggage claim?\" é a pergunta exata."
      },
      {
        "prompt": "O que significa \"Customs\"?",
        "speech": "Customs",
        "emoji": "👮",
        "instruction": "Identifique o setor",
        "options": [
          "Alfândega",
          "Polícia local",
          "Banheiros",
          "Loja duty-free"
        ],
        "answer": 0,
        "explanation": "Customs é a alfândega."
      },
      {
        "prompt": "Como dizer \"Quanto tempo dura o voo?\"?",
        "speech": "How long is the flight?",
        "emoji": "⏱️",
        "instruction": "Escolha a pergunta",
        "options": [
          "How distance we fly?",
          "What time flight has?",
          "How long is the flight?",
          "How much hours travel?"
        ],
        "answer": 2,
        "explanation": "\"How long is...?\" pergunta a duração de tempo."
      }
    ]
  },
  {
    "id": "en-12",
    "language": "en",
    "level": "B1 · Intermediário",
    "emoji": "📜",
    "title": "Passado Simples: Verbos Irregulares",
    "description": "Domine went, saw, bought, took e thought.",
    "xp": 35,
    "questions": [
      {
        "prompt": "Qual é o passado de \"buy\" (comprar)?",
        "speech": "Bought",
        "emoji": "💳",
        "instruction": "Escolha o passado",
        "options": [
          "Buying",
          "Buyed",
          "Brought",
          "Bought"
        ],
        "answer": 3,
        "explanation": "O passado de buy é o irregular \"bought\"."
      },
      {
        "prompt": "Qual é o passado de \"go\" (ir)?",
        "speech": "Went",
        "emoji": "🚶",
        "instruction": "Escolha o passado",
        "options": [
          "Went",
          "Goed",
          "Gone",
          "Going"
        ],
        "answer": 0,
        "explanation": "O passado de go é \"went\"."
      },
      {
        "prompt": "Qual é o passado de \"see\" (ver)?",
        "speech": "Saw",
        "emoji": "👀",
        "instruction": "Escolha o passado",
        "options": [
          "Seed",
          "Saw",
          "Seen",
          "Sight"
        ],
        "answer": 1,
        "explanation": "O passado de see é \"saw\"."
      },
      {
        "prompt": "Qual é o passado de \"eat\" (comer)?",
        "speech": "Ate",
        "emoji": "🍽️",
        "instruction": "Escolha o passado",
        "options": [
          "Eating",
          "Eaten",
          "Eated",
          "Ate"
        ],
        "answer": 3,
        "explanation": "O passado de eat é \"ate\"."
      },
      {
        "prompt": "Como negar no passado: \"Eu não assisti TV ontem\"?",
        "speech": "I did not watch TV yesterday",
        "emoji": "📺",
        "instruction": "Selecione a negação",
        "options": [
          "I did not watched TV",
          "I not watched TV",
          "I no watch TV",
          "I did not watch TV yesterday"
        ],
        "answer": 3,
        "explanation": "Usa-se \"did not\" + verbo na forma base."
      },
      {
        "prompt": "Qual o passado do verbo \"to have\" (ter)?",
        "speech": "Had",
        "emoji": "💼",
        "instruction": "Identifique a forma",
        "options": [
          "Had",
          "Haved",
          "Has",
          "Having"
        ],
        "answer": 0,
        "explanation": "O passado de have é \"had\"."
      },
      {
        "prompt": "Qual o passado de \"take\" (pegar / levar)?",
        "speech": "Took",
        "emoji": "📸",
        "instruction": "Escolha o passado",
        "options": [
          "Tooken",
          "Taked",
          "Taken",
          "Took"
        ],
        "answer": 3,
        "explanation": "O passado de take é \"took\"."
      },
      {
        "prompt": "Complete: \"Yesterday we ___ pizza for dinner.\"",
        "speech": "Yesterday we had pizza",
        "emoji": "🍕",
        "instruction": "Complete a frase",
        "options": [
          "have",
          "had",
          "having",
          "has"
        ],
        "answer": 1,
        "explanation": "Ação no passado: had."
      },
      {
        "prompt": "Qual é o passado de \"write\" (escrever)?",
        "speech": "Wrote",
        "emoji": "✍️",
        "instruction": "Identifique o verbo",
        "options": [
          "Written",
          "Wrote",
          "Writed",
          "Writing"
        ],
        "answer": 1,
        "explanation": "O passado de write é \"wrote\"."
      },
      {
        "prompt": "Como perguntar: \"Você foi à praia ontem?\"?",
        "speech": "Did you go to the beach yesterday?",
        "emoji": "🏖️",
        "instruction": "Selecione a pergunta",
        "options": [
          "Went you to beach?",
          "Did you went to beach?",
          "Did you go to the beach yesterday?",
          "Do you went yesterday?"
        ],
        "answer": 2,
        "explanation": "Na pergunta no passado com \"Did\", o verbo fica na forma base \"go\"."
      }
    ]
  },
  {
    "id": "en-13",
    "language": "en",
    "level": "B1 · Intermediário",
    "emoji": "🏨",
    "title": "No Hotel, Hospedagem & Check-in",
    "description": "Faça check-in, solicite toalhas e tire dúvidas.",
    "xp": 30,
    "questions": [
      {
        "prompt": "Como dizer \"Tenho uma reserva no nome de Silva\"?",
        "speech": "I have a reservation under the name of Silva",
        "emoji": "🛎️",
        "instruction": "Selecione a frase",
        "options": [
          "I have a reservation under the name of Silva",
          "I book room for Silva now",
          "My name has hotel",
          "I have one room Silva"
        ],
        "answer": 0,
        "explanation": "\"Under the name of...\" é a expressão formal para reservas."
      },
      {
        "prompt": "A que horas geralmente é o \"Check-out\"?",
        "speech": "Check-out time",
        "emoji": "🕚",
        "instruction": "Identifique o horário comum",
        "options": [
          "Anytime you want",
          "At midnight",
          "At 6 AM",
          "Around 11 AM or noon"
        ],
        "answer": 3,
        "explanation": "Check-out costuma ser às 11h ou meio-dia."
      },
      {
        "prompt": "Como pedir toalhas limpas para o quarto?",
        "speech": "Could we have extra towels, please?",
        "emoji": "🛁",
        "instruction": "Escolha a solicitação",
        "options": [
          "Where is bathroom sheets?",
          "Bring cloths quickly",
          "Could we have extra towels, please?",
          "I want clean paper"
        ],
        "answer": 2,
        "explanation": "Towels são toalhas."
      },
      {
        "prompt": "O que significa \"Wake-up call\"?",
        "speech": "Wake-up call",
        "emoji": "📞",
        "instruction": "Identifique o serviço",
        "options": [
          "Serviço de despertador pelo telefone do hotel",
          "Chamada internacional cara",
          "Pedido de café da manhã",
          "Aviso de incêndio"
        ],
        "answer": 0,
        "explanation": "Wake-up call é o serviço de despertar."
      },
      {
        "prompt": "Como perguntar se o café da manhã está incluído na diária?",
        "speech": "Is breakfast included?",
        "emoji": "🥐",
        "instruction": "Selecione a pergunta",
        "options": [
          "Is breakfast included?",
          "Does hotel give free food?",
          "Is morning coffee gratis?",
          "Have we food price?"
        ],
        "answer": 0,
        "explanation": "\"Is breakfast included?\" é a pergunta padrão."
      },
      {
        "prompt": "Qual a palavra para \"Chave do quarto\"?",
        "speech": "Room key / Keycard",
        "emoji": "🔑",
        "instruction": "Identifique o objeto",
        "options": [
          "Room key (ou Keycard)",
          "Door code",
          "Secret card",
          "Lock opener"
        ],
        "answer": 0,
        "explanation": "Room key ou keycard é a chave do quarto."
      },
      {
        "prompt": "O que significa \"Single room\"?",
        "speech": "Single room",
        "emoji": "🛏️",
        "instruction": "Identifique o tipo de quarto",
        "options": [
          "Quarto duplo de luxo",
          "Quarto para uma pessoa (cama de solteiro)",
          "Quarto sem banheiro",
          "Suíte presidencial"
        ],
        "answer": 1,
        "explanation": "Single room é quarto para uma pessoa."
      },
      {
        "prompt": "Como dizer \"O ar-condicionado não está funcionando\"?",
        "speech": "The air conditioning is not working",
        "emoji": "❄️",
        "instruction": "Escolha a frase",
        "options": [
          "Cold machine is dead",
          "The air conditioning is not working",
          "Air is broken here",
          "No cold wind now"
        ],
        "answer": 1,
        "explanation": "\"Not working\" significa não está funcionando."
      },
      {
        "prompt": "O que é o \"Elevator\"?",
        "speech": "Elevator",
        "emoji": "🛗",
        "instruction": "Identifique o termo",
        "options": [
          "Estacionamento",
          "Escada de emergência",
          "Recepção",
          "Elevador"
        ],
        "answer": 3,
        "explanation": "Elevator (EUA) ou Lift (Reino Unido) é o elevador."
      },
      {
        "prompt": "O que significa a placa \"Do Not Disturb\"?",
        "speech": "Do Not Disturb",
        "emoji": "🚫",
        "instruction": "Identifique o aviso",
        "options": [
          "Favor limpar o quarto",
          "Não perturbe",
          "Saída proibida",
          "Quarto vago"
        ],
        "answer": 1,
        "explanation": "\"Do Not Disturb\" significa não perturbe."
      }
    ]
  },
  {
    "id": "en-14",
    "language": "en",
    "level": "B1 · Intermediário",
    "emoji": "🏥",
    "title": "Saúde, Sintomas & Na Farmácia",
    "description": "Descreva dores e compre analgésicos.",
    "xp": 30,
    "questions": [
      {
        "prompt": "Como expressar \"Estou com dor de garganta\"?",
        "speech": "I have a sore throat",
        "emoji": "🤒",
        "instruction": "Escolha a tradução",
        "options": [
          "I have a sore throat",
          "My neck is pain",
          "I am throat hurt",
          "Pain in mouth"
        ],
        "answer": 0,
        "explanation": "\"Sore throat\" é dor de garganta."
      },
      {
        "prompt": "Como se diz \"Dor de cabeça\"?",
        "speech": "Headache",
        "emoji": "🤕",
        "instruction": "Identifique o sintoma",
        "options": [
          "Toothache",
          "Headache",
          "Stomachache",
          "Earache"
        ],
        "answer": 1,
        "explanation": "Headache é dor de cabeça."
      },
      {
        "prompt": "O que é um \"Painkiller\"?",
        "speech": "Painkiller",
        "emoji": "💊",
        "instruction": "Identifique o medicamento",
        "options": [
          "Pomada para pele",
          "Antibiótico forte",
          "Xarope para tosse",
          "Analgésico / remédio para dor"
        ],
        "answer": 3,
        "explanation": "Painkiller é analgésico."
      },
      {
        "prompt": "O que significa \"Prescription\"?",
        "speech": "Prescription",
        "emoji": "📄",
        "instruction": "Identifique o documento",
        "options": [
          "Receita médica",
          "Bula do remédio",
          "Conta do hospital",
          "Atestado de óbito"
        ],
        "answer": 0,
        "explanation": "Prescription é a receita prescrita pelo médico."
      },
      {
        "prompt": "Como dizer \"Estou com febre alta\"?",
        "speech": "I have a high fever",
        "emoji": "🌡️",
        "instruction": "Escolha a frase",
        "options": [
          "I have a high fever",
          "I am with hot temperature",
          "My body is burning",
          "I feel heat sick"
        ],
        "answer": 0,
        "explanation": "Fever é febre."
      },
      {
        "prompt": "Como se diz \"Eu sou alérgico a penicilina\"?",
        "speech": "I am allergic to penicillin",
        "emoji": "⚠️",
        "instruction": "Selecione a declaração",
        "options": [
          "I am allergic to penicillin",
          "I have allergy of penicillin",
          "Penicillin makes me bad",
          "No penicillin for me"
        ],
        "answer": 0,
        "explanation": "\"I am allergic to...\" expressa alergia a algo."
      },
      {
        "prompt": "O que significa \"Dizzy\"?",
        "speech": "Dizzy",
        "emoji": "😵",
        "instruction": "Identifique a sensação",
        "options": [
          "Tonto / com vertigem",
          "Sonolento",
          "Com fome",
          "Cansado"
        ],
        "answer": 0,
        "explanation": "Dizzy significa tonto ou zonzo."
      },
      {
        "prompt": "Como se chama o \"Xarope para tosse\"?",
        "speech": "Cough syrup",
        "emoji": "🥄",
        "instruction": "Identifique o remédio",
        "options": [
          "Drop medicine",
          "Throat juice",
          "Cold water",
          "Cough syrup"
        ],
        "answer": 3,
        "explanation": "Cough syrup é xarope para tosse."
      },
      {
        "prompt": "Como dizer \"Machuquei meu tornozelo\"?",
        "speech": "I hurt my ankle",
        "emoji": "🦶",
        "instruction": "Escolha a frase",
        "options": [
          "I hurt my ankle",
          "My foot is broken",
          "I destroyed my leg",
          "Pain in knee"
        ],
        "answer": 0,
        "explanation": "Ankle é tornozelo e hurt é machucar."
      },
      {
        "prompt": "Como se diz \"Melhoras logo!\" a um doente?",
        "speech": "Get well soon!",
        "emoji": "💐",
        "instruction": "Escolha a mensagem carinhosa",
        "options": [
          "No more sick!",
          "Be healthy now!",
          "Recover quickly please!",
          "Get well soon!"
        ],
        "answer": 3,
        "explanation": "\"Get well soon!\" é a frase padrão para desejar melhoras."
      }
    ]
  },
  {
    "id": "en-15",
    "language": "en",
    "level": "B1 · Intermediário",
    "emoji": "💼",
    "title": "Trabalho, Profissões & E-mails",
    "description": "Escreva e-mails profissionais com clareza.",
    "xp": 35,
    "questions": [
      {
        "prompt": "Como iniciar um e-mail formal em inglês?",
        "speech": "Dear Mr. Smith",
        "emoji": "✉️",
        "instruction": "Escolha a saudação formal",
        "options": [
          "Hey dude",
          "Dear Mr. Smith",
          "What is up",
          "Yo Smith"
        ],
        "answer": 1,
        "explanation": "\"Dear Mr./Ms.\" é o início formal adequado."
      },
      {
        "prompt": "Como encerrar um e-mail profissional cordialmente?",
        "speech": "Best regards",
        "emoji": "✍️",
        "instruction": "Escolha a despedida profissional",
        "options": [
          "Bye bye",
          "Kisses and hugs",
          "Best regards",
          "See you later alligator"
        ],
        "answer": 2,
        "explanation": "\"Best regards\" ou \"Sincerely\" são encerramentos profissionais."
      },
      {
        "prompt": "O que significa \"Deadline\"?",
        "speech": "Deadline",
        "emoji": "⏰",
        "instruction": "Identifique o termo corporativo",
        "options": [
          "Prazo limite de entrega",
          "Linha de chegada",
          "Fim do expediente",
          "Demissão em massa"
        ],
        "answer": 0,
        "explanation": "Deadline é o prazo limite para finalizar uma tarefa."
      },
      {
        "prompt": "O que é um \"Meeting\"?",
        "speech": "Meeting",
        "emoji": "👥",
        "instruction": "Identifique o evento",
        "options": [
          "Almoço informal",
          "Reunião de trabalho",
          "Festa de aniversário",
          "Entrevista de saída"
        ],
        "answer": 1,
        "explanation": "Meeting é reunião."
      },
      {
        "prompt": "Como se chama o currículo profissional em inglês americano?",
        "speech": "Resume",
        "emoji": "📄",
        "instruction": "Identifique o documento",
        "options": [
          "Career paper",
          "CV card",
          "Job list",
          "Resume"
        ],
        "answer": 3,
        "explanation": "Resume (nos EUA) ou CV (no Reino Unido) é o currículo."
      },
      {
        "prompt": "O que significa \"CEO\" (Chief Executive Officer)?",
        "speech": "CEO",
        "emoji": "👔",
        "instruction": "Identifique o cargo",
        "options": [
          "Gerente de compras",
          "Diretor executivo / Presidente da empresa",
          "Chefe de segurança",
          "Estagiário sênior"
        ],
        "answer": 1,
        "explanation": "CEO é o presidente executivo."
      },
      {
        "prompt": "Como dizer \"Anexo o relatório solicitado\"?",
        "speech": "Please find attached the report",
        "emoji": "📎",
        "instruction": "Escolha a frase corporativa",
        "options": [
          "Look report inside",
          "Please find attached the report",
          "I put file together",
          "Report is glued here"
        ],
        "answer": 1,
        "explanation": "\"Please find attached...\" é a frase padrão para anexos."
      },
      {
        "prompt": "O que é \"Overtime\"?",
        "speech": "Overtime",
        "emoji": "⏱️",
        "instruction": "Identifique o termo de trabalho",
        "options": [
          "Tempo de descanso",
          "Hora extra de trabalho",
          "Férias remuneradas",
          "Atraso tolerável"
        ],
        "answer": 1,
        "explanation": "Overtime são horas extras."
      },
      {
        "prompt": "Como dizer \"Estou fora do escritório até segunda\"?",
        "speech": "I am out of the office until Monday",
        "emoji": "🚪",
        "instruction": "Selecione a resposta automática",
        "options": [
          "My desk is empty",
          "I no work today Monday",
          "I am out of the office until Monday",
          "Gone away forever"
        ],
        "answer": 2,
        "explanation": "Mensagem clássica de Out of Office (OOO)."
      },
      {
        "prompt": "O que significa \"To hire\"?",
        "speech": "To hire",
        "emoji": "🤝",
        "instruction": "Identifique o verbo",
        "options": [
          "Demitir alguém",
          "Contratar um funcionário",
          "Promover de cargo",
          "Pedir aumento"
        ],
        "answer": 1,
        "explanation": "Hire é contratar (fire é demitir)."
      }
    ]
  },
  {
    "id": "en-16",
    "language": "en",
    "level": "B1 · Intermediário",
    "emoji": "🌍",
    "title": "Present Perfect & Experiências",
    "description": "Use Have you ever...? para falar de viagens e vida.",
    "xp": 35,
    "questions": [
      {
        "prompt": "Complete: \"Have you ever ___ sushi?\"",
        "speech": "Have you ever eaten sushi?",
        "emoji": "🍣",
        "instruction": "Escolha o particípio",
        "options": [
          "eating",
          "ate",
          "eaten",
          "eat"
        ],
        "answer": 2,
        "explanation": "Present Perfect exige particípio passado: eaten."
      },
      {
        "prompt": "Complete: \"I have lived in this city ___ five years.\"",
        "speech": "For five years",
        "emoji": "⏳",
        "instruction": "Escolha for ou since",
        "options": [
          "since",
          "for",
          "during",
          "from"
        ],
        "answer": 1,
        "explanation": "Usa-se \"for\" para duração de tempo (5 anos)."
      },
      {
        "prompt": "Complete: \"She has worked here ___ 2020.\"",
        "speech": "Since 2020",
        "emoji": "📅",
        "instruction": "Escolha for ou since",
        "options": [
          "from",
          "for",
          "since",
          "in"
        ],
        "answer": 2,
        "explanation": "Usa-se \"since\" para ponto de início no tempo."
      },
      {
        "prompt": "O que significa \"Already\" no Present Perfect?",
        "speech": "I have already finished",
        "emoji": "✅",
        "instruction": "Identifique o sentido",
        "options": [
          "Sempre",
          "Ainda não",
          "Nunca",
          "Já (ação realizada antes do esperado)"
        ],
        "answer": 3,
        "explanation": "Already indica que a ação já foi concluída."
      },
      {
        "prompt": "Onde colocamos \"Yet\" em frases interrogativas e negativas?",
        "speech": "Have you finished yet?",
        "emoji": "❓",
        "instruction": "Identifique a posição",
        "options": [
          "Entre o sujeito e verbo",
          "No início",
          "No final da frase",
          "Antes do particípio"
        ],
        "answer": 2,
        "explanation": "Yet costuma vir no final da frase."
      },
      {
        "prompt": "Complete: \"He has ___ visited Japan.\"",
        "speech": "He has never visited Japan",
        "emoji": "🇯🇵",
        "instruction": "Complete a experiência",
        "options": [
          "ever",
          "never",
          "not ever",
          "no"
        ],
        "answer": 1,
        "explanation": "Never expressa que ele nunca visitou."
      },
      {
        "prompt": "Qual a diferença entre \"have been to\" e \"have gone to\"?",
        "speech": "Been to vs Gone to",
        "emoji": "🧳",
        "instruction": "Identifique a diferença",
        "options": [
          "\"Been to\" foi e voltou; \"Gone to\" ainda está lá",
          "São idênticos",
          "\"Gone to\" é no passado remoto",
          "\"Been to\" é só para trabalho"
        ],
        "answer": 0,
        "explanation": "Been to indica viagem completa com retorno."
      },
      {
        "prompt": "Complete: \"We ___ just arrived home.\"",
        "speech": "We have just arrived home",
        "emoji": "🏡",
        "instruction": "Complete com have/has",
        "options": [
          "had",
          "has",
          "have",
          "are"
        ],
        "answer": 2,
        "explanation": "Com \"We\" usa-se \"have\". Just indica que acabou de acontecer."
      },
      {
        "prompt": "Como perguntar: \"Você já esteve em Nova York?\"?",
        "speech": "Have you ever been to New York?",
        "emoji": "🗽",
        "instruction": "Selecione a pergunta",
        "options": [
          "Were you in NY ever?",
          "Did you already go to NY?",
          "Have you ever been to New York?",
          "Have you gone NY?"
        ],
        "answer": 2,
        "explanation": "\"Have you ever been to...?\" é a pergunta clássica."
      },
      {
        "prompt": "Qual o particípio passado do verbo \"to write\"?",
        "speech": "Written",
        "emoji": "✍️",
        "instruction": "Identifique a forma",
        "options": [
          "Writing",
          "Wrote",
          "Writed",
          "Written"
        ],
        "answer": 3,
        "explanation": "Write -> Wrote -> Written."
      }
    ]
  },
  {
    "id": "en-17",
    "language": "en",
    "level": "B2 · Avançado",
    "emoji": "🔮",
    "title": "Futuro: Will vs Going To",
    "description": "Previsões espontâneas vs planos organizados.",
    "xp": 40,
    "questions": [
      {
        "prompt": "Para um plano já agendado e decidido com antecedência, usamos:",
        "speech": "I am going to travel next month",
        "emoji": "📆",
        "instruction": "Selecione a frase correta",
        "options": [
          "I travel future",
          "I will maybe travel tomorrow",
          "I am going to travel next month",
          "I shall to go"
        ],
        "answer": 2,
        "explanation": "\"Going to\" é usado para planos pré-estabelecidos."
      },
      {
        "prompt": "Para uma decisão tomada no instante em que se fala (espontânea), usamos:",
        "speech": "I will answer the phone",
        "emoji": "📞",
        "instruction": "Identifique a estrutura",
        "options": [
          "Going to",
          "Will (\"I will answer it\")",
          "Present continuous",
          "Past tense"
        ],
        "answer": 1,
        "explanation": "Decisões no momento da fala usam \"will\"."
      },
      {
        "prompt": "Para promessas solenes, qual estrutura é tradicional?",
        "speech": "I promise I will help you",
        "emoji": "🤝",
        "instruction": "Identifique o auxiliar",
        "options": [
          "Might",
          "Going to",
          "Will",
          "Must"
        ],
        "answer": 2,
        "explanation": "Promessas utilizam \"will\": \"I will always love you\"."
      },
      {
        "prompt": "Complete a previsão: \"Look at those dark clouds! It ___ rain.\"",
        "speech": "It is going to rain",
        "emoji": "⛈️",
        "instruction": "Escolha pela evidência física",
        "options": [
          "would",
          "will maybe",
          "does",
          "is going to"
        ],
        "answer": 3,
        "explanation": "Com evidências visuais presentes usa-se \"is going to rain\"."
      },
      {
        "prompt": "Qual a contração negativa de \"will not\"?",
        "speech": "Won’t",
        "emoji": "🚫",
        "instruction": "Identifique a contração",
        "options": [
          "Won't",
          "Willn't",
          "Wont't",
          "Wilt"
        ],
        "answer": 0,
        "explanation": "Will not contrai-se para won't."
      },
      {
        "prompt": "Como fazer uma oferta cordial com \"Shall\"?",
        "speech": "Shall I carry your bag?",
        "emoji": "🧳",
        "instruction": "Selecione a frase polida",
        "options": [
          "Do I bag for you?",
          "Will you make my bag?",
          "Shall I carry your bag?",
          "Shall bag be mine?"
        ],
        "answer": 2,
        "explanation": "\"Shall I...?\" é oferta formal britânica."
      },
      {
        "prompt": "Complete: \"By this time tomorrow, I ___ be flying to Paris.\"",
        "speech": "I will be flying",
        "emoji": "✈️",
        "instruction": "Future continuous",
        "options": [
          "will",
          "going",
          "am",
          "was"
        ],
        "answer": 0,
        "explanation": "Will be flying indica ação contínua em progresso no futuro."
      },
      {
        "prompt": "O que expressa a frase: \"I might visit my parents this weekend\"?",
        "speech": "Might",
        "emoji": "🏡",
        "instruction": "Interprete o modal",
        "options": [
          "Uma ordem",
          "Certeza absoluta",
          "Uma obrigação legal",
          "Uma possibilidade incerta (talvez eu visite)"
        ],
        "answer": 3,
        "explanation": "Might expressa possibilidade com menor certeza."
      },
      {
        "prompt": "Como dizer \"Não se preocupe, eu te ligo mais tarde\"?",
        "speech": "Don’t worry, I will call you later",
        "emoji": "📱",
        "instruction": "Escolha a frase espontânea",
        "options": [
          "I call you after",
          "No worry, I am to call",
          "Don’t worry, I will call you later",
          "Calm, I make call"
        ],
        "answer": 2,
        "explanation": "Promessa / decisão espontânea com will."
      },
      {
        "prompt": "O que significa \"As soon as I arrive, I will text you\"?",
        "speech": "As soon as",
        "emoji": "💬",
        "instruction": "Identifique o sentido",
        "options": [
          "Antes de chegar eu ligo",
          "Se eu chegar tarde, não mando nada",
          "Assim que eu chegar, te mando mensagem",
          "Enquanto eu viajo eu durmo"
        ],
        "answer": 2,
        "explanation": "\"As soon as\" significa assim que / logo que."
      }
    ]
  },
  {
    "id": "en-18",
    "language": "en",
    "level": "B2 · Avançado",
    "emoji": "🧠",
    "title": "Condicionais & Situações Hipotéticas",
    "description": "Domine If I were you, I would take the offer.",
    "xp": 40,
    "questions": [
      {
        "prompt": "Complete a 2ª condicional: \"If I won the lottery, I ___ buy a mansion.\"",
        "speech": "I would buy",
        "emoji": "🏰",
        "instruction": "Complete no modo hipotético",
        "options": [
          "will",
          "would",
          "have",
          "am"
        ],
        "answer": 1,
        "explanation": "A 2ª condicional usa Past Simple + would."
      },
      {
        "prompt": "Complete o conselho: \"If I ___ you, I would accept the job offer.\"",
        "speech": "If I were you",
        "emoji": "👔",
        "instruction": "Identifique o subjuntivo formal",
        "options": [
          "will be",
          "was",
          "am",
          "were"
        ],
        "answer": 3,
        "explanation": "No inglês formal de hipótese usa-se \"were\" com I/he/she."
      },
      {
        "prompt": "Qual condicional expressa verdades científicas universais (Zero Conditional)?",
        "speech": "If you heat ice, it melts",
        "emoji": "🧊",
        "instruction": "Identifique a regra",
        "options": [
          "Will + Might",
          "Past + Would",
          "Present + Present (\"If you heat ice, it melts\")",
          "Past perfect + Would have"
        ],
        "answer": 2,
        "explanation": "Zero conditional usa presente nas duas orações."
      },
      {
        "prompt": "Complete a 1ª condicional (realista): \"If it rains tomorrow, we ___ stay home.\"",
        "speech": "We will stay home",
        "emoji": "🌧️",
        "instruction": "Escolha a consequência",
        "options": [
          "were",
          "would",
          "had",
          "will"
        ],
        "answer": 3,
        "explanation": "1ª condicional usa If + Present, Will + base form."
      },
      {
        "prompt": "O que a 3ª condicional expressa (Third Conditional)?",
        "speech": "If I had studied, I would have passed",
        "emoji": "📜",
        "instruction": "Identifique o sentido",
        "options": [
          "Planos para o próximo ano",
          "Arrependimento ou hipótese sobre um passado impossível de mudar",
          "Ordens imediatas",
          "Fatos da física"
        ],
        "answer": 1,
        "explanation": "A 3ª condicional trata do passado não ocorrido."
      },
      {
        "prompt": "Complete: \"If you ___ told me earlier, I could have helped.\"",
        "speech": "If you had told me",
        "emoji": "🗣️",
        "instruction": "Complete no passado perfeito",
        "options": [
          "have",
          "had",
          "would",
          "did"
        ],
        "answer": 1,
        "explanation": "Na 3ª condicional a condição leva had + particípio."
      },
      {
        "prompt": "O que significa a palavra \"Unless\"?",
        "speech": "Unless you hurry, you will miss the train",
        "emoji": "⏳",
        "instruction": "Identifique o conectivo",
        "options": [
          "A não ser que / A menos que",
          "Porque",
          "Desde que",
          "Embora"
        ],
        "answer": 0,
        "explanation": "\"Unless\" equivale a \"if not\" (a menos que)."
      },
      {
        "prompt": "Complete: \"I will go to the party provided that you ___ with me.\"",
        "speech": "Provided that you come",
        "emoji": "🎉",
        "instruction": "Identifique o conectivo condicional",
        "options": [
          "will come",
          "came",
          "come",
          "had come"
        ],
        "answer": 2,
        "explanation": "\"Provided that\" significa contanto que."
      },
      {
        "prompt": "Como dizer \"Se eu soubesse, teria te avisado\"?",
        "speech": "If I had known, I would have told you",
        "emoji": "💡",
        "instruction": "Selecione a 3ª condicional",
        "options": [
          "If I was knowing, I would tell",
          "If I knew, I told you",
          "If I know, I will tell",
          "If I had known, I would have told you"
        ],
        "answer": 3,
        "explanation": "Estrutura clássica de arrependimento no passado."
      },
      {
        "prompt": "O que expressa a oração: \"Wish I were taller\"?",
        "speech": "I wish",
        "emoji": "📏",
        "instruction": "Identifique o sentimento",
        "options": [
          "Previsão matemática",
          "Desejo de uma realidade diferente no presente",
          "Reclamação agressiva",
          "Pergunta sobre altura"
        ],
        "answer": 1,
        "explanation": "\"I wish + were\" expressa desejo no presente."
      }
    ]
  },
  {
    "id": "en-19",
    "language": "en",
    "level": "B2 · Avançado",
    "emoji": "⚡",
    "title": "Phrasal Verbs Indispensáveis",
    "description": "Aprenda look forward to, give up e run out of.",
    "xp": 40,
    "questions": [
      {
        "prompt": "O que significa o phrasal verb \"to give up\"?",
        "speech": "Give up",
        "emoji": "🏳️",
        "instruction": "Identifique o significado",
        "options": [
          "Subir escadas",
          "Devolver um livro",
          "Desistir / abandonar um esforço",
          "Aumentar o volume"
        ],
        "answer": 2,
        "explanation": "\"Give up\" significa desistir."
      },
      {
        "prompt": "O que significa \"I am looking forward to our vacation\"?",
        "speech": "Look forward to",
        "emoji": "🏖️",
        "instruction": "Interprete a frase",
        "options": [
          "Esqueci minhas férias",
          "Estou com medo das férias",
          "Cancelei minhas férias",
          "Estou aguardando ansiosamente pelas férias"
        ],
        "answer": 3,
        "explanation": "\"Look forward to\" significa aguardar com expectativa positiva."
      },
      {
        "prompt": "O que significa \"We ran out of coffee\"?",
        "speech": "Run out of",
        "emoji": "☕",
        "instruction": "Identifique a situação",
        "options": [
          "Nosso café acabou completamente",
          "Derrubamos o café no chão",
          "Tomamos café correndo",
          "Compramos café demais"
        ],
        "answer": 0,
        "explanation": "\"Run out of\" significa esgotar o estoque / ficar sem."
      },
      {
        "prompt": "O que significa \"Turn off the lights\"?",
        "speech": "Turn off",
        "emoji": "💡",
        "instruction": "Identifique a ação",
        "options": [
          "Trocar as lâmpadas",
          "Ligar as luzes",
          "Desligar / apagar as luzes",
          "Comprar lâmpadas"
        ],
        "answer": 2,
        "explanation": "Turn off é desligar ou apagar."
      },
      {
        "prompt": "O que significa \"Put off the meeting\"?",
        "speech": "Put off",
        "emoji": "📅",
        "instruction": "Identifique o sentido",
        "options": [
          "Adiar a reunião para outra data",
          "Cancelar para sempre",
          "Iniciar a reunião",
          "Gritar na reunião"
        ],
        "answer": 0,
        "explanation": "\"Put off\" significa adiar / postergar."
      },
      {
        "prompt": "O que significa \"Find out\"?",
        "speech": "Find out",
        "emoji": "🔍",
        "instruction": "Identifique o significado",
        "options": [
          "Procurar sem achar",
          "Perder um objeto",
          "Inventar uma mentira",
          "Descobrir uma informação"
        ],
        "answer": 3,
        "explanation": "\"Find out\" significa descobrir ou se informar."
      },
      {
        "prompt": "O que significa \"Call off the match\"?",
        "speech": "Call off",
        "emoji": "⚽",
        "instruction": "Identifique a decisão",
        "options": [
          "Mudar o estádio",
          "Comemorar o jogo",
          "Aumentar o tempo",
          "Cancelar a partida"
        ],
        "answer": 3,
        "explanation": "\"Call off\" significa cancelar definitivamente."
      },
      {
        "prompt": "O que significa \"Get along with someone\"?",
        "speech": "Get along with",
        "emoji": "🤝",
        "instruction": "Identifique o relacionamento",
        "options": [
          "Brigar constantemente",
          "Dar-se bem com alguém / ter boa convivência",
          "Morar longe",
          "Trabalhar junto por obrigação"
        ],
        "answer": 1,
        "explanation": "\"Get along with\" significa ter bom relacionamento."
      },
      {
        "prompt": "O que significa \"Look after my dog\"?",
        "speech": "Look after",
        "emoji": "🐕",
        "instruction": "Identifique o cuidado",
        "options": [
          "Procurar meu cachorro perdido",
          "Cuidar do meu cachorro",
          "Comprar ração",
          "Correr atrás do cão"
        ],
        "answer": 1,
        "explanation": "\"Look after\" significa cuidar / zelar."
      },
      {
        "prompt": "O que significa \"Figure out a solution\"?",
        "speech": "Figure out",
        "emoji": "🧩",
        "instruction": "Identifique a habilidade",
        "options": [
          "Copiar de alguém",
          "Criar mais problemas",
          "Encontrar / compreender uma solução para um problema",
          "Desistir da busca"
        ],
        "answer": 2,
        "explanation": "\"Figure out\" significa desvendar ou solucionar."
      }
    ]
  },
  {
    "id": "en-20",
    "language": "en",
    "level": "B2 · Avançado",
    "emoji": "🎭",
    "title": "Expressões Idiomáticas Nativas",
    "description": "Entenda break a leg, piece of cake e hit the sack.",
    "xp": 40,
    "questions": [
      {
        "prompt": "Quando alguém diz que um teste foi \"a piece of cake\", o que significa?",
        "speech": "Piece of cake",
        "emoji": "🍰",
        "instruction": "Identifique a gíria",
        "options": [
          "Foi extremamente fácil / uma moleza",
          "Foi muito gostoso",
          "Foi longo e cansativo",
          "Foi confuso"
        ],
        "answer": 0,
        "explanation": "\"Piece of cake\" significa muito fácil."
      },
      {
        "prompt": "O que significa desejar \"Break a leg\" a um artista antes do show?",
        "speech": "Break a leg",
        "emoji": "🎭",
        "instruction": "Identifique o costume",
        "options": [
          "Boa sorte! (expressão teatral tradicional)",
          "Espero que você caia",
          "O show vai ser ruim",
          "Cuidado com os degraus"
        ],
        "answer": 0,
        "explanation": "\"Break a leg\" é a forma clássica de desejar boa sorte sem dar azar."
      },
      {
        "prompt": "O que significa \"I feel under the weather today\"?",
        "speech": "Under the weather",
        "emoji": "🤒",
        "instruction": "Identifique o estado de saúde",
        "options": [
          "Gosto de olhar as nuvens",
          "Está chovendo na minha cidade",
          "Estou com muito frio",
          "Estou me sentindo indisposto ou meio doente"
        ],
        "answer": 3,
        "explanation": "\"Under the weather\" significa estar adoentado ou indisposto."
      },
      {
        "prompt": "O que significa \"Hit the sack\"?",
        "speech": "Hit the sack",
        "emoji": "🛏️",
        "instruction": "Identifique a ação cotidiana",
        "options": [
          "Ir às compras",
          "Bater em um saco de boxe",
          "Ir dormir / ir para a cama",
          "Trabalhar no campo"
        ],
        "answer": 2,
        "explanation": "\"Hit the sack\" significa ir dormir."
      },
      {
        "prompt": "O que significa a expressão \"Once in a blue moon\"?",
        "speech": "Once in a blue moon",
        "emoji": "🌕",
        "instruction": "Identifique a frequência",
        "options": [
          "Todos os meses",
          "Raramente / quase nunca",
          "Toda semana",
          "Nas noites de verão"
        ],
        "answer": 1,
        "explanation": "\"Once in a blue moon\" expressa algo muito raro."
      },
      {
        "prompt": "O que significa \"Cost an arm and a leg\"?",
        "speech": "Cost an arm and a leg",
        "emoji": "💸",
        "instruction": "Identifique o valor",
        "options": [
          "Ser doado de graça",
          "Ser muito barato",
          "Custar os olhos da cara / ser caríssimo",
          "Estar quebrado"
        ],
        "answer": 2,
        "explanation": "Significa custar uma fortuna."
      },
      {
        "prompt": "O que significa \"Bite the bullet\"?",
        "speech": "Bite the bullet",
        "emoji": "😬",
        "instruction": "Identifique a atitude",
        "options": [
          "Fugir do perigo",
          "Comer rápido demais",
          "Discutir com alguém",
          "Enfrentar uma situação difícil com coragem"
        ],
        "answer": 3,
        "explanation": "\"Bite the bullet\" é encarar o inevitável com firmeza."
      },
      {
        "prompt": "O que significa \"Spill the beans\"?",
        "speech": "Spill the beans",
        "emoji": "🤫",
        "instruction": "Identifique a atitude",
        "options": [
          "Revelar um segredo acidentalmente ou por fofoca",
          "Derrubar o prato de comida",
          "Cozinhar feijão",
          "Guardar silêncio absoluto"
        ],
        "answer": 0,
        "explanation": "\"Spill the beans\" significa abrir o bico / contar o segredo."
      },
      {
        "prompt": "O que significa \"Burn the midnight oil\"?",
        "speech": "Burn the midnight oil",
        "emoji": "🕯️",
        "instruction": "Identifique o hábito de estudo",
        "options": [
          "Desperdiçar energia elétrica",
          "Acender fogueiras à noite",
          "Trabalhar ou estudar até altas horas da madrugada",
          "Dormir muito cedo"
        ],
        "answer": 2,
        "explanation": "Significa virar a noite estudando ou trabalhando."
      },
      {
        "prompt": "O que significa \"See eye to eye with someone\"?",
        "speech": "See eye to eye",
        "emoji": "👀",
        "instruction": "Identifique a harmonia",
        "options": [
          "Ter a mesma altura física",
          "Olhar com raiva",
          "Concordar plenamente com alguém",
          "Usar óculos idênticos"
        ],
        "answer": 2,
        "explanation": "\"See eye to eye\" significa estar em total concordância."
      }
    ]
  },
  {
    "id": "es-1",
    "language": "es",
    "level": "A1 · Iniciante",
    "emoji": "🇪🇸",
    "title": "Pronúncia & Fonética Hispânica",
    "description": "Aprenda os sons do J, LL, Ñ e o R vibrante.",
    "xp": 20,
    "questions": [
      {
        "prompt": "Qual som tem a letra \"J\" em espanhol (ex: \"Jardín\")?",
        "speech": "Jardín",
        "emoji": "🌸",
        "instruction": "Escolha a pronúncia correta",
        "options": [
          "Som mudo",
          "Som de J em português",
          "Som gutural aspirado (como o R forte)",
          "Som de S"
        ],
        "answer": 2,
        "explanation": "O \"J\" em espanhol soa como um R aspirado forte."
      },
      {
        "prompt": "Como se pronuncia o dígrafo \"LL\" na maioria dos países hispânicos?",
        "speech": "Calle",
        "emoji": "🛣️",
        "instruction": "Identifique o fonema",
        "options": [
          "Som de \"L\" duplo demorado",
          "Som de \"i\" ou \"dj\" suave (ex: caye / cadje)",
          "Som de \"lh\" igual ao português",
          "Totalmente mudo"
        ],
        "answer": 1,
        "explanation": "O \"yeísmo\" pronuncia o LL como semivogal \"i\" ou \"dj\" brando."
      },
      {
        "prompt": "Qual palavra contém a consoante exclusiva do espanhol \"Ñ\"?",
        "speech": "Niño",
        "emoji": "🧒",
        "instruction": "Selecione a palavra com \"ñ\"",
        "options": [
          "Niño",
          "Nino",
          "Ninho",
          "Nito"
        ],
        "answer": 0,
        "explanation": "A letra \"Ñ\" tem som de \"nh\" em português."
      },
      {
        "prompt": "Como soa a letra \"Z\" na pronúncia padrão da Espanha?",
        "speech": "Zapato",
        "emoji": "👞",
        "instruction": "Identifique o som peninsular",
        "options": [
          "Com a língua entre os dentes (ceceio similar ao th inglês)",
          "Som de Z em zebra",
          "Som de S agudo",
          "Som de CH"
        ],
        "answer": 0,
        "explanation": "Na Espanha peninsular, a letra Z tem som interdental."
      },
      {
        "prompt": "Como soa o \"R\" duplo em \"Perro\" (cachorro)?",
        "speech": "Perro",
        "emoji": "🐕",
        "instruction": "Identifique a pronúncia do RR",
        "options": [
          "Na garganta como no francês",
          "Vibrante múltiplo na ponta da língua",
          "Mudo",
          "Como o S sonoro"
        ],
        "answer": 1,
        "explanation": "O \"RR\" espanhol vibra na ponta da língua contra os alvéolos."
      },
      {
        "prompt": "A letra \"H\" no início de \"Hola\" tem qual som?",
        "speech": "Hola",
        "emoji": "👋",
        "instruction": "Escolha o som da letra H",
        "options": [
          "Aspirada como em inglês",
          "Completamente muda",
          "Som de R forte",
          "Som de J"
        ],
        "answer": 1,
        "explanation": "Em espanhol a letra \"H\" é sempre muda (salvo em estrangeirismos)."
      },
      {
        "prompt": "Qual a diferença fonética entre \"B\" e \"V\" em espanhol?",
        "speech": "Beso y Vino",
        "emoji": "🍷",
        "instruction": "Identifique a regra",
        "options": [
          "Na maioria dos dialetos têm exatamente o mesmo som bilabial",
          "O V é labiodental vibrante e o B não",
          "O V é sempre mudo",
          "O B soa como P"
        ],
        "answer": 0,
        "explanation": "Em espanhol falado, B e V têm praticamente a mesma pronúncia."
      },
      {
        "prompt": "Como se pronuncia a letra \"C\" antes de E e I na Espanha?",
        "speech": "Cinco",
        "emoji": "5️⃣",
        "instruction": "Identifique o som",
        "options": [
          "Som de Ch",
          "Som de K",
          "Interdental (língua entre os dentes)",
          "Som de T"
        ],
        "answer": 2,
        "explanation": "Na Espanha, \"ce\" e \"ci\" ceceiam como o Z."
      },
      {
        "prompt": "Qual palavra significa \"amarelo\" com som de \"ll\"?",
        "speech": "Amarillo",
        "emoji": "🟡",
        "instruction": "Identifique a cor",
        "options": [
          "Azul",
          "Rojo",
          "Amarillo",
          "Verde"
        ],
        "answer": 2,
        "explanation": "Amarillo é amarelo em espanhol."
      },
      {
        "prompt": "Como se diz \"Espanha\" em espanhol com a letra Ñ?",
        "speech": "España",
        "emoji": "🇪🇸",
        "instruction": "Escolha a grafia correta",
        "options": [
          "Espanha",
          "España",
          "Espania",
          "Espana"
        ],
        "answer": 1,
        "explanation": "A grafia oficial é \"España\" com a letra ñ."
      }
    ]
  },
  {
    "id": "es-2",
    "language": "es",
    "level": "A1 · Iniciante",
    "emoji": "👋",
    "title": "Saludos, Cortesía & ¿Cómo te llamas?",
    "description": "Primeiras palavras para quebrar o gelo em espanhol.",
    "xp": 20,
    "questions": [
      {
        "prompt": "Como se responde educadamente a \"Mucho gusto\"?",
        "speech": "Mucho gusto",
        "emoji": "🤝",
        "instruction": "Selecione a resposta",
        "options": [
          "Encantado de conocerte",
          "Hasta la vista",
          "Tengo hambre",
          "Por favor"
        ],
        "answer": 0,
        "explanation": "\"Encantado\" ou \"El gusto es mío\" responde a Mucho gusto."
      },
      {
        "prompt": "Como se diz \"Por favor\" em espanhol?",
        "speech": "Por favor",
        "emoji": "🙏",
        "instruction": "Escolha a frase",
        "options": [
          "Con permiso",
          "Por gentileza",
          "De nada",
          "Por favor"
        ],
        "answer": 3,
        "explanation": "\"Por favor\" escreve-se da mesma forma."
      },
      {
        "prompt": "Como perguntar o nome de alguém informalmente?",
        "speech": "¿Cómo te llamas?",
        "emoji": "💬",
        "instruction": "Selecione a pergunta",
        "options": [
          "¿Cómo te llamas?",
          "¿Quién tiene nombre?",
          "¿Cuál es su llamar?",
          "¿Dónde te llamas?"
        ],
        "answer": 0,
        "explanation": "\"¿Cómo te llamas?\" pergunta o nome informalmente."
      },
      {
        "prompt": "Como responder \"Eu me chamo Carlos\"?",
        "speech": "Me llamo Carlos",
        "emoji": "👤",
        "instruction": "Escolha a resposta",
        "options": [
          "Carlos es mi",
          "Yo nombre Carlos",
          "Mi llamar Carlos",
          "Me llamo Carlos"
        ],
        "answer": 3,
        "explanation": "\"Me llamo...\" é a resposta natural."
      },
      {
        "prompt": "Qual saudação é usada durante a tarde?",
        "speech": "Buenas tardes",
        "emoji": "🌇",
        "instruction": "Identifique a saudação",
        "options": [
          "Buenas tardes",
          "Buenos días",
          "Buenas noches",
          "Hola tarde"
        ],
        "answer": 0,
        "explanation": "Buenas tardes é boa tarde."
      },
      {
        "prompt": "Como se diz \"Até logo\" em espanhol?",
        "speech": "Hasta luego",
        "emoji": "👋",
        "instruction": "Escolha a despedida",
        "options": [
          "Hasta ayer",
          "Hasta nunca",
          "Chao sempre",
          "Hasta luego"
        ],
        "answer": 3,
        "explanation": "\"Hasta luego\" significa até logo."
      },
      {
        "prompt": "O que significa \"Con permiso\"?",
        "speech": "Con permiso",
        "emoji": "🚪",
        "instruction": "Identifique a cortesia",
        "options": [
          "Obrigado",
          "Com licença",
          "Desculpe",
          "De nada"
        ],
        "answer": 1,
        "explanation": "\"Con permiso\" pede licença para passar ou entrar."
      },
      {
        "prompt": "Como se diz \"Muito obrigado\" em espanhol?",
        "speech": "Muchas gracias",
        "emoji": "💐",
        "instruction": "Escolha o agradecimento",
        "options": [
          "Muito obrigado",
          "Muchas gracias",
          "Mucha gratitud",
          "Graçias"
        ],
        "answer": 1,
        "explanation": "\"Muchas gracias\" expressa gratidão."
      },
      {
        "prompt": "Como se responde a \"Muchas gracias\"?",
        "speech": "De nada",
        "emoji": "😊",
        "instruction": "Escolha a resposta",
        "options": [
          "Por favor",
          "De nada",
          "Perdón",
          "Hasta pronto"
        ],
        "answer": 1,
        "explanation": "\"De nada\" é a resposta usual."
      },
      {
        "prompt": "Como dizer \"Desculpe\" para pedir desculpas por um esbarrão?",
        "speech": "Perdón / Disculpe",
        "emoji": "🙇",
        "instruction": "Identifique o pedido de desculpas",
        "options": [
          "Perdón (ou Disculpe)",
          "Gracias",
          "Hola",
          "Encantado"
        ],
        "answer": 0,
        "explanation": "Perdón ou Disculpe serve para pedir desculpas."
      }
    ]
  },
  {
    "id": "es-3",
    "language": "es",
    "level": "A1 · Iniciante",
    "emoji": "🔢",
    "title": "Números, Fechas & La Hora",
    "description": "Aprenda uno, dos, tres, lunes e ¿Qué hora es?",
    "xp": 25,
    "questions": [
      {
        "prompt": "Como se diz \"São duas horas da tarde\"?",
        "speech": "Son las dos de la tarde",
        "emoji": "⏰",
        "instruction": "Escolha a frase",
        "options": [
          "Son las dos de la tarde",
          "Es las dos de la tarde",
          "Son dos horas tarde",
          "Tiene dos horas"
        ],
        "answer": 0,
        "explanation": "A partir das 2h usa-se \"Son las...\". Para 1h: \"Es la una\"."
      },
      {
        "prompt": "Como se diz \"É uma hora em ponto\"?",
        "speech": "Es la una en punto",
        "emoji": "🕐",
        "instruction": "Identifique a hora singular",
        "options": [
          "Es la una en punto",
          "Son la una en punto",
          "Tiene una hora",
          "Está la una"
        ],
        "answer": 0,
        "explanation": "A 1h é singular: \"Es la una\"."
      },
      {
        "prompt": "Qual é o número \"15\" em espanhol?",
        "speech": "Quince",
        "emoji": "1️⃣5️⃣",
        "instruction": "Escolha o número",
        "options": [
          "Diez y cinco",
          "Cinco",
          "Cincuenta",
          "Quince"
        ],
        "answer": 3,
        "explanation": "15 em espanhol é \"Quince\"."
      },
      {
        "prompt": "Qual é o número \"30\" em espanhol?",
        "speech": "Treinta",
        "emoji": "3️⃣0️⃣",
        "instruction": "Escolha o número",
        "options": [
          "Treinta",
          "Trece",
          "Tres",
          "Treintena"
        ],
        "answer": 0,
        "explanation": "30 é Treinta (13 é Trece)."
      },
      {
        "prompt": "Como se diz \"Segunda-feira\" em espanhol?",
        "speech": "Lunes",
        "emoji": "📅",
        "instruction": "Identifique o dia",
        "options": [
          "Viernes",
          "Martes",
          "Miércoles",
          "Lunes"
        ],
        "answer": 3,
        "explanation": "Segunda-feira é Lunes."
      },
      {
        "prompt": "Qual é o dia de \"Sexta-feira\"?",
        "speech": "Viernes",
        "emoji": "🗓️",
        "instruction": "Identifique o dia",
        "options": [
          "Sábado",
          "Jueves",
          "Viernes",
          "Domingo"
        ],
        "answer": 2,
        "explanation": "Sexta-feira é Viernes."
      },
      {
        "prompt": "Qual mês do ano corresponde a \"Mayo\"?",
        "speech": "Mayo",
        "emoji": "🌸",
        "instruction": "Identifique o mês",
        "options": [
          "Maio",
          "Março",
          "Mês",
          "Meio"
        ],
        "answer": 0,
        "explanation": "Mayo é o mês de maio."
      },
      {
        "prompt": "Como se diz \"Hoje é sábado, 10 de outubro\"?",
        "speech": "Hoy es sábado diez de octubre",
        "emoji": "🍂",
        "instruction": "Selecione a data",
        "options": [
          "Sábado diez es hoy",
          "Hoy tiene diez octubre",
          "Ahora es sábado diez",
          "Hoy es sábado, diez de octubre"
        ],
        "answer": 3,
        "explanation": "Datas usam \"Hoy es [dia] de [mês]\"."
      },
      {
        "prompt": "Como se diz \"Quinze para as quatro\" (3:45)?",
        "speech": "Las cuatro menos cuarto",
        "emoji": "🕒",
        "instruction": "Identifique as horas",
        "options": [
          "Falta quince cuatro",
          "Tres y cuarenta cinco minutos",
          "Cuatro antes quince",
          "Las cuatro menos cuarto"
        ],
        "answer": 3,
        "explanation": "Em espanhol usa-se \"menos cuarto\" para 15 para a hora."
      },
      {
        "prompt": "Qual é a palavra para \"Ano bissexto\"?",
        "speech": "Año bisiesto",
        "emoji": "📆",
        "instruction": "Identifique o termo",
        "options": [
          "Año largo",
          "Año doble",
          "Año bisiesto",
          "Año de febrero"
        ],
        "answer": 2,
        "explanation": "Año bisiesto é o ano de 366 dias."
      }
    ]
  },
  {
    "id": "es-4",
    "language": "es",
    "level": "A1 · Iniciante",
    "emoji": "🥘",
    "title": "En el Café, Tapas & Restaurante",
    "description": "Peça la cuenta por favor, agua con gas e tapas.",
    "xp": 25,
    "questions": [
      {
        "prompt": "Como pedir a conta ao garçom?",
        "speech": "La cuenta, por favor",
        "emoji": "🧾",
        "instruction": "Selecione o pedido",
        "options": [
          "La cuenta, por favor",
          "El dinero, gracias",
          "La suma aquí",
          "El ticket ahora"
        ],
        "answer": 0,
        "explanation": "\"La cuenta, por favor\" é universal."
      },
      {
        "prompt": "Como pedir água mineral sem gás?",
        "speech": "Agua sin gas, por favor",
        "emoji": "💧",
        "instruction": "Escolha a frase",
        "options": [
          "Agua fresca sem gas",
          "Agua natural pura",
          "Agua quieta gracias",
          "Agua sin gas, por favor"
        ],
        "answer": 3,
        "explanation": "Usa-se \"Agua sin gas\"."
      },
      {
        "prompt": "O que são as tradicionais \"Tapas\" na Espanha?",
        "speech": "Tapas",
        "emoji": "🍢",
        "instruction": "Identifique o prato",
        "options": [
          "Pequenas porções de petiscos servidas com bebida",
          "Sobremesas de chocolate",
          "Sopas quentes de inverno",
          "Prato gigante individual"
        ],
        "answer": 0,
        "explanation": "Tapas são pequenas porções para compartilhar."
      },
      {
        "prompt": "Qual prato espanhol é feito com arroz, açafrão e frutos do mar?",
        "speech": "Paella",
        "emoji": "🥘",
        "instruction": "Identifique a iguaria",
        "options": [
          "Gazpacho",
          "Paella",
          "Churros",
          "Tortilla de patatas"
        ],
        "answer": 1,
        "explanation": "A Paella é o prato emblemático de Valência."
      },
      {
        "prompt": "O que significa \"La carta\" no restaurante?",
        "speech": "La carta",
        "emoji": "📋",
        "instruction": "Identifique o objeto",
        "options": [
          "A carta de correio",
          "O cardápio / menu",
          "A nota fiscal",
          "A toalha de mesa"
        ],
        "answer": 1,
        "explanation": "La carta é o cardápio."
      },
      {
        "prompt": "Como se diz \"Café com leite\"?",
        "speech": "Café con leche",
        "emoji": "☕",
        "instruction": "Identifique a bebida",
        "options": [
          "Café con crema",
          "Café con leche",
          "Leche con café",
          "Café cortado solo"
        ],
        "answer": 1,
        "explanation": "Café con leche é a bebida tradicional."
      },
      {
        "prompt": "O que é um \"Café solo\"?",
        "speech": "Café solo",
        "emoji": "☕",
        "instruction": "Identifique o preparo",
        "options": [
          "Café preto / expresso puro sem leite",
          "Café com canela",
          "Café gelado",
          "Café com açúcar duplo"
        ],
        "answer": 0,
        "explanation": "Café solo é o expresso puro."
      },
      {
        "prompt": "Como dizer \"Está delicioso!\" em espanhol?",
        "speech": "¡Está muy rico!",
        "emoji": "😋",
        "instruction": "Escolha o elogio gastronômico",
        "options": [
          "¡Está muy rico! (ou ¡Está delicioso!)",
          "¡Es mucho sabor!",
          "¡Tiene gusto alto!",
          "¡Come bien!"
        ],
        "answer": 0,
        "explanation": "Para comida usa-se \"estar rico/a\"."
      },
      {
        "prompt": "O que é a \"Tortilla de patatas\"?",
        "speech": "Tortilla de patatas",
        "emoji": "🥔",
        "instruction": "Identifique a receita",
        "options": [
          "Pão de milho mexicano",
          "Omelete típica feita com ovos e batatas",
          "Torta doce de maçã",
          "Bolo de cenoura"
        ],
        "answer": 1,
        "explanation": "A tortilla espanhola leva ovos e batatas."
      },
      {
        "prompt": "Como pedir licença para o garçom?",
        "speech": "¡Camarero, por favor!",
        "emoji": "🛎️",
        "instruction": "Chame o garçom",
        "options": [
          "¡Camarero, por favor! (ou ¡Mesero!)",
          "¡Garçom aqui!",
          "¡Señor de la comida!",
          "¡Tráigame ya!"
        ],
        "answer": 0,
        "explanation": "Camarero (Espanha) ou Mesero (América Latina)."
      }
    ]
  },
  {
    "id": "es-5",
    "language": "es",
    "level": "A1 · Iniciante",
    "emoji": "⚖️",
    "title": "Los Verbos Ser y Estar",
    "description": "Descubra quando usar es vs está em espanhol.",
    "xp": 25,
    "questions": [
      {
        "prompt": "Complete: \"Madrid ___ la capital de España.\"",
        "speech": "Madrid es la capital de España",
        "emoji": "🏛️",
        "instruction": "Escolha ser ou estar",
        "options": [
          "son",
          "está",
          "es",
          "están"
        ],
        "answer": 2,
        "explanation": "Para fatos permanentes usa-se \"es\" (verbo ser)."
      },
      {
        "prompt": "Complete com o estado emocional transitório: \"Yo ___ muy cansado hoy.\"",
        "speech": "Estoy muy cansado hoy",
        "emoji": "🥱",
        "instruction": "Escolha ser ou estar",
        "options": [
          "soy",
          "estoy",
          "es",
          "está"
        ],
        "answer": 1,
        "explanation": "Estados físicos ou emocionais passageiros usam \"estar\"."
      },
      {
        "prompt": "Qual a diferença entre \"es listo\" e \"está listo\"?",
        "speech": "Es listo vs Está listo",
        "emoji": "🧠",
        "instruction": "Interprete a nuance",
        "options": [
          "\"Está listo\" é rápido",
          "São idênticos",
          "\"Es listo\" é inteligente; \"Está listo\" é preparado / pronto",
          "\"Es listo\" é preguiçoso"
        ],
        "answer": 2,
        "explanation": "Ser listo = inteligente; Estar listo = pronto."
      },
      {
        "prompt": "Complete: \"Mis amigos ___ en la playa.\"",
        "speech": "Están en la playa",
        "emoji": "🏖️",
        "instruction": "Localização física",
        "options": [
          "es",
          "son",
          "están",
          "está"
        ],
        "answer": 2,
        "explanation": "Para localização física no espaço usa-se o verbo \"estar\"."
      },
      {
        "prompt": "Complete: \"Nosotros ___ brasileños.\"",
        "speech": "Somos brasileños",
        "emoji": "🇧🇷",
        "instruction": "Nacionalidade",
        "options": [
          "son",
          "estamos",
          "somos",
          "sois"
        ],
        "answer": 2,
        "explanation": "Nacionalidade exige o verbo \"ser\": somos."
      },
      {
        "prompt": "Complete: \"El café ___ frío.\"",
        "speech": "El café está frío",
        "emoji": "☕",
        "instruction": "Temperatura momentânea",
        "options": [
          "son",
          "es",
          "está",
          "están"
        ],
        "answer": 2,
        "explanation": "Temperatura de alimentos usa \"estar\": está frío."
      },
      {
        "prompt": "Complete: \"La fiesta ___ en mi casa.\"",
        "speech": "La fiesta es en mi casa",
        "emoji": "🎉",
        "instruction": "Local de eventos",
        "options": [
          "es",
          "está",
          "son",
          "fue"
        ],
        "answer": 0,
        "explanation": "Acontecimentos e eventos usam \"ser\" para o local: \"La fiesta es...\"."
      },
      {
        "prompt": "Complete: \"Ella ___ médica en el hospital.\"",
        "speech": "Ella es médica",
        "emoji": "👩‍⚕️",
        "instruction": "Profissão",
        "options": [
          "era",
          "está",
          "son",
          "es"
        ],
        "answer": 3,
        "explanation": "Profissões permanentes usam \"ser\"."
      },
      {
        "prompt": "Complete: \"La puerta ___ abierta.\"",
        "speech": "La puerta está abierta",
        "emoji": "🚪",
        "instruction": "Estado da porta",
        "options": [
          "está",
          "es",
          "son",
          "están"
        ],
        "answer": 0,
        "explanation": "Estado resultante de uma ação usa \"estar\": está abierta."
      },
      {
        "prompt": "Qual a forma conjugada de \"Yo\" no presente do verbo SER?",
        "speech": "Yo soy",
        "emoji": "👤",
        "instruction": "Conjugue o verbo ser",
        "options": [
          "somos",
          "estoy",
          "eres",
          "soy"
        ],
        "answer": 3,
        "explanation": "Yo soy (verbo ser)."
      }
    ]
  },
  {
    "id": "es-6",
    "language": "es",
    "level": "A2 · Básico",
    "emoji": "👨‍👩‍👧",
    "title": "La Familia & Posesivos",
    "description": "Mi padre, tu hermana, su primo e nuestros amigos.",
    "xp": 25,
    "questions": [
      {
        "prompt": "Como se diz \"minha mãe\" em espanhol?",
        "speech": "Mi madre",
        "emoji": "👩",
        "instruction": "Escolha a tradução",
        "options": [
          "La madre mía",
          "Mia madre",
          "Mi madre",
          "Me madre"
        ],
        "answer": 2,
        "explanation": "O possessivo antes do substantivo é \"mi\"."
      },
      {
        "prompt": "Como se diz \"Meu pai e minha mãe\" em uma palavra?",
        "speech": "Mis padres",
        "emoji": "👨‍👩‍👧",
        "instruction": "Identifique o termo",
        "options": [
          "Mis padres",
          "Mis papaces",
          "Mis parentes",
          "Mis viejos solares"
        ],
        "answer": 0,
        "explanation": "Padres engloba pai e mãe."
      },
      {
        "prompt": "O que significa \"Abuelo\" e \"Abuela\"?",
        "speech": "Abuelo y abuela",
        "emoji": "👴👵",
        "instruction": "Identifique os parentes",
        "options": [
          "Tio e Tia",
          "Avô e Avó",
          "Padrinho e Madrinha",
          "Primo e Prima"
        ],
        "answer": 1,
        "explanation": "Abuelo é avô e abuela é avó."
      },
      {
        "prompt": "Como se diz \"Irmão mais velho\"?",
        "speech": "Hermano mayor",
        "emoji": "👦",
        "instruction": "Identifique o termo",
        "options": [
          "Hermano grande",
          "Hermano viejo",
          "Hermano mayor",
          "Hermano alto"
        ],
        "answer": 2,
        "explanation": "Mayor expressa mais velho em idade."
      },
      {
        "prompt": "Como se diz \"Irmão mais novo\"?",
        "speech": "Hermano menor",
        "emoji": "👶",
        "instruction": "Identifique o termo",
        "options": [
          "Hermano pequeño",
          "Hermano joven",
          "Hermano menor",
          "Hermano bajo"
        ],
        "answer": 2,
        "explanation": "Menor expressa mais novo em idade."
      },
      {
        "prompt": "Qual o significado de \"Tío\" e \"Tía\"?",
        "speech": "Tío y Tía",
        "emoji": "🏡",
        "instruction": "Identifique os parentes",
        "options": [
          "Sogro e Sogra",
          "Tio e Tia",
          "Primo e Prima",
          "Genro e Nora"
        ],
        "answer": 1,
        "explanation": "Tío é tio e tía é tia."
      },
      {
        "prompt": "O que significa \"Hijo\" e \"Hija\"?",
        "speech": "Hijo e Hija",
        "emoji": "👶",
        "instruction": "Identifique o parentesco",
        "options": [
          "Sobrinho e Sobrinha",
          "Filho e Filha",
          "Irmão e Irmã",
          "Enteado e Enteada"
        ],
        "answer": 1,
        "explanation": "Hijo é filho e hija é filha."
      },
      {
        "prompt": "Como se diz \"Nosso cachorro\"?",
        "speech": "Nuestro perro",
        "emoji": "🐕",
        "instruction": "Escolha o possessivo plural",
        "options": [
          "Nuestras perro",
          "Nosso perro",
          "De nosotros perro",
          "Nuestro perro"
        ],
        "answer": 3,
        "explanation": "Nuestro é o possessivo de 1ª pessoa plural masculino."
      },
      {
        "prompt": "O que significa \"Suegro\" e \"Suegra\"?",
        "speech": "Suegro y Suegra",
        "emoji": "👵👴",
        "instruction": "Identifique os parentes por casamento",
        "options": [
          "Padrasto e Madrasta",
          "Genro e Nora",
          "Cunhado e Cunhada",
          "Sogro e Sogra"
        ],
        "answer": 3,
        "explanation": "Suegro é sogro e suegra é sogra."
      },
      {
        "prompt": "Como se diz \"Primo\" e \"Prima\"?",
        "speech": "Primo y Prima",
        "emoji": "👧👦",
        "instruction": "Identifique os termos",
        "options": [
          "Sobrino y Sobrina",
          "Primo y Prima",
          "Hermano y Hermana",
          "Nieto y Nieta"
        ],
        "answer": 1,
        "explanation": "Primo e prima escrevem-se da mesma forma."
      }
    ]
  },
  {
    "id": "es-7",
    "language": "es",
    "level": "A2 · Básico",
    "emoji": "⏰",
    "title": "Rutina Diaria & Verbos Reflexivos",
    "description": "Me levanto temprano, me ducho e me acuesto.",
    "xp": 30,
    "questions": [
      {
        "prompt": "Como se diz \"Eu acordo às sete\"?",
        "speech": "Me despierto a las siete",
        "emoji": "⏰",
        "instruction": "Selecione a forma reflexiva",
        "options": [
          "Despiértome a las siete",
          "Yo despierto en siete",
          "Me despierto a las siete",
          "Me levanto siete"
        ],
        "answer": 2,
        "explanation": "Despertarse é reflexivo: \"Me despierto\"."
      },
      {
        "prompt": "Qual pronome reflexivo acompanha a 1ª pessoa \"Yo\"?",
        "speech": "Me lavo",
        "emoji": "🪞",
        "instruction": "Identifique o pronome",
        "options": [
          "te",
          "me",
          "se",
          "nos"
        ],
        "answer": 1,
        "explanation": "O pronome reflexivo de Yo é \"me\"."
      },
      {
        "prompt": "Como se diz \"Ele toma banho todos os dias\"?",
        "speech": "Él se ducha todos los días",
        "emoji": "🚿",
        "instruction": "Escolha a frase",
        "options": [
          "Él es duchando",
          "Él ducha cada día",
          "Él toma baño diario",
          "Él se ducha todos los días"
        ],
        "answer": 3,
        "explanation": "Ducharse com él vira \"se ducha\"."
      },
      {
        "prompt": "O que significa o verbo reflexivo \"Acostarse\"?",
        "speech": "Acostarse",
        "emoji": "🛏️",
        "instruction": "Identifique o significado",
        "options": [
          "Ir para a cama / deitar-se para dormir",
          "Acordar cedo",
          "Vestir uma camisa",
          "Almoçar"
        ],
        "answer": 0,
        "explanation": "Acostarse significa deitar-se para dormir."
      },
      {
        "prompt": "Como conjugar acostarse para Yo no presente (o-ue)?",
        "speech": "Me acuesto a las diez",
        "emoji": "🕙",
        "instruction": "Conjugue o verbo irregular",
        "options": [
          "Me acosto",
          "Me acuesto",
          "Yo acuesto",
          "Acóstome"
        ],
        "answer": 1,
        "explanation": "Acostarse tem ditongação: o -> ue: me acuesto."
      },
      {
        "prompt": "Como se diz \"Nós nos vestimos rapidamente\"?",
        "speech": "Nos vestimos rápidamente",
        "emoji": "👕",
        "instruction": "Selecione a frase plural",
        "options": [
          "Nos vestimos rápidamente",
          "Nosotros vestimos rápido",
          "Se vestimos veloz",
          "Nos vestiamos ahora"
        ],
        "answer": 0,
        "explanation": "Vestirse com nosotros usa o pronome \"nos\"."
      },
      {
        "prompt": "O que significa \"Lavarse los dientes\"?",
        "speech": "Lavarse los dientes",
        "emoji": "🪥",
        "instruction": "Identifique o hábito higiênico",
        "options": [
          "Pentear o cabelo",
          "Lavar o rosto",
          "Escovar os dentes",
          "Lavar as mãos"
        ],
        "answer": 2,
        "explanation": "Em espanhol costuma-se dizer \"lavarse los dientes\" ou \"cepillarse\"."
      },
      {
        "prompt": "O que significa \"Peinarse\"?",
        "speech": "Peinarse",
        "emoji": "💇",
        "instruction": "Identifique a ação",
        "options": [
          "Cortar as unhas",
          "Pentear o cabelo",
          "Fazer a barba",
          "Secar os pés"
        ],
        "answer": 1,
        "explanation": "Peinarse significa pentear o cabelo com pente (peine)."
      },
      {
        "prompt": "Como dizer \"Você se veste muito bem\"?",
        "speech": "Te vistes muy bien",
        "emoji": "👗",
        "instruction": "Escolha a frase",
        "options": [
          "Te vientes bien",
          "Tú vistes bonito",
          "Te vistes muy bien",
          "Vísteste bien"
        ],
        "answer": 2,
        "explanation": "Vestirse com tú vira \"te vistes\"."
      },
      {
        "prompt": "Como se diz \"Eu vou para o trabalho de metrô\"?",
        "speech": "Voy al trabajo en metro",
        "emoji": "🚇",
        "instruction": "Identifique o meio de transporte",
        "options": [
          "Yo voy trabalho metro",
          "Voy al trabajo en metro",
          "Voy para metro trabajo",
          "Ando em metrô laboral"
        ],
        "answer": 1,
        "explanation": "Usa-se a preposição \"en\" para meios de transporte: en metro, en autobús."
      }
    ]
  },
  {
    "id": "es-8",
    "language": "es",
    "level": "A2 · Básico",
    "emoji": "🗺️",
    "title": "Direcciones & Transporte Público",
    "description": "Gira a la derecha, siga recto e el metro.",
    "xp": 30,
    "questions": [
      {
        "prompt": "O que significa \"Gira a la derecha\"?",
        "speech": "Gira a la derecha",
        "emoji": "➡️",
        "instruction": "Identifique o sentido",
        "options": [
          "Pare o carro",
          "Vire à esquerda",
          "Siga em frente",
          "Vire à direita"
        ],
        "answer": 3,
        "explanation": "\"Derecha\" é direita (\"Izquierda\" é esquerda)."
      },
      {
        "prompt": "O que significa \"Siga todo recto\"?",
        "speech": "Siga todo recto",
        "emoji": "⬆️",
        "instruction": "Identifique a orientação",
        "options": [
          "Dê meia volta",
          "Siga sempre em frente",
          "Vire à esquerda na praça",
          "Atravesse o parque"
        ],
        "answer": 1,
        "explanation": "\"Todo recto\" significa sempre em frente."
      },
      {
        "prompt": "Como perguntar onde fica o ponto de ônibus?",
        "speech": "¿Dónde está la parada de autobús?",
        "emoji": "🚏",
        "instruction": "Selecione a pergunta",
        "options": [
          "¿Dónde para el carro?",
          "¿Dónde es el bus point?",
          "¿Cuál estación de bus?",
          "¿Dónde está la parada de autobús?"
        ],
        "answer": 3,
        "explanation": "Parada de autobús é o ponto de ônibus."
      },
      {
        "prompt": "Como se chama a estação de metrô?",
        "speech": "Estación de metro",
        "emoji": "🚇",
        "instruction": "Identifique o local",
        "options": [
          "Paso de metro",
          "Parada subterránea",
          "Terminal de tren",
          "Estación de metro"
        ],
        "answer": 3,
        "explanation": "Estación de metro é a estação ferroviária urbana."
      },
      {
        "prompt": "O que significa \"Cruce la calle\"?",
        "speech": "Cruce la calle",
        "emoji": "🚶",
        "instruction": "Identifique a instrução",
        "options": [
          "Corra pela pista",
          "Pare na calçada",
          "Atravesse a rua",
          "Volte para a esquina"
        ],
        "answer": 2,
        "explanation": "Cruzar la calle é atravessar a rua."
      },
      {
        "prompt": "O que é \"La esquina\"?",
        "speech": "La esquina",
        "emoji": "📐",
        "instruction": "Identifique o ponto geométrico urbano",
        "options": [
          "O meio do quarteirão",
          "A esquina da rua",
          "A praça central",
          "A ponte"
        ],
        "answer": 1,
        "explanation": "La esquina é a esquina."
      },
      {
        "prompt": "Como dizer que algo fica \"Perto daqui\"?",
        "speech": "Está cerca de aquí",
        "emoji": "📍",
        "instruction": "Escolha a expressão de proximidade",
        "options": [
          "Tiene cerca ahora",
          "Está lejos de aquí",
          "Está cerca de aquí",
          "Es junto aquí"
        ],
        "answer": 2,
        "explanation": "Cerca significa perto (lejos significa longe)."
      },
      {
        "prompt": "Como dizer que um museu fica \"Longe daqui\"?",
        "speech": "Está muy lejos de aquí",
        "emoji": "🚗",
        "instruction": "Escolha a expressão de distância",
        "options": [
          "Tiene leguas acá",
          "Está cerca de aquí",
          "Queda distante agora",
          "Está muy lejos de aquí"
        ],
        "answer": 3,
        "explanation": "Lejos significa longe."
      },
      {
        "prompt": "O que é \"El semáforo\"?",
        "speech": "El semáforo",
        "emoji": "🚦",
        "instruction": "Identifique o equipamento urbano",
        "options": [
          "A calçada de pedestres",
          "A placa de pare",
          "O radar de velocidade",
          "O semáforo / sinal de trânsito"
        ],
        "answer": 3,
        "explanation": "Semáforo é o sinal luminoso de trânsito."
      },
      {
        "prompt": "Como perguntar \"Quanto custa o bilhete de metrô?\"?",
        "speech": "¿Cuánto cuesta el billete de metro?",
        "emoji": "🎫",
        "instruction": "Selecione a pergunta",
        "options": [
          "¿Cuál precio metro ticket?",
          "¿Cuánto cuesta el billete de metro?",
          "¿Cuánto vale el pase metro?",
          "¿Qué dinero el metro?"
        ],
        "answer": 1,
        "explanation": "Billete (Espanha) ou boleto (América Latina) é a passagem."
      }
    ]
  },
  {
    "id": "es-9",
    "language": "es",
    "level": "A2 · Básico",
    "emoji": "🛍️",
    "title": "De Compras, Ropa & ¿Cuánto cuesta?",
    "description": "Compre roupas, pergunte tamanhos e pechinche.",
    "xp": 25,
    "questions": [
      {
        "prompt": "Como perguntar o preço de uma jaqueta?",
        "speech": "¿Cuánto cuesta esta chaqueta?",
        "emoji": "🧥",
        "instruction": "Escolha a pergunta",
        "options": [
          "¿Cuánto cuesta esta chaqueta?",
          "¿Qué vale el saco?",
          "¿Cuánto es chaqueta?",
          "¿Qué precio tiene?"
        ],
        "answer": 0,
        "explanation": "\"¿Cuánto cuesta...?\" é a pergunta padrão."
      },
      {
        "prompt": "O que significa \"La talla\"?",
        "speech": "La talla",
        "emoji": "📏",
        "instruction": "Identifique o termo de vestuário",
        "options": [
          "A cor da peça",
          "O tamanho da roupa (P, M, G)",
          "O tecido de algodão",
          "O preço de etiqueta"
        ],
        "answer": 1,
        "explanation": "Talla refere-se ao tamanho de roupas."
      },
      {
        "prompt": "Qual palavra significa \"Sapato\"?",
        "speech": "Zapato",
        "emoji": "👞",
        "instruction": "Identifique o calçado",
        "options": [
          "Guante",
          "Sombrero",
          "Zapato",
          "Camisa"
        ],
        "answer": 2,
        "explanation": "Zapato é sapato."
      },
      {
        "prompt": "Onde você experimenta as roupas em uma loja?",
        "speech": "En el probador",
        "emoji": "🚪",
        "instruction": "Identifique o local da loja",
        "options": [
          "En la caja",
          "En el baño",
          "En el probador",
          "En el escaparate"
        ],
        "answer": 2,
        "explanation": "Probador é o provador da loja."
      },
      {
        "prompt": "O que significa \"El escaparate\"?",
        "speech": "El escaparate",
        "emoji": "🪟",
        "instruction": "Identifique o termo comercial",
        "options": [
          "A vitrine da loja",
          "A sacola de compras",
          "O caixa registrador",
          "O cabide de metal"
        ],
        "answer": 0,
        "explanation": "Escaparate é a vitrine."
      },
      {
        "prompt": "Como pedir uma camiseta em tamanho maior?",
        "speech": "¿Tiene una talla más grande?",
        "emoji": "👕",
        "instruction": "Escolha o pedido",
        "options": [
          "Quiero camisa gigante",
          "¿Tiene una talla más grande?",
          "Dame talla alta",
          "Pon camisa mayor"
        ],
        "answer": 1,
        "explanation": "\"Una talla más grande\" pede um tamanho maior."
      },
      {
        "prompt": "O que significa \"Rebajas\"?",
        "speech": "Rebajas",
        "emoji": "🏷️",
        "instruction": "Identifique a época comercial",
        "options": [
          "Roupas com defeito",
          "Novos lançamentos caros",
          "Liquidações / Promoções de desconto",
          "Fechamento da loja"
        ],
        "answer": 2,
        "explanation": "Rebajas são as liquidações anuais na Espanha."
      },
      {
        "prompt": "Como se diz \"Camisa branca de algodão\"?",
        "speech": "Camisa blanca de algodón",
        "emoji": "👔",
        "instruction": "Identifique o material",
        "options": [
          "Camisa blanca de cuero",
          "Camisa blanca de lana",
          "Camisa blanca de seda",
          "Camisa blanca de algodón"
        ],
        "answer": 3,
        "explanation": "Algodón significa algodão."
      },
      {
        "prompt": "O que é \"Pagar en efectivo\"?",
        "speech": "Pagar en efectivo",
        "emoji": "💵",
        "instruction": "Identifique a forma de pagamento",
        "options": [
          "Pagar com cartão de crédito",
          "Pagar com dinheiro em espécie / notas",
          "Pagar parcelado em 12 vezes",
          "Pagar por pix"
        ],
        "answer": 1,
        "explanation": "En efectivo significa em dinheiro vivo."
      },
      {
        "prompt": "Como dizer \"Vou levar esta camiseta\"?",
        "speech": "Me llevo esta camiseta",
        "emoji": "🛍️",
        "instruction": "Escolha a decisão de compra",
        "options": [
          "Compro llevar esto",
          "Yo tomo esta camisa",
          "Pongo camiseta para mí",
          "Me llevo esta camiseta"
        ],
        "answer": 3,
        "explanation": "\"Me llevo...\" é a frase típica ao decidir levar um produto."
      }
    ]
  },
  {
    "id": "es-10",
    "language": "es",
    "level": "A2 · Básico",
    "emoji": "🏡",
    "title": "La Casa, Muebles & Habitaciones",
    "description": "El salón, la cocina, el dormitorio e el balcón.",
    "xp": 25,
    "questions": [
      {
        "prompt": "Onde fica a cama?",
        "speech": "En el dormitorio",
        "emoji": "🛏️",
        "instruction": "Selecione o cômodo",
        "options": [
          "En el pasillo",
          "En la cocina",
          "En el baño",
          "En el dormitorio"
        ],
        "answer": 3,
        "explanation": "\"Dormitorio\" ou \"habitación\" é o quarto."
      },
      {
        "prompt": "Como se chama a \"Sala de estar\"?",
        "speech": "El salón / La sala de estar",
        "emoji": "🛋️",
        "instruction": "Identifique o cômodo",
        "options": [
          "El comedor",
          "El salón",
          "La terraza",
          "El ático"
        ],
        "answer": 1,
        "explanation": "El salón é a sala de estar."
      },
      {
        "prompt": "Onde você cozinha o jantar?",
        "speech": "En la cocina",
        "emoji": "🍳",
        "instruction": "Identifique o cômodo",
        "options": [
          "En el sótano",
          "En el garaje",
          "En la cocina",
          "En el tejado"
        ],
        "answer": 2,
        "explanation": "Cocina é a cozinha."
      },
      {
        "prompt": "O que significa \"La nevera\" ou \"El frigorífico\"?",
        "speech": "La nevera",
        "emoji": "🧊",
        "instruction": "Identifique o eletrodoméstico",
        "options": [
          "A geladeira",
          "O fogão",
          "O micro-ondas",
          "A máquina de lavar"
        ],
        "answer": 0,
        "explanation": "Nevera ou frigorífico é a geladeira."
      },
      {
        "prompt": "O que é \"El sofá\"?",
        "speech": "El sofá",
        "emoji": "🛋️",
        "instruction": "Identifique o móvel",
        "options": [
          "O sofá",
          "A poltrona",
          "A cadeira",
          "A mesa de centro"
        ],
        "answer": 0,
        "explanation": "El sofá é o sofá."
      },
      {
        "prompt": "Como se chama a \"Varanda\" do apartamento?",
        "speech": "El balcón / La terraza",
        "emoji": "🌅",
        "instruction": "Identifique o espaço",
        "options": [
          "El balcón (ou La terraza)",
          "El desván",
          "El patio interior",
          "El portal"
        ],
        "answer": 0,
        "explanation": "Balcón ou terraza é a varanda."
      },
      {
        "prompt": "O que significa \"La ventana\"?",
        "speech": "La ventana",
        "emoji": "🪟",
        "instruction": "Identifique a parte da casa",
        "options": [
          "A janela",
          "A porta de entrada",
          "A cortina de seda",
          "O trinco"
        ],
        "answer": 0,
        "explanation": "Ventana é janela."
      },
      {
        "prompt": "Como se diz \"Espelho do banheiro\"?",
        "speech": "Espejo del baño",
        "emoji": "🪞",
        "instruction": "Identifique o objeto",
        "options": [
          "Vidrio del baño",
          "Cristal del baño",
          "Reflejo del baño",
          "Espejo del baño"
        ],
        "answer": 3,
        "explanation": "Espejo é espelho."
      },
      {
        "prompt": "O que é \"La alfombra\"?",
        "speech": "La alfombra",
        "emoji": "🧶",
        "instruction": "Identifique o item de decoração",
        "options": [
          "O quadro de parede",
          "A almofada",
          "A cortina",
          "O tapete"
        ],
        "answer": 3,
        "explanation": "Alfombra é tapete."
      },
      {
        "prompt": "O que significa \"El ascensor\"?",
        "speech": "El ascensor",
        "emoji": "🛗",
        "instruction": "Identifique a máquina",
        "options": [
          "A escada em caracol",
          "O elevador do prédio",
          "O corredor principal",
          "A garagem"
        ],
        "answer": 1,
        "explanation": "Ascensor é o elevador."
      }
    ]
  },
  {
    "id": "es-11",
    "language": "es",
    "level": "B1 · Intermediário",
    "emoji": "📆",
    "title": "Pretérito Indefinido: Acciones Pasadas",
    "description": "Ayer viajé, comí paella e compré billetes.",
    "xp": 35,
    "questions": [
      {
        "prompt": "Qual o passado de \"hablar\" para \"yo\" no Pretérito Indefinido?",
        "speech": "Hablé",
        "emoji": "🗣️",
        "instruction": "Escolha a terminação correta",
        "options": [
          "Hablo",
          "Hablaba",
          "He hablado",
          "Hablé"
        ],
        "answer": 3,
        "explanation": "A terminação de 1ª pessoa no Indefinido (-ar) é \"-é\": hablé."
      },
      {
        "prompt": "Qual o passado irregular de \"ir\" para \"yo\"?",
        "speech": "Fui",
        "emoji": "🚶",
        "instruction": "Identifique o verbo",
        "options": [
          "Iba",
          "Fui",
          "He ido",
          "Fue"
        ],
        "answer": 1,
        "explanation": "Yo fui a Madrid ontem."
      },
      {
        "prompt": "Qual o passado de \"comer\" para \"nosotros\"?",
        "speech": "Comimos",
        "emoji": "🍽️",
        "instruction": "Conjugue o verbo",
        "options": [
          "Comemos",
          "Comíamos",
          "Comimos",
          "Comieron"
        ],
        "answer": 2,
        "explanation": "Comimos é comemos no passado."
      },
      {
        "prompt": "Complete com pretérito indefinido: \"Ayer ellos ___ una película.\"",
        "speech": "Ayer vieron una película",
        "emoji": "🎬",
        "instruction": "Conjugue ver",
        "options": [
          "han visto",
          "veían",
          "ven",
          "vieron"
        ],
        "answer": 3,
        "explanation": "Vieron é o passado para ellos."
      },
      {
        "prompt": "Qual o passado de \"estar\" para \"yo\" (irregular)?",
        "speech": "Estuve",
        "emoji": "📍",
        "instruction": "Conjugue o verbo estar",
        "options": [
          "Estuvei",
          "Estaba",
          "Estuve",
          "Esté"
        ],
        "answer": 2,
        "explanation": "Estar tem raiz irregular no passado: estuve, estuviste, estuvo."
      },
      {
        "prompt": "Qual o passado de \"hacer\" para \"él\"?",
        "speech": "Hizo",
        "emoji": "✍️",
        "instruction": "Identifique a grafia correta",
        "options": [
          "Hizó",
          "Hizo",
          "Hice",
          "Hacio"
        ],
        "answer": 1,
        "explanation": "Él hizo a tarefa com a letra Z."
      },
      {
        "prompt": "O que significa a palavra temporal \"Ayer\"?",
        "speech": "Ayer",
        "emoji": "🔙",
        "instruction": "Identifique o dia",
        "options": [
          "Semana passada",
          "Hoje",
          "Amanhã",
          "Ontem"
        ],
        "answer": 3,
        "explanation": "Ayer significa ontem."
      },
      {
        "prompt": "O que significa \"Anoche\"?",
        "speech": "Anoche",
        "emoji": "🌙",
        "instruction": "Identifique o período",
        "options": [
          "Ontem à noite",
          "Hoje à noite",
          "Amanhã cedo",
          "Madrugada"
        ],
        "answer": 0,
        "explanation": "Anoche significa ontem à noite."
      },
      {
        "prompt": "Qual o passado de \"tener\" para \"tú\"?",
        "speech": "Tuviste",
        "emoji": "💼",
        "instruction": "Conjugue tener",
        "options": [
          "Tenías",
          "Tuviste",
          "Tuvisteis",
          "Tenes"
        ],
        "answer": 1,
        "explanation": "Tú tuviste uma boa ideia."
      },
      {
        "prompt": "Complete: \"El año pasado ___ a México.\"",
        "speech": "El año pasado viajamos a México",
        "emoji": "🇲🇽",
        "instruction": "Complete no passado pontual",
        "options": [
          "viajaremos",
          "viajábamos",
          "viajamos",
          "viajan"
        ],
        "answer": 2,
        "explanation": "Ação concluída no ano passado usa o Pretérito Indefinido."
      }
    ]
  },
  {
    "id": "es-12",
    "language": "es",
    "level": "B1 · Intermediário",
    "emoji": "🎯",
    "title": "Por vs Para Sin Errores",
    "description": "Diferencie motivo (\"por ti\") de finalidade (\"para trabajar\").",
    "xp": 35,
    "questions": [
      {
        "prompt": "Complete: \"Estudio español ___ vivir en Barcelona.\"",
        "speech": "Estudio español para vivir en Barcelona",
        "emoji": "🇪🇸",
        "instruction": "Escolha por ou para",
        "options": [
          "de",
          "por",
          "para",
          "con"
        ],
        "answer": 2,
        "explanation": "Para objetivo/finalidade com infinitivo usa-se \"para\"."
      },
      {
        "prompt": "Complete a expressão de gratidão: \"Muchas gracias ___ tu ayuda.\"",
        "speech": "Muchas gracias por tu ayuda",
        "emoji": "🙏",
        "instruction": "Motivo do agradecimento",
        "options": [
          "para",
          "por",
          "de",
          "en"
        ],
        "answer": 1,
        "explanation": "Para expressar motivo de agradecimento usa-se \"por\": Gracias por..."
      },
      {
        "prompt": "Complete o prazo limite: \"El informe debe estar listo ___ el viernes.\"",
        "speech": "Para el viernes",
        "emoji": "📅",
        "instruction": "Prazo no tempo",
        "options": [
          "por",
          "para",
          "en",
          "durante"
        ],
        "answer": 1,
        "explanation": "Para prazos limites de entrega usa-se \"para\": para el viernes."
      },
      {
        "prompt": "Complete o meio de locomoção ou passagem: \"Caminamos ___ el parque.\"",
        "speech": "Por el parque",
        "emoji": "🌳",
        "instruction": "Movimento através de um lugar",
        "options": [
          "sobre",
          "para",
          "por",
          "hacia"
        ],
        "answer": 2,
        "explanation": "Movimento através de um espaço usa \"por\": caminar por el parque."
      },
      {
        "prompt": "Complete a troca de valores: \"Te vendo mi bicicleta ___ cincuenta euros.\"",
        "speech": "Por cincuenta euros",
        "emoji": "🚲",
        "instruction": "Troca ou preço",
        "options": [
          "por",
          "para",
          "de",
          "con"
        ],
        "answer": 0,
        "explanation": "Preço e trocas financeiras usam \"por\": por 50 euros."
      },
      {
        "prompt": "Complete o destinatário de um presente: \"Este regalo es ___ mi hermana.\"",
        "speech": "Para mi hermana",
        "emoji": "🎁",
        "instruction": "Destinatário final",
        "options": [
          "con",
          "por",
          "para",
          "de"
        ],
        "answer": 2,
        "explanation": "Destinatário de um objeto usa \"para\": para mi hermana."
      },
      {
        "prompt": "Complete a causa ou motivo: \"Llegó tarde ___ culpa del tráfico.\"",
        "speech": "Por culpa del tráfico",
        "emoji": "🚗",
        "instruction": "Causa / motivo",
        "options": [
          "en",
          "para",
          "de",
          "por"
        ],
        "answer": 3,
        "explanation": "Causa usa \"por\": por culpa de."
      },
      {
        "prompt": "O que significa a expressão \"Por si acaso\"?",
        "speech": "Por si acaso",
        "emoji": "🌂",
        "instruction": "Identifique a locução adverbial",
        "options": [
          "De repente",
          "Com certeza",
          "Nunca na vida",
          "Por via das dúvidas / Caso seja necessário"
        ],
        "answer": 3,
        "explanation": "\"Por si acaso\" equivale a por via das dúvidas."
      },
      {
        "prompt": "O que significa \"Para siempre\"?",
        "speech": "Para siempre",
        "emoji": "♾️",
        "instruction": "Identifique a expressão de tempo",
        "options": [
          "Nunca mais",
          "Por pouco tempo",
          "Para amanhã",
          "Para sempre / eternamente"
        ],
        "answer": 3,
        "explanation": "\"Para siempre\" significa para sempre."
      },
      {
        "prompt": "O que significa \"Por fin\"?",
        "speech": "Por fin terminamos",
        "emoji": "🎉",
        "instruction": "Identifique o alívio",
        "options": [
          "Finalmente / Até que enfim",
          "No início",
          "Por acaso",
          "Pelo final"
        ],
        "answer": 0,
        "explanation": "\"Por fin\" significa finalmente ou até que enfim."
      }
    ]
  },
  {
    "id": "es-13",
    "language": "es",
    "level": "B1 · Intermediário",
    "emoji": "✈️",
    "title": "En el Aeropuerto & La Aduana",
    "description": "Puerta de embarque, pasaporte e equipaje de mano.",
    "xp": 30,
    "questions": [
      {
        "prompt": "Como se diz \"Mala de mão\" em espanhol?",
        "speech": "Equipaje de mano",
        "emoji": "🧳",
        "instruction": "Selecione a expressão correta",
        "options": [
          "Mochila de viaje",
          "Maleta portátil",
          "Bolsa de avión",
          "Equipaje de mano"
        ],
        "answer": 3,
        "explanation": "\"Equipaje de mano\" é a bagagem de cabine."
      },
      {
        "prompt": "Onde você embarca no avião?",
        "speech": "En la puerta de embarque",
        "emoji": "🛫",
        "instruction": "Identifique o local",
        "options": [
          "En la cinta de maletas",
          "En la puerta de embarque",
          "En el mostrador de boletos",
          "En la pista"
        ],
        "answer": 1,
        "explanation": "\"Puerta de embarque\" é o portão de embarque."
      },
      {
        "prompt": "O que é a \"Tarjeta de embarque\"?",
        "speech": "Tarjeta de embarque",
        "emoji": "🎫",
        "instruction": "Identifique o documento",
        "options": [
          "O passaporte diplomático",
          "O cartão de embarque",
          "O visto consular",
          "A carteira de motorista"
        ],
        "answer": 1,
        "explanation": "Tarjeta de embarque é o cartão de embarque."
      },
      {
        "prompt": "O que significa \"Vuelo retrasado\"?",
        "speech": "Vuelo retrasado",
        "emoji": "⏳",
        "instruction": "Identifique o status do voo",
        "options": [
          "Voo pontual",
          "Voo cancelado",
          "Voo atrasado",
          "Voo de volta"
        ],
        "answer": 2,
        "explanation": "Retrasado significa atrasado."
      },
      {
        "prompt": "Onde você retira as malas despachadas após o voo?",
        "speech": "En la cinta de equipajes",
        "emoji": "🛄",
        "instruction": "Identifique a área",
        "options": [
          "En el taxi",
          "En la aduana",
          "En la oficina de turismo",
          "En la cinta de equipajes (reclamación)"
        ],
        "answer": 3,
        "explanation": "Cinta de equipajes é a esteira de restituição."
      },
      {
        "prompt": "O que o oficial de aduana pergunta com: \"¿Tiene algo que declarar?\"",
        "speech": "¿Tiene algo que declarar?",
        "emoji": "👮",
        "instruction": "Interprete a pergunta aduaneira",
        "options": [
          "Qual é sua profissão?",
          "Você tem mercadorias tributáveis a declarar?",
          "Onde está sua carteira?",
          "Quanto custou a passagem?"
        ],
        "answer": 1,
        "explanation": "Pergunta padrão sobre mercadorias na alfândega."
      },
      {
        "prompt": "O que significa \"Escala\" em uma viagem de avião?",
        "speech": "Vuelo con escala",
        "emoji": "🗺️",
        "instruction": "Identifique o tipo de voo",
        "options": [
          "Conexão ou parada intermediária em outro aeroporto",
          "Voo direto sem paradas",
          "Voo cancelado",
          "Primeira classe"
        ],
        "answer": 0,
        "explanation": "Vuelo con escala tem paradas intermediárias."
      },
      {
        "prompt": "Como se diz \"Passagem de ida e volta\"?",
        "speech": "Billete de ida y vuelta",
        "emoji": "🎟️",
        "instruction": "Identifique o bilhete completo",
        "options": [
          "Ticket de vuelta solo",
          "Boleto solo ida",
          "Pase de avión duplo",
          "Billete de ida y vuelta"
        ],
        "answer": 3,
        "explanation": "Ida y vuelta significa ida e volta."
      },
      {
        "prompt": "O que é \"El mostrador de facturación\"?",
        "speech": "Mostrador de facturación",
        "emoji": "🏢",
        "instruction": "Identifique o balcão",
        "options": [
          "A sala vip",
          "A lanchonete do saguão",
          "O balcão de check-in e despacho de malas",
          "O controle de segurança"
        ],
        "answer": 2,
        "explanation": "Facturar equipaje é despachar as malas no balcão."
      },
      {
        "prompt": "Como dizer \"Perdi minha mala de viagem\"?",
        "speech": "He perdido mi maleta",
        "emoji": "🧳",
        "instruction": "Escolha a declaração de extravio",
        "options": [
          "Mi bolso corrió lejos",
          "He perdido mi maleta",
          "No hay mi equipaje hoy",
          "Olvidé la maleta avión"
        ],
        "answer": 1,
        "explanation": "\"He perdido mi maleta\" comunica o extravio da mala."
      }
    ]
  },
  {
    "id": "es-14",
    "language": "es",
    "level": "B1 · Intermediário",
    "emoji": "💊",
    "title": "En la Farmacia, Salud & Médico",
    "description": "Me duele la cabeza, fiebre e pastillas.",
    "xp": 30,
    "questions": [
      {
        "prompt": "Como dizer \"Estou com dor de cabeça\"?",
        "speech": "Me duele la cabeza",
        "emoji": "🤕",
        "instruction": "Escolha a frase",
        "options": [
          "Siento cabeza rota",
          "Tengo dolor de testa",
          "Mi cabeza está mal",
          "Me duele la cabeza"
        ],
        "answer": 3,
        "explanation": "O verbo doler funciona como gustar: \"Me duele la cabeza\"."
      },
      {
        "prompt": "Como dizer \"Estou com dor de estômago\"?",
        "speech": "Me duele el estómago",
        "emoji": "🤢",
        "instruction": "Escolha a frase",
        "options": [
          "Me duele el estómago",
          "Tengo barriga rota",
          "Estómago me pica",
          "Dolor en la comida"
        ],
        "answer": 0,
        "explanation": "\"Me duele el estómago\" é a frase médica exata."
      },
      {
        "prompt": "O que é uma \"Receta médica\"?",
        "speech": "Receta médica",
        "emoji": "📄",
        "instruction": "Identifique o documento",
        "options": [
          "A prescrição do médico para comprar remédios",
          "A nota fiscal da farmácia",
          "A bula explicativa",
          "O recibo de consulta"
        ],
        "answer": 0,
        "explanation": "Receta médica é a prescrição."
      },
      {
        "prompt": "O que significa \"Pastillas\"?",
        "speech": "Pastillas",
        "emoji": "💊",
        "instruction": "Identifique a apresentação farmacêutica",
        "options": [
          "Injeção",
          "Xarope líquido",
          "Pomada de pele",
          "Comprimidos / pílulas"
        ],
        "answer": 3,
        "explanation": "Pastillas são comprimidos ou pastilhas."
      },
      {
        "prompt": "Como dizer \"Estou com febre alta\"?",
        "speech": "Tengo mucha fiebre",
        "emoji": "🌡️",
        "instruction": "Identifique o sintoma",
        "options": [
          "Tengo mucha fiebre",
          "Mi cuerpo está en fuego",
          "Siento calor médico",
          "Estoy con temperatura quemando"
        ],
        "answer": 0,
        "explanation": "Fiebre é febre."
      },
      {
        "prompt": "O que significa \"Toser\" e \"Tos\"?",
        "speech": "Toser",
        "emoji": "🗣️",
        "instruction": "Identifique o reflexo respiratório",
        "options": [
          "Chorar e Lágrima",
          "Espirrar e Espirro",
          "Tossir e Tosse",
          "Gaguejar e Gagueira"
        ],
        "answer": 2,
        "explanation": "Tos é tosse e toser é tossir."
      },
      {
        "prompt": "O que é \"Jarabe para la tos\"?",
        "speech": "Jarabe para la tos",
        "emoji": "🥄",
        "instruction": "Identifique o medicamento",
        "options": [
          "Pomada para dor",
          "Colírio para olhos",
          "Xarope para tosse",
          "Soro fisiológico"
        ],
        "answer": 2,
        "explanation": "Jarabe é xarope."
      },
      {
        "prompt": "Como se diz \"Curativo adesivo\" (Band-Aid) na Espanha?",
        "speech": "Una tirita",
        "emoji": "🩹",
        "instruction": "Identifique o curativo",
        "options": [
          "Una tirita (ou curita)",
          "Un parche grande",
          "Un vendaje duro",
          "Un lazo de piel"
        ],
        "answer": 0,
        "explanation": "Na Espanha diz-se \"tirita\" e na América Latina \"curita\"."
      },
      {
        "prompt": "O que é uma \"Alergia\"?",
        "speech": "Tengo alergia al polen",
        "emoji": "🤧",
        "instruction": "Identifique a condição",
        "options": [
          "Uma fratura óssea",
          "Uma gripe comum",
          "Alergia a uma substância",
          "Uma inflamação muscular"
        ],
        "answer": 2,
        "explanation": "Alergia escreve-se de forma idêntica."
      },
      {
        "prompt": "Como se deseja saúde após alguém espirrar em espanhol?",
        "speech": "¡Salud! / ¡Jesús!",
        "emoji": "🤧",
        "instruction": "Escolha a cortesia",
        "options": [
          "¡Silencio!",
          "¡Gracias!",
          "¡Salud! (ou ¡Jesús!)",
          "¡Perdón!"
        ],
        "answer": 2,
        "explanation": "Diz-se \"¡Salud!\" ou \"¡Jesús!\" quando alguém espirra."
      }
    ]
  },
  {
    "id": "es-15",
    "language": "es",
    "level": "B1 · Intermediário",
    "emoji": "💼",
    "title": "El Trabajo, Profesiones & Oficina",
    "description": "Entrevista de trabajo, sueldo e horario laboral.",
    "xp": 35,
    "questions": [
      {
        "prompt": "O que significa \"Sueldo\"?",
        "speech": "Sueldo",
        "emoji": "💵",
        "instruction": "Identifique o termo financeiro laboral",
        "options": [
          "Férias remuneradas",
          "Imposto de renda",
          "Salário / remuneração mensal",
          "Contrato de aluguel"
        ],
        "answer": 2,
        "explanation": "\"Sueldo\" ou \"salario\" é a remuneração pelo trabalho."
      },
      {
        "prompt": "Como se chama a \"Entrevista de emprego\"?",
        "speech": "Entrevista de trabajo",
        "emoji": "👔",
        "instruction": "Identifique o evento seletivo",
        "options": [
          "Cita de negocios",
          "Entrevista de trabajo",
          "Reunión de empleo",
          "Charla laboral"
        ],
        "answer": 1,
        "explanation": "Entrevista de trabajo é a entrevista de emprego."
      },
      {
        "prompt": "O que significa \"Horario laboral\"?",
        "speech": "Horario laboral",
        "emoji": "⏰",
        "instruction": "Identifique o conceito",
        "options": [
          "A hora extra",
          "A hora do almoço",
          "As férias anuais",
          "A jornada de trabalho diária"
        ],
        "answer": 3,
        "explanation": "Horario laboral é o expediente de trabalho."
      },
      {
        "prompt": "O que é o \"Jefe\" ou \"La jefa\"?",
        "speech": "El jefe / La jefa",
        "emoji": "🏢",
        "instruction": "Identifique o cargo",
        "options": [
          "O estagiário",
          "O colega de mesa",
          "O chefe / a chefe ou gerente",
          "O cliente"
        ],
        "answer": 2,
        "explanation": "Jefe é o superior hierárquico."
      },
      {
        "prompt": "O que significa \"Despedir a un empleado\"?",
        "speech": "Despedir",
        "emoji": "🚪",
        "instruction": "Identifique a ação administrativa",
        "options": [
          "Contratar alguém novo",
          "Demitir um funcionário",
          "Promover a diretor",
          "Dar um aumento"
        ],
        "answer": 1,
        "explanation": "Despedir significa demitir."
      },
      {
        "prompt": "O que significa \"Contratar\"?",
        "speech": "Contratar",
        "emoji": "🤝",
        "instruction": "Identifique a ação",
        "options": [
          "Admitir / formalizar novo funcionário",
          "Demitir com justa causa",
          "Aposentar alguém",
          "Reclamar do trabalho"
        ],
        "answer": 0,
        "explanation": "Contratar significa admitir funcionário."
      },
      {
        "prompt": "O que são as \"Vacaciones pagadas\"?",
        "speech": "Vacaciones",
        "emoji": "🏖️",
        "instruction": "Identifique o direito trabalhista",
        "options": [
          "Horas extras no sábado",
          "Feriados nacionais",
          "Licença médica",
          "Férias remuneradas"
        ],
        "answer": 3,
        "explanation": "Vacaciones pagadas são férias remuneradas."
      },
      {
        "prompt": "Como se diz \"Estágio profissional\"?",
        "speech": "Prácticas / Pasantía",
        "emoji": "🎓",
        "instruction": "Identifique o cargo de início",
        "options": [
          "Trabajo leve",
          "Prácticas (Espanha) ou Pasantía (América Latina)",
          "Escuela de empleo",
          "Oficina menor"
        ],
        "answer": 1,
        "explanation": "Prácticas ou pasantía é o estágio de estudantes."
      },
      {
        "prompt": "O que significa \"Estar de baja médica\"?",
        "speech": "Baja médica",
        "emoji": "🏥",
        "instruction": "Identifique a situação",
        "options": [
          "Trabalhar em home office",
          "Estar desempregado",
          "Pedir demissão",
          "Estar de licença médica por doença"
        ],
        "answer": 3,
        "explanation": "Estar de baja médica é estar afastado por saúde."
      },
      {
        "prompt": "O que é uma \"Reunión de equipo\"?",
        "speech": "Reunión de equipo",
        "emoji": "👥",
        "instruction": "Identifique a assembleia",
        "options": [
          "Festa de fim de ano",
          "Reunião de equipe de trabalho",
          "Almoço com clientes",
          "Entrevista individual"
        ],
        "answer": 1,
        "explanation": "Reunión de equipo é a reunião de time."
      }
    ]
  },
  {
    "id": "es-16",
    "language": "es",
    "level": "B1 · Intermediário",
    "emoji": "📜",
    "title": "Pretérito Imperfecto: Infancia y Recuerdos",
    "description": "Cuando era niño vivía en el campo e jugaba al fútbol.",
    "xp": 35,
    "questions": [
      {
        "prompt": "Qual tempo usamos para hábitos contínuos da infância?",
        "speech": "Cuando era niño jugaba en la calle",
        "emoji": "🧒",
        "instruction": "Identifique o tempo verbal",
        "options": [
          "Presente",
          "Pretérito Indefinido (jugué)",
          "Pretérito Imperfecto (jugaba)",
          "Futuro"
        ],
        "answer": 2,
        "explanation": "O Pretérito Imperfeito expressa hábitos passados frequentes."
      },
      {
        "prompt": "Qual é a forma imperfeita do verbo \"ser\" para \"yo\"?",
        "speech": "Yo era",
        "emoji": "👶",
        "instruction": "Conjugue o verbo ser no imperfeito",
        "options": [
          "sido",
          "fui",
          "era",
          "estaba"
        ],
        "answer": 2,
        "explanation": "A conjugação é: era, eras, era, éramos, erais, eran."
      },
      {
        "prompt": "Qual é a forma imperfeita de \"ir\" para \"nosotros\"?",
        "speech": "Íbamos",
        "emoji": "🚶‍♂️",
        "instruction": "Conjugue o verbo ir",
        "options": [
          "íais",
          "fuimos",
          "íbamos",
          "vamos"
        ],
        "answer": 2,
        "explanation": "Íbamos leva acento gráfico na primeira sílaba."
      },
      {
        "prompt": "Complete com o hábito passado: \"Todos los veranos ___ a la playa.\"",
        "speech": "Íbamos a la playa",
        "emoji": "🏖️",
        "instruction": "Complete a rotina passada",
        "options": [
          "íbamos",
          "fuimos",
          "iremos",
          "vamos"
        ],
        "answer": 0,
        "explanation": "Para ações rotineiras no passado usa-se o Imperfeito."
      },
      {
        "prompt": "Qual a terminação regular de -AR no Pretérito Imperfeito?",
        "speech": "Cantaba, cantabas",
        "emoji": "🎤",
        "instruction": "Identifique a terminação",
        "options": [
          "-ía, -ías, -ía",
          "-é, -aste, -ó",
          "-aba, -abas, -aba, -ábamos, -abais, -aban",
          "-ar, -ares, -aron"
        ],
        "answer": 2,
        "explanation": "Verbos em -ar terminam em -aba no imperfeito."
      },
      {
        "prompt": "Qual a terminação regular de -ER e -IR no Pretérito Imperfeito?",
        "speech": "Comía, vivía",
        "emoji": "🍲",
        "instruction": "Identifique a terminação",
        "options": [
          "-iera, -ieras",
          "-aba, -abas, -aba",
          "-í, -iste, -ió",
          "-ía, -ías, -ía, -íamos, -íais, -ían"
        ],
        "answer": 3,
        "explanation": "Verbos em -er e -ir levam a terminação acentuada -ía."
      },
      {
        "prompt": "Complete a descrição: \"La casa ___ grande y tenía jardín.\"",
        "speech": "La casa era grande",
        "emoji": "🏡",
        "instruction": "Descreva o imóvel no passado",
        "options": [
          "es",
          "fue",
          "era",
          "estuvo"
        ],
        "answer": 2,
        "explanation": "Descrições de cenários no passado usam o imperfeito: era grande."
      },
      {
        "prompt": "Quantos verbos são totalmente irregulares no Pretérito Imperfeito do espanhol?",
        "speech": "Ser, ir y ver",
        "emoji": "🔢",
        "instruction": "Identifique a quantidade",
        "options": [
          "Todos os verbos",
          "Mais de cinquenta",
          "Apenas três (ser, ir e ver)",
          "Nenhum, todos são regulares"
        ],
        "answer": 2,
        "explanation": "Existem apenas 3 verbos irregulares no imperfeito espanhol: ser, ir e ver."
      },
      {
        "prompt": "Qual a conjugação de \"ver\" para \"yo\" no imperfeito?",
        "speech": "Yo veía",
        "emoji": "👀",
        "instruction": "Conjugue ver",
        "options": [
          "veiba",
          "vi",
          "veía",
          "vía"
        ],
        "answer": 2,
        "explanation": "A conjugação é: yo veía."
      },
      {
        "prompt": "O que a frase expressa: \"Hacía mucho frío cuando salí\"?",
        "speech": "Hacía frío",
        "emoji": "❄️",
        "instruction": "Interprete a relação temporal",
        "options": [
          "Uma previsão futura",
          "O clima de fundo contínuo (imperfeito) durante uma ação pontual (indefinido)",
          "Uma dúvida no presente",
          "Um desejo"
        ],
        "answer": 1,
        "explanation": "Hacía frío descreve o cenário quando a ação pontual (salí) ocorreu."
      }
    ]
  },
  {
    "id": "es-17",
    "language": "es",
    "level": "B2 · Avançado",
    "emoji": "✨",
    "title": "El Modo Subjuntivo: Deseos y Dudas",
    "description": "Ojalá que haga sol e quiero que vengas.",
    "xp": 40,
    "questions": [
      {
        "prompt": "Complete: \"¡Ojalá que mañana ___ buen tiempo!\"",
        "speech": "Ojalá que mañana haga buen tiempo",
        "emoji": "☀️",
        "instruction": "Conjugue no subjuntivo",
        "options": [
          "hacía",
          "hace",
          "hará",
          "haga"
        ],
        "answer": 3,
        "explanation": "\"Ojalá que\" exige o presente do subjuntivo: haga."
      },
      {
        "prompt": "Complete a expressão de desejo: \"Quiero que tú ___ con nosotros.\"",
        "speech": "Quiero que tú vengas",
        "emoji": "🎉",
        "instruction": "Conjugue venir",
        "options": [
          "ven",
          "vienes",
          "vendrás",
          "vengas"
        ],
        "answer": 3,
        "explanation": "Com sujeitos diferentes, o verbo querer exige subjuntivo: que vengas."
      },
      {
        "prompt": "Complete a dúvida: \"Dudo que él ___ la verdad.\"",
        "speech": "Dudo que él diga la verdad",
        "emoji": "🤫",
        "instruction": "Conjugue decir",
        "options": [
          "diga",
          "dice",
          "dirá",
          "dijo"
        ],
        "answer": 0,
        "explanation": "Verbos de dúvida (dudar) exigem modo subjuntivo: diga."
      },
      {
        "prompt": "Complete a certeza: \"Es verdad que ella ___ español muy bien.\"",
        "speech": "Es verdad que habla español",
        "emoji": "🇪🇸",
        "instruction": "Identifique o modo da certeza",
        "options": [
          "hablara",
          "hable",
          "habla",
          "hablaría"
        ],
        "answer": 2,
        "explanation": "Expressões de certeza objetiva (es verdad) usam indicativo: habla."
      },
      {
        "prompt": "Complete com conselho: \"Es importante que você ___ agua.\"",
        "speech": "Es importante que bebas agua",
        "emoji": "💧",
        "instruction": "Conjugue beber",
        "options": [
          "beberás",
          "bebes",
          "bebas",
          "bebiste"
        ],
        "answer": 2,
        "explanation": "Expressões impessoais de importância exigem subjuntivo: bebas."
      },
      {
        "prompt": "Complete a hipótese futura: \"Cuando yo ___ tiempo, te llamaré.\"",
        "speech": "Cuando yo tenga tiempo",
        "emoji": "⏱️",
        "instruction": "Conjugue tener",
        "options": [
          "tendré",
          "tengo",
          "tenga",
          "tuve"
        ],
        "answer": 2,
        "explanation": "Quando \"cuando\" refere-se a tempo futuro, exige subjuntivo: tenga."
      },
      {
        "prompt": "Complete com esperança: \"Espero que te ___ bien en el examen.\"",
        "speech": "Espero que te vaya bien",
        "emoji": "📝",
        "instruction": "Conjugue ir",
        "options": [
          "va",
          "vaya",
          "irá",
          "fuese"
        ],
        "answer": 1,
        "explanation": "Esperar que exige subjuntivo: que te vaya bien."
      },
      {
        "prompt": "Como dizer \"Não acho que seja uma boa ideia\"?",
        "speech": "No creo que sea una buena idea",
        "emoji": "💡",
        "instruction": "Selecione a frase",
        "options": [
          "No creo que es buena idea",
          "No creo que sea una buena idea",
          "No pienso que será idea",
          "Dudo que es idea"
        ],
        "answer": 1,
        "explanation": "No creer exige subjuntivo: sea."
      },
      {
        "prompt": "Complete: \"Buscamos un hotel que ___ piscina.\"",
        "speech": "Que tenga piscina",
        "emoji": "🏊",
        "instruction": "Objeto indefinido",
        "options": [
          "tenga",
          "tiene",
          "tendrá",
          "tenía"
        ],
        "answer": 0,
        "explanation": "Quando o antecedente é indeterminado ou procurado, usa-se subjuntivo: tenga."
      },
      {
        "prompt": "Qual é o presente do subjuntivo de \"ser\" para \"yo\"?",
        "speech": "Yo sea",
        "emoji": "🌟",
        "instruction": "Identifique a forma",
        "options": [
          "sería",
          "soy",
          "fuese",
          "sea"
        ],
        "answer": 3,
        "explanation": "O presente do subjuntivo de ser é: sea, seas, sea, seamos, seáis, sean."
      }
    ]
  },
  {
    "id": "es-18",
    "language": "es",
    "level": "B2 · Avançado",
    "emoji": "🔮",
    "title": "Futuro Simple y Condicional",
    "description": "Viajaré el próximo año e me gustaría pedir.",
    "xp": 40,
    "questions": [
      {
        "prompt": "Como dizer \"Eu viajarei ano que vem\"?",
        "speech": "Viajaré el próximo año",
        "emoji": "🧳",
        "instruction": "Escolha o futuro regular",
        "options": [
          "Voy viajar año próximo",
          "Viajaré el próximo año",
          "Viajo en futuro",
          "He de viajar"
        ],
        "answer": 1,
        "explanation": "A terminação de futuro para yo (-ar, -er, -ir) é \"-é\": viajaré."
      },
      {
        "prompt": "Qual é a raiz irregular de \"hacer\" no futuro?",
        "speech": "Haré",
        "emoji": "✍️",
        "instruction": "Identifique a raiz",
        "options": [
          "hac- (haceré)",
          "har- (haré, harás, hará)",
          "hiz- (hizeré)",
          "hag- (hagaré)"
        ],
        "answer": 1,
        "explanation": "Hacer vira har- no futuro e condicional."
      },
      {
        "prompt": "Qual é a raiz de \"tener\" no futuro?",
        "speech": "Tendré",
        "emoji": "💼",
        "instruction": "Identifique a raiz",
        "options": [
          "teng- (tengaré)",
          "ten- (teneré)",
          "tuv- (tuveré)",
          "tendr- (tendré, tendrás)"
        ],
        "answer": 3,
        "explanation": "Tener vira tendr- no futuro."
      },
      {
        "prompt": "Como fazer um pedido com extrema delicadeza?",
        "speech": "Me gustaría un vaso de agua",
        "emoji": "🙏",
        "instruction": "Selecione o condicional de cortesia",
        "options": [
          "Voy a tener agua",
          "Quiero agua ya",
          "Deme agua rápido",
          "Me gustaría un vaso de agua"
        ],
        "answer": 3,
        "explanation": "\"Me gustaría...\" suaviza pedidos com elegância."
      },
      {
        "prompt": "Complete a 2ª condicional hipotética: \"Si tuviera dinero, ___ por el mundo.\"",
        "speech": "Viajaría por el mundo",
        "emoji": "🌍",
        "instruction": "Conjugue viajar no condicional",
        "options": [
          "viajo",
          "viajaré",
          "viajaría",
          "viajase"
        ],
        "answer": 2,
        "explanation": "A consequência de uma hipótese com subjuntivo pretérito é o condicional: viajaría."
      },
      {
        "prompt": "Qual a terminação regular do condicional para todas as pessoas?",
        "speech": "-ía, -ías, -ía, -íamos, -íais, -ían",
        "emoji": "📐",
        "instruction": "Identifique as terminações",
        "options": [
          "-é, -ás, -á",
          "-ía, -ías, -ía, -íamos, -íais, -ían",
          "-ara, -aras, -ara",
          "-ré, -rás, -rá"
        ],
        "answer": 1,
        "explanation": "O condicional simples usa -ía adicionado ao infinitivo."
      },
      {
        "prompt": "Como expressar probabilidade no presente com o futuro?",
        "speech": "¿Dónde estará Carlos?",
        "emoji": "🔍",
        "instruction": "Identifique o uso de probabilidade",
        "options": [
          "Carlos nunca esteve aqui",
          "Carlos viajará amanhã",
          "¿Dónde estará Carlos? (Onde será que está Carlos?)",
          "Carlos foi embora ontem"
        ],
        "answer": 2,
        "explanation": "O futuro em espanhol expressa dúvida ou probabilidade no presente."
      },
      {
        "prompt": "Qual o futuro do verbo \"poner\" para \"yo\"?",
        "speech": "Pondré",
        "emoji": "📌",
        "instruction": "Identifique a raiz irregular",
        "options": [
          "Pongaré",
          "Poneré",
          "Pusé",
          "Pondré"
        ],
        "answer": 3,
        "explanation": "Poner tem raiz irregular: pondré."
      },
      {
        "prompt": "Qual o futuro de \"decir\" para \"nosotros\"?",
        "speech": "Diremos",
        "emoji": "🗣️",
        "instruction": "Conjugue decir no futuro",
        "options": [
          "Deciremos",
          "Diremos",
          "Diríamos",
          "Dijimos"
        ],
        "answer": 1,
        "explanation": "Decir tem raiz dir-: diremos."
      },
      {
        "prompt": "Como dizer \"Eu preferiria ficar em casa hoje\"?",
        "speech": "Preferiría quedarme en casa hoy",
        "emoji": "🏡",
        "instruction": "Escolha o condicional",
        "options": [
          "Prefiero quedado casa",
          "Preferiré estar en casa",
          "Quiero casa ahora",
          "Preferiría quedarme en casa hoy"
        ],
        "answer": 3,
        "explanation": "Preferiría expressa preferência hipotética polida."
      }
    ]
  },
  {
    "id": "es-19",
    "language": "es",
    "level": "B2 · Avançado",
    "emoji": "🗣️",
    "title": "Modismos y Frases Hechas",
    "description": "No tener pelos en la lengua e estar en las nubes.",
    "xp": 40,
    "questions": [
      {
        "prompt": "O que significa dizer que alguém \"no tiene pelos en la lengua\"?",
        "speech": "No tiene pelos en la lengua",
        "emoji": "💬",
        "instruction": "Identifique a expressão",
        "options": [
          "Fica em silêncio",
          "Tem dor de dente",
          "Fala baixinho",
          "Fala a verdade com sinceridade e sem rodeios"
        ],
        "answer": 3,
        "explanation": "Expressão para quem fala abertamente a verdade."
      },
      {
        "prompt": "O que significa \"Estar en las nubes\"?",
        "speech": "Estar en las nubes",
        "emoji": "☁️",
        "instruction": "Identifique o estado mental",
        "options": [
          "Estar voando de avião",
          "Estar distraído ou no mundo da lua",
          "Estar muito feliz",
          "Estar chovendo"
        ],
        "answer": 1,
        "explanation": "\"Estar en las nubes\" significa estar desatento."
      },
      {
        "prompt": "O que significa \"Tirar la toalla\"?",
        "speech": "Tirar la toalla",
        "emoji": "🏳️",
        "instruction": "Identifique a atitude",
        "options": [
          "Ir à praia nadar",
          "Lavar a roupa de banho",
          "Desistir de algo diante das dificuldades",
          "Comemorar uma vitória"
        ],
        "answer": 2,
        "explanation": "\"Tirar la toalla\" é uma metáfora do boxe para desistir."
      },
      {
        "prompt": "O que significa a expressão \"Tomar el pelo a alguien\"?",
        "speech": "Tomar el pelo",
        "emoji": "💇",
        "instruction": "Identifique a brincadeira",
        "options": [
          "Cortar o cabelo de alguém",
          "Zombar amigavelmente / pregar uma peça em alguém",
          "Puxar o cabelo em uma briga",
          "Elogiar o penteado"
        ],
        "answer": 1,
        "explanation": "\"Tomar el pelo\" significa caçoar ou brincar com alguém."
      },
      {
        "prompt": "O que significa \"Costar un ojo de la cara\"?",
        "speech": "Costar un ojo de la cara",
        "emoji": "💸",
        "instruction": "Identifique o preço",
        "options": [
          "Ser doado gratuitamente",
          "Ser muito barato",
          "Custar uma fortuna / ser caríssimo",
          "Custar pouco esforço"
        ],
        "answer": 2,
        "explanation": "Expressão para itens extremamente caros."
      },
      {
        "prompt": "O que significa \"Ser pan comido\"?",
        "speech": "Es pan comido",
        "emoji": "🍞",
        "instruction": "Identifique a facilidade",
        "options": [
          "Comer pão na padaria",
          "Estar com fome",
          "Ser muito fácil / uma moleza",
          "Ser muito antigo"
        ],
        "answer": 2,
        "explanation": "\"Pan comido\" é o equivalente a \"moleza / bico\"."
      },
      {
        "prompt": "O que significa \"Estar hasta las narices\"?",
        "speech": "Estar hasta las narices",
        "emoji": "😤",
        "instruction": "Identifique o sentimento",
        "options": [
          "Estar cheirando perfume",
          "Estar gripado com coriza",
          "Estar com frio no rosto",
          "Estar de saco cheio / farto de uma situação"
        ],
        "answer": 3,
        "explanation": "\"Estar hasta las narices\" significa estar saturado / sem paciência."
      },
      {
        "prompt": "O que significa \"Meter la pata\"?",
        "speech": "Meter la pata",
        "emoji": "🐾",
        "instruction": "Identifique o erro",
        "options": [
          "Chutar uma bola com força",
          "Acelerar o carro",
          "Cometer uma gafe / pisar na bola",
          "Caminhar descalço"
        ],
        "answer": 2,
        "explanation": "\"Meter la pata\" significa cometer um deslize embaraçoso."
      },
      {
        "prompt": "O que significa \"Dar en el clavo\"?",
        "speech": "Dar en el clavo",
        "emoji": "🔨",
        "instruction": "Identifique o acerto",
        "options": [
          "Comprar ferramentas",
          "Martelar o dedo",
          "Acertar em cheio / dar a resposta precisa",
          "Errar a direção"
        ],
        "answer": 2,
        "explanation": "\"Dar en el clavo\" significa acertar com precisão."
      },
      {
        "prompt": "O que significa \"Hacer la vista gorda\"?",
        "speech": "Hacer la vista gorda",
        "emoji": "🙈",
        "instruction": "Identifique a atitude",
        "options": [
          "Usar óculos grossos",
          "Comer muito na janta",
          "Fingir que não viu uma infração / tolerar",
          "Ficar cego de raiva"
        ],
        "answer": 2,
        "explanation": "\"Hacer la vista gorda\" significa fingir não ver."
      }
    ]
  },
  {
    "id": "es-20",
    "language": "es",
    "level": "B2 · Avançado",
    "emoji": "🎉",
    "title": "Jerga y Expresiones del Mundo Hispano",
    "description": "Chévere, guay, buena onda, vale e molar.",
    "xp": 40,
    "questions": [
      {
        "prompt": "Na Espanha, a gíria \"¡Qué guay!\" significa:",
        "speech": "¡Qué guay!",
        "emoji": "🤩",
        "instruction": "Identifique a gíria espanhola",
        "options": [
          "Que confuso!",
          "Que triste!",
          "Que legal / Muito bacana!",
          "Que caro!"
        ],
        "answer": 2,
        "explanation": "\"Guay\" é o clássico \"legal\" da Espanha."
      },
      {
        "prompt": "Na Colômbia e Venezuela, o termo \"Chévere\" expressa:",
        "speech": "Chévere",
        "emoji": "🇨🇴",
        "instruction": "Identifique a gíria caribenha",
        "options": [
          "Problema financeiro",
          "Comida apimentada",
          "Pessoa chata",
          "Ótimo / muito legal / excelente"
        ],
        "answer": 3,
        "explanation": "\"Chévere\" é um elogio universal na região andina/caribenha."
      },
      {
        "prompt": "No México e Argentina, \"Buena onda\" refere-se a:",
        "speech": "Buena onda",
        "emoji": "🇲🇽",
        "instruction": "Identifique a expressão social",
        "options": [
          "Onda do mar perigosa",
          "Música alta",
          "Pessoa simpática / energia positiva e agradável",
          "Clima quente de praia"
        ],
        "answer": 2,
        "explanation": "\"Buena onda\" descreve alguém simpático e acolhedor."
      },
      {
        "prompt": "Na Espanha, o que expressa o termo onipresente \"¡Vale!\"?",
        "speech": "¡Vale!",
        "emoji": "🇪🇸",
        "instruction": "Identifique o significado coloquial",
        "options": [
          "Não quero isso",
          "Valor monetário",
          "Adeus para sempre",
          "Entendido! / Combinado! / Tudo bem!"
        ],
        "answer": 3,
        "explanation": "\"Vale\" é usado dezenas de vezes ao dia para concordar."
      },
      {
        "prompt": "Na Espanha, o que significa o verbo coloquial \"Molar\"?",
        "speech": "Esta canción mola mucho",
        "emoji": "🎸",
        "instruction": "Identifique o verbo de gíria",
        "options": [
          "Quebrar um instrumento",
          "Fazer barulho irritante",
          "Agradar muito / ser muito legal e bacana",
          "Tocar violão desafinado"
        ],
        "answer": 2,
        "explanation": "\"Molar\" significa ser muito legal."
      },
      {
        "prompt": "No México, o que significa a gíria \"¡Qué padre!\"?",
        "speech": "¡Qué padre!",
        "emoji": "🌮",
        "instruction": "Identifique a gíria mexicana",
        "options": [
          "Que pai bravo!",
          "Que homem sério!",
          "Que legal / que incrível!",
          "Que lugar distante!"
        ],
        "answer": 2,
        "explanation": "\"¡Qué padre!\" no México significa fantástico ou excelente."
      },
      {
        "prompt": "Na Argentina e Uruguai, o que significa \"Che\"?",
        "speech": "¡Che, mirá esto!",
        "emoji": "🇦🇷",
        "instruction": "Identifique o vocativo rio-platense",
        "options": [
          "Comida típica de carne",
          "Forma coloquial de chamar a atenção de alguém (como \"ouviu?\", \"cara\")",
          "Despedida formal",
          "Pedido de desculpas"
        ],
        "answer": 1,
        "explanation": "\"Che\" é o vocativo característico dos argentinos e uruguaios."
      },
      {
        "prompt": "No Chile, a gíria \"Cachái\" significa:",
        "speech": "¿Cachái?",
        "emoji": "🇨🇱",
        "instruction": "Identifique a gíria chilena",
        "options": [
          "Qual é seu preço?",
          "Você tem pressa?",
          "Onde você mora?",
          "Você entende? / Sacou?"
        ],
        "answer": 3,
        "explanation": "\"Cachái\" vem do inglês to catch e significa \"entendeu?\"."
      },
      {
        "prompt": "Na Argentina, como é chamado um amigo próximo?",
        "speech": "Un pibe / Un chabón",
        "emoji": "👥",
        "instruction": "Identifique o termo rio-platense",
        "options": [
          "Pibe (jovem) / amigo",
          "Jefe de oficina",
          "Señor mayor",
          "Extranjero"
        ],
        "answer": 0,
        "explanation": "\"Pibe\" significa jovem ou garoto na Argentina."
      },
      {
        "prompt": "O que significa \"Estar flipando\" na gíria espanhola?",
        "speech": "Estoy flipando",
        "emoji": "🤯",
        "instruction": "Identifique a reação de espanto",
        "options": [
          "Estar chocado, maravilhado ou surpreso",
          "Estar com sono profundo",
          "Estar com fome",
          "Estar nadando na piscina"
        ],
        "answer": 0,
        "explanation": "\"Flipando\" expressa choque ou admiração intensa."
      }
    ]
  },
  {
    "id": "pt-1",
    "language": "pt",
    "level": "A1 · Iniciante",
    "emoji": "🇧🇷",
    "title": "Sons Nasais & Fonética Brasileira",
    "description": "Domine o til (~) em pão, coração e a cedilha (ç).",
    "xp": 20,
    "questions": [
      {
        "prompt": "Qual palavra possui o clássico ditongo nasal brasileiro?",
        "speech": "Pão de queijo",
        "emoji": "🧀",
        "instruction": "Selecione a palavra com som nasal",
        "options": [
          "Pena",
          "Pau",
          "Pato",
          "Pão"
        ],
        "answer": 3,
        "explanation": "\"Pão\" possui o som nasal característico da língua portuguesa com o til (~)."
      },
      {
        "prompt": "Qual som tem a cedilha (ç) em palavras como \"Coração\"?",
        "speech": "Coração",
        "emoji": "❤️",
        "instruction": "Identifique o fonema",
        "options": [
          "Som de \"Z\"",
          "Som de \"K\"",
          "Som de \"SS\"",
          "Som de \"CH\""
        ],
        "answer": 2,
        "explanation": "A cedilha tem som suave de \"SS\"."
      },
      {
        "prompt": "Qual palavra tem o plural terminado em \"-ões\"?",
        "speech": "Corações",
        "emoji": "👥",
        "instruction": "Identifique o plural",
        "options": [
          "Pãos",
          "Corações",
          "Mãos",
          "Alemãos"
        ],
        "answer": 1,
        "explanation": "Coração forma plural em corações."
      },
      {
        "prompt": "Como soa a letra \"R\" no início de palavras como \"Rio\"?",
        "speech": "Rio",
        "emoji": "🌊",
        "instruction": "Identifique a pronúncia",
        "options": [
          "Som mudo",
          "Som de L",
          "Som forte aspirado ou gutural",
          "Vibrante suave como \"caro\""
        ],
        "answer": 2,
        "explanation": "O R inicial em português tem som forte."
      },
      {
        "prompt": "Qual das seguintes palavras possui som nasal terminado em \"-ão\"?",
        "speech": "Irmão",
        "emoji": "👦",
        "instruction": "Selecione a palavra",
        "options": [
          "Irmão",
          "Irmad",
          "Irmal",
          "Irmate"
        ],
        "answer": 0,
        "explanation": "\"Irmão\" termina em ditongo nasal -ão."
      },
      {
        "prompt": "Como soa a letra \"S\" entre duas vogais em \"Casa\"?",
        "speech": "Casa",
        "emoji": "🏡",
        "instruction": "Identifique o som",
        "options": [
          "Som de \"J\"",
          "Som de \"SS\"",
          "Som de \"Z\"",
          "Mudo"
        ],
        "answer": 2,
        "explanation": "S intervocálico tem som de Z."
      },
      {
        "prompt": "Qual é o som de \"LH\" em \"Filho\"?",
        "speech": "Filho",
        "emoji": "👶",
        "instruction": "Identifique a pronúncia",
        "options": [
          "Som de R",
          "Som de L duplo",
          "Palatal lateral (som aproximado do lli italiano)",
          "Som de J"
        ],
        "answer": 2,
        "explanation": "\"LH\" é uma consoante palatal."
      },
      {
        "prompt": "Qual é o som de \"NH\" em \"Manhã\"?",
        "speech": "Manhã",
        "emoji": "🌅",
        "instruction": "Identifique o som nasal",
        "options": [
          "Som de N duplo",
          "Nasal palatal (equivalente ao ñ do espanhol)",
          "Som de M",
          "Mudo"
        ],
        "answer": 1,
        "explanation": "\"NH\" em português equivale ao ñ em espanhol."
      },
      {
        "prompt": "Qual palavra tem som de \"X\" com som de \"CH\"?",
        "speech": "Xícara",
        "emoji": "☕",
        "instruction": "Identifique a pronúncia",
        "options": [
          "Exame",
          "Xícara",
          "Táxi",
          "Próximo"
        ],
        "answer": 1,
        "explanation": "Em \"Xícara\" o X soa como CH."
      },
      {
        "prompt": "Como se pronuncia a letra \"L\" no final de sílaba no Brasil (ex: \"Brasil\")?",
        "speech": "Brasil",
        "emoji": "🇧🇷",
        "instruction": "Identifique o fonema brasileiro",
        "options": [
          "Vocalizado como som de \"U\"",
          "Som velar de L duro",
          "Mudo",
          "Som de R"
        ],
        "answer": 0,
        "explanation": "No Brasil, o L em final de sílaba é pronunciado como semivogal \"U\"."
      }
    ]
  },
  {
    "id": "pt-2",
    "language": "pt",
    "level": "A1 · Iniciante",
    "emoji": "👋",
    "title": "Saudações & Tudo Bem?",
    "description": "Oi, bom dia, tudo joia e muito prazer.",
    "xp": 20,
    "questions": [
      {
        "prompt": "Qual a resposta mais simpática e usual para \"Oi, tudo bem?\"",
        "speech": "Tudo bem, e com você?",
        "emoji": "😊",
        "instruction": "Escolha a resposta usual",
        "options": [
          "Tudo bem, e com você?",
          "Não tenho nada a dizer",
          "Adeus agora",
          "Talvez amanhã"
        ],
        "answer": 0,
        "explanation": "\"Tudo bem, e com você?\" é a saudação cordial de todos os dias."
      },
      {
        "prompt": "Como desejar bom dia formalmente pela manhã?",
        "speech": "Bom dia",
        "emoji": "🌅",
        "instruction": "Selecione a saudação",
        "options": [
          "Boa noite",
          "Boa tarde",
          "Bom dia",
          "Até logo"
        ],
        "answer": 2,
        "explanation": "Bom dia é usado até as 12h."
      },
      {
        "prompt": "Como se diz \"Muito prazer\" ao conhecer alguém?",
        "speech": "Muito prazer em conhecê-lo(a)",
        "emoji": "🤝",
        "instruction": "Identifique a cortesia",
        "options": [
          "Muito prazer",
          "Por favor",
          "Com licença",
          "De nada"
        ],
        "answer": 0,
        "explanation": "\"Muito prazer\" expressa cortesia ao ser apresentado."
      },
      {
        "prompt": "Qual saudação é usada a partir do meio-dia?",
        "speech": "Boa tarde",
        "emoji": "🌇",
        "instruction": "Identifique o período",
        "options": [
          "Alô",
          "Bom dia",
          "Boa noite",
          "Boa tarde"
        ],
        "answer": 3,
        "explanation": "Boa tarde é usado após as 12h."
      },
      {
        "prompt": "Como se despede com a ideia de rever a pessoa em breve?",
        "speech": "Até logo! / Até mais!",
        "emoji": "👋",
        "instruction": "Escolha a despedida",
        "options": [
          "Nunca mais",
          "Adeus para sempre",
          "Até logo!",
          "Sem retorno"
        ],
        "answer": 2,
        "explanation": "\"Até logo\" ou \"Até mais\" é a despedida comum."
      },
      {
        "prompt": "Como pedir licença para passar educadamente?",
        "speech": "Com licença",
        "emoji": "🚪",
        "instruction": "Escolha a expressão",
        "options": [
          "Obrigado",
          "Sai da frente",
          "Com licença",
          "Por favor não"
        ],
        "answer": 2,
        "explanation": "\"Com licença\" pede passagem com respeito."
      },
      {
        "prompt": "Qual a forma feminina correta de agradecer em português?",
        "speech": "Muito obrigada",
        "emoji": "👩",
        "instruction": "Concordância de gênero",
        "options": [
          "Obrigado feminina",
          "Muito obrigado",
          "Muito grato ela",
          "Muito obrigada"
        ],
        "answer": 3,
        "explanation": "Mulheres dizem \"obrigada\" e homens dizem \"obrigado\"."
      },
      {
        "prompt": "Como se responde ao agradecimento \"Muito obrigado\"?",
        "speech": "De nada / Por nada",
        "emoji": "🙏",
        "instruction": "Escolha a resposta",
        "options": [
          "Por favor",
          "De nada (ou Por nada / Não há de quê)",
          "Desculpe",
          "Até logo"
        ],
        "answer": 1,
        "explanation": "\"De nada\" é a resposta cordial."
      },
      {
        "prompt": "Como pedir desculpas por um esbarrão acidental?",
        "speech": "Desculpe! / Perdão!",
        "emoji": "🙇",
        "instruction": "Identifique o pedido de desculpas",
        "options": [
          "Alô!",
          "Obrigado!",
          "Desculpe!",
          "Tudo bem!"
        ],
        "answer": 2,
        "explanation": "Desculpe pede perdão por pequenos incidentes."
      },
      {
        "prompt": "Como se diz \"Tchau\" de forma informal no Brasil?",
        "speech": "Tchau!",
        "emoji": "👋",
        "instruction": "Identifique a saudação informal",
        "options": [
          "Adeus formal",
          "Tchau!",
          "Com licença",
          "Até a eternidade"
        ],
        "answer": 1,
        "explanation": "Tchau (do italiano ciao) é universal no Brasil."
      }
    ]
  },
  {
    "id": "pt-3",
    "language": "pt",
    "level": "A1 · Iniciante",
    "emoji": "🔢",
    "title": "Números, Dias & Calendário",
    "description": "Aprenda os dias da semana terminados em \"-feira\".",
    "xp": 25,
    "questions": [
      {
        "prompt": "Como se chama o primeiro dia útil da semana no Brasil?",
        "speech": "Segunda-feira",
        "emoji": "📅",
        "instruction": "Escolha o dia útil",
        "options": [
          "Domingo",
          "Terça-feira",
          "Segunda-feira",
          "Sábado"
        ],
        "answer": 2,
        "explanation": "Segunda-feira é o início da semana de trabalho."
      },
      {
        "prompt": "Qual dia antecede o sábado?",
        "speech": "Sexta-feira",
        "emoji": "🗓️",
        "instruction": "Identifique o dia",
        "options": [
          "Quarta-feira",
          "Quinta-feira",
          "Sexta-feira",
          "Domingo"
        ],
        "answer": 2,
        "explanation": "Sexta-feira vem antes do sábado."
      },
      {
        "prompt": "Quantos dias formam o fim de semana?",
        "speech": "Dois dias (sábado e domingo)",
        "emoji": "🏖️",
        "instruction": "Identifique os dias de descanso",
        "options": [
          "Sexta e sábado",
          "Apenas o domingo",
          "Sábado e domingo",
          "Quinta a domingo"
        ],
        "answer": 2,
        "explanation": "O fim de semana oficial é composto por sábado e domingo."
      },
      {
        "prompt": "Qual é o número \"50\" por extenso?",
        "speech": "Cinquenta",
        "emoji": "5️⃣0️⃣",
        "instruction": "Escolha o número",
        "options": [
          "Quarenta",
          "Cinquenta",
          "Sessenta",
          "Quinze"
        ],
        "answer": 1,
        "explanation": "50 é cinquenta."
      },
      {
        "prompt": "Qual é o número \"100\" em português?",
        "speech": "Cem",
        "emoji": "1️⃣0️⃣0️⃣",
        "instruction": "Identifique o numeral",
        "options": [
          "Dez",
          "Cento",
          "Mil",
          "Cem"
        ],
        "answer": 3,
        "explanation": "100 é cem (cento e um, cento e dois...)."
      },
      {
        "prompt": "Como perguntar as horas em português?",
        "speech": "Que horas são?",
        "emoji": "⏰",
        "instruction": "Selecione a pergunta",
        "options": [
          "Qual minuto vai?",
          "Quantos tempos tem?",
          "Onde está o relógio?",
          "Que horas são?"
        ],
        "answer": 3,
        "explanation": "\"Que horas são?\" é a pergunta clássica."
      },
      {
        "prompt": "Como se diz \"São três horas da tarde\"?",
        "speech": "São três horas da tarde",
        "emoji": "🕒",
        "instruction": "Identifique a hora",
        "options": [
          "Tem três horas tarde",
          "É três horas",
          "São três horas da tarde",
          "Está três horas"
        ],
        "answer": 2,
        "explanation": "A partir das 2h o verbo vai para o plural: \"São três horas\"."
      },
      {
        "prompt": "Como se diz \"É uma hora da tarde\"?",
        "speech": "É uma hora da tarde",
        "emoji": "🕐",
        "instruction": "Identifique a hora singular",
        "options": [
          "Está uma hora",
          "São uma hora",
          "Tem uma hora",
          "É uma hora da tarde"
        ],
        "answer": 3,
        "explanation": "À 1h usa-se o singular: \"É uma hora\"."
      },
      {
        "prompt": "Qual é o mês das festas de São João e inverno no Brasil?",
        "speech": "Junho",
        "emoji": "🌽",
        "instruction": "Identifique o mês",
        "options": [
          "Abril",
          "Dezembro",
          "Janeiro",
          "Junho"
        ],
        "answer": 3,
        "explanation": "Junho é o mês das tradicionais festas juninas."
      },
      {
        "prompt": "Qual é o último mês do ano?",
        "speech": "Dezembro",
        "emoji": "🎄",
        "instruction": "Identifique o mês",
        "options": [
          "Dezembro",
          "Novembro",
          "Janeiro",
          "Outubro"
        ],
        "answer": 0,
        "explanation": "Dezembro é o décimo segundo mês do ano."
      }
    ]
  },
  {
    "id": "pt-4",
    "language": "pt",
    "level": "A1 · Iniciante",
    "emoji": "☕",
    "title": "Na Padaria & Comidas Típicas",
    "description": "Peça pão na chapa, pingado e suco de laranja.",
    "xp": 25,
    "questions": [
      {
        "prompt": "O que é um \"pingado\" em uma padaria brasileira?",
        "speech": "Pingado",
        "emoji": "☕",
        "instruction": "Identifique o pedido tradicional",
        "options": [
          "Chá gelado",
          "Suco de maracujá",
          "Água com gás",
          "Café com um pingo de leite"
        ],
        "answer": 3,
        "explanation": "\"Pingado\" é o clássico café com um pouco de leite servido no copo americano."
      },
      {
        "prompt": "O que é \"Pão na chapa\"?",
        "speech": "Pão na chapa",
        "emoji": "🍞",
        "instruction": "Identifique o lanche",
        "options": [
          "Pão francês com manteiga tostado na chapa quente",
          "Pão doce recheado",
          "Pão com presunto cru",
          "Torrada fria"
        ],
        "answer": 0,
        "explanation": "Pão na chapa com manteiga é o café da manhã paulistano mais famoso."
      },
      {
        "prompt": "Qual iguaria mineira feita com polvilho e queijo é patrimônio nacional?",
        "speech": "Pão de queijo",
        "emoji": "🧀",
        "instruction": "Identifique o salgado",
        "options": [
          "Coxinha",
          "Pão de queijo",
          "Pastel de feira",
          "Bolo de cenoura"
        ],
        "answer": 1,
        "explanation": "O pão de queijo é adorado em todo o Brasil."
      },
      {
        "prompt": "Qual salgado brasileiro em formato de gota é recheado com frango desfiado?",
        "speech": "Coxinha",
        "emoji": "🍗",
        "instruction": "Identifique o salgado",
        "options": [
          "Empada",
          "Kibe",
          "Coxinha",
          "Esfiha"
        ],
        "answer": 2,
        "explanation": "A coxinha de frango é o salgado mais popular."
      },
      {
        "prompt": "Como pedir a conta ao garçom no Brasil?",
        "speech": "A conta, por favor!",
        "emoji": "🧾",
        "instruction": "Selecione a frase",
        "options": [
          "Me cobre dinheiro!",
          "O preço agora!",
          "A conta, por favor!",
          "Nota rápida!"
        ],
        "answer": 2,
        "explanation": "\"A conta, por favor\" é o pedido educado."
      },
      {
        "prompt": "Qual é o prato nacional brasileiro com feijão preto e carnes?",
        "speech": "Feijoada",
        "emoji": "🍲",
        "instruction": "Identifique o prato",
        "options": [
          "Acarajé",
          "Moqueca",
          "Vatapá",
          "Feijoada"
        ],
        "answer": 3,
        "explanation": "A feijoada completa é o prato emblemático do Brasil."
      },
      {
        "prompt": "O que é \"Açaí\"?",
        "speech": "Açaí",
        "emoji": "🍇",
        "instruction": "Identifique o fruto da Amazônia",
        "options": [
          "Fruto amazônico servido gelado na tigela com granola e frutas",
          "Um tipo de refrigerante",
          "Um peixe de rio",
          "Uma sobremesa quente de forno"
        ],
        "answer": 0,
        "explanation": "O açaí é muito consumido refrescante com granola."
      },
      {
        "prompt": "Como pedir água sem gás no restaurante?",
        "speech": "Uma água sem gás, por favor",
        "emoji": "💧",
        "instruction": "Escolha o pedido",
        "options": [
          "Água parada",
          "Água vazia",
          "Uma água sem gás, por favor",
          "Água sem ar"
        ],
        "answer": 2,
        "explanation": "Usa-se \"água sem gás\"."
      },
      {
        "prompt": "O que é um \"Pastel de feira\"?",
        "speech": "Pastel de feira",
        "emoji": "🥟",
        "instruction": "Identifique a comida de rua",
        "options": [
          "Um bolo doce",
          "Massa frita crocante recheada com carne, queijo ou palmito",
          "Um pão italiano",
          "Uma torta de liquidificador"
        ],
        "answer": 1,
        "explanation": "O pastel frito na hora acompanhado de caldo de cana é tradição de feira."
      },
      {
        "prompt": "Qual sobremesa tradicional leva leite condensado, chocolate e granulado?",
        "speech": "Brigadeiro",
        "emoji": "🍫",
        "instruction": "Identifique o doce",
        "options": [
          "Pudim de leite",
          "Quindim",
          "Brigadeiro",
          "Cocada"
        ],
        "answer": 2,
        "explanation": "O brigadeiro é o doce de aniversário mais clássico do Brasil."
      }
    ]
  },
  {
    "id": "pt-5",
    "language": "pt",
    "level": "A1 · Iniciante",
    "emoji": "⚖️",
    "title": "Verbos Ser e Estar",
    "description": "Eu sou brasileiro vs Eu estou cansado.",
    "xp": 25,
    "questions": [
      {
        "prompt": "Complete: \"O Rio de Janeiro ___ uma cidade linda.\"",
        "speech": "O Rio de Janeiro é uma cidade linda",
        "emoji": "🏖️",
        "instruction": "Escolha ser ou estar",
        "options": [
          "está",
          "é",
          "são",
          "estão"
        ],
        "answer": 1,
        "explanation": "Usa-se \"é\" (verbo ser) para qualidades permanentes."
      },
      {
        "prompt": "Complete com o estado temporário: \"Eu ___ muito cansado hoje.\"",
        "speech": "Eu estou muito cansado hoje",
        "emoji": "🥱",
        "instruction": "Escolha ser ou estar",
        "options": [
          "sou",
          "estou",
          "é",
          "está"
        ],
        "answer": 1,
        "explanation": "Para estados físicos ou emocionais transitórios usa-se \"estar\"."
      },
      {
        "prompt": "Complete com a nacionalidade: \"Nós ___ brasileiros.\"",
        "speech": "Nós somos brasileiros",
        "emoji": "🇧🇷",
        "instruction": "Identifique a conjugação",
        "options": [
          "estamos",
          "somos",
          "são",
          "é"
        ],
        "answer": 1,
        "explanation": "Nacionalidade permanente usa \"somos\" (verbo ser)."
      },
      {
        "prompt": "Complete com a localização física: \"Meus amigos ___ na praia.\"",
        "speech": "Estão na praia",
        "emoji": "🏖️",
        "instruction": "Localização física",
        "options": [
          "está",
          "são",
          "é",
          "estão"
        ],
        "answer": 3,
        "explanation": "Localização no espaço usa o verbo \"estar\": estão."
      },
      {
        "prompt": "Complete a profissão: \"Ela ___ médica no hospital.\"",
        "speech": "Ela é médica",
        "emoji": "👩‍⚕️",
        "instruction": "Identifique o verbo de profissão",
        "options": [
          "está",
          "é",
          "são",
          "tem"
        ],
        "answer": 1,
        "explanation": "Profissões habituais usam \"é\" (verbo ser)."
      },
      {
        "prompt": "Complete o estado da porta: \"A porta ___ aberta.\"",
        "speech": "A porta está aberta",
        "emoji": "🚪",
        "instruction": "Estado resultante",
        "options": [
          "são",
          "é",
          "está",
          "fica"
        ],
        "answer": 2,
        "explanation": "Estado transitório usa \"está\"."
      },
      {
        "prompt": "Qual a forma do verbo ser para \"Eu\" no presente?",
        "speech": "Eu sou",
        "emoji": "👤",
        "instruction": "Conjugue o verbo ser",
        "options": [
          "sou",
          "estou",
          "é",
          "somos"
        ],
        "answer": 0,
        "explanation": "Eu sou professor."
      },
      {
        "prompt": "Qual a forma do verbo estar para \"Eles\" no presente?",
        "speech": "Eles estão",
        "emoji": "👥",
        "instruction": "Conjugue estar",
        "options": [
          "estão",
          "são",
          "está",
          "estamos"
        ],
        "answer": 0,
        "explanation": "Eles estão felizes."
      },
      {
        "prompt": "Qual a diferença entre \"Ele é alegre\" e \"Ele está alegre\"?",
        "speech": "É alegre vs Está alegre",
        "emoji": "😊",
        "instruction": "Interprete a nuance",
        "options": [
          "Não há diferença",
          "\"É alegre\" é traço de personalidade; \"Está alegre\" é momento transitório",
          "\"Está alegre\" é para sempre",
          "\"É alegre\" é tristeza"
        ],
        "answer": 1,
        "explanation": "Ser define personalidade duradoura; estar expressa o momento passageiro."
      },
      {
        "prompt": "Complete: \"O almoço ___ delicioso hoje!\"",
        "speech": "O almoço está delicioso hoje",
        "emoji": "🍲",
        "instruction": "Avaliação da comida",
        "options": [
          "está",
          "é",
          "são",
          "foi permanente"
        ],
        "answer": 0,
        "explanation": "Avaliação da refeição do dia usa \"está delicioso\"."
      }
    ]
  },
  {
    "id": "pt-6",
    "language": "pt",
    "level": "A2 · Básico",
    "emoji": "👨‍👩‍👧",
    "title": "Família & Pessoas Queridas",
    "description": "Pai, mãe, irmãos, filhos, tios e primos.",
    "xp": 25,
    "questions": [
      {
        "prompt": "Como se chama o filho do seu tio?",
        "speech": "Primo",
        "emoji": "👦",
        "instruction": "Identifique o parentesco",
        "options": [
          "Primo",
          "Sobrinho",
          "Irmão",
          "Padrinho"
        ],
        "answer": 0,
        "explanation": "O filho dos tios é seu primo."
      },
      {
        "prompt": "Como se chama a mãe do seu pai?",
        "speech": "Avó",
        "emoji": "👵",
        "instruction": "Identifique o parentesco",
        "options": [
          "Madrinha",
          "Tia",
          "Sogra",
          "Avó"
        ],
        "answer": 3,
        "explanation": "A mãe dos pais é sua avó."
      },
      {
        "prompt": "O que são \"Meus pais\"?",
        "speech": "Meus pais",
        "emoji": "👨‍👩‍👧",
        "instruction": "Identifique o significado",
        "options": [
          "Meus parentes distantes",
          "Meu pai e minha mãe juntos",
          "Meus tios",
          "Meus irmãos"
        ],
        "answer": 1,
        "explanation": "\"Meus pais\" refere-se ao pai e mãe."
      },
      {
        "prompt": "Como se chama a filha da sua irmã?",
        "speech": "Sobrinha",
        "emoji": "👧",
        "instruction": "Identifique o parentesco",
        "options": [
          "Prima",
          "Sobrinha",
          "Enteada",
          "Afilhada"
        ],
        "answer": 1,
        "explanation": "A filha do irmão ou irmã é sua sobrinha."
      },
      {
        "prompt": "O que significa \"Parente\" em português?",
        "speech": "Parentes",
        "emoji": "👥",
        "instruction": "Evite falso amigo com parents",
        "options": [
          "Amigos de infância",
          "Apenas pai e mãe",
          "Membros da família em geral (tios, primos, avós)",
          "Vizinhos de rua"
        ],
        "answer": 2,
        "explanation": "No Brasil \"parentes\" abrange toda a família extensa."
      },
      {
        "prompt": "Como se chama o marido da sua filha?",
        "speech": "Genro",
        "emoji": "👨",
        "instruction": "Identifique o parentesco por afinidade",
        "options": [
          "Genro",
          "Nora",
          "Cunhado",
          "Sogro"
        ],
        "answer": 0,
        "explanation": "O marido da filha é o genro."
      },
      {
        "prompt": "Como se chama a esposa do seu filho?",
        "speech": "Nora",
        "emoji": "👩",
        "instruction": "Identifique o parentesco por afinidade",
        "options": [
          "Genro",
          "Nora",
          "Cunhada",
          "Sogra"
        ],
        "answer": 1,
        "explanation": "A esposa do filho é a nora."
      },
      {
        "prompt": "Como se chama o irmão do seu cônjuge?",
        "speech": "Cunhado",
        "emoji": "🧔",
        "instruction": "Identifique o parentesco",
        "options": [
          "Cunhado",
          "Primo",
          "Genro",
          "Padrasto"
        ],
        "answer": 0,
        "explanation": "O irmão da esposa ou do marido é o cunhado."
      },
      {
        "prompt": "Como se chama o pai da sua esposa?",
        "speech": "Sogro",
        "emoji": "👴",
        "instruction": "Identifique o parentesco",
        "options": [
          "Tio",
          "Sogro",
          "Padrinho",
          "Cunhado"
        ],
        "answer": 1,
        "explanation": "O pai do cônjuge é o sogro."
      },
      {
        "prompt": "Como se diz \"Ele é meu irmão mais velho\"?",
        "speech": "Irmão mais velho",
        "emoji": "👦",
        "instruction": "Identifique a idade relativa",
        "options": [
          "Meu irmão mais velho",
          "Meu irmão maior",
          "Meu irmão grande",
          "Meu irmão sênior"
        ],
        "answer": 0,
        "explanation": "Usa-se \"mais velho\" para idade."
      }
    ]
  },
  {
    "id": "pt-7",
    "language": "pt",
    "level": "A2 · Básico",
    "emoji": "⏰",
    "title": "Rotina Cotidiana & Horários",
    "description": "Acordar, tomar banho, trabalhar e pegar trânsito.",
    "xp": 30,
    "questions": [
      {
        "prompt": "Complete: \"Eu sempre ___ café antes de trabalhar.\"",
        "speech": "Eu sempre tomo café antes de trabalhar",
        "emoji": "☕",
        "instruction": "Conjugue o verbo tomar",
        "options": [
          "tomo",
          "toma",
          "tomamos",
          "tomando"
        ],
        "answer": 0,
        "explanation": "1ª pessoa do singular: Eu tomo."
      },
      {
        "prompt": "Complete a rotina: \"Ela ___ cedo todos os dias.\"",
        "speech": "Ela acorda cedo",
        "emoji": "🌅",
        "instruction": "Conjugue acordar",
        "options": [
          "acordo",
          "acorda",
          "acordam",
          "acordamos"
        ],
        "answer": 1,
        "explanation": "Ela acorda com a terminação -a."
      },
      {
        "prompt": "Como dizer \"Eu pego trânsito pesado para ir ao trabalho\"?",
        "speech": "Pego trânsito",
        "emoji": "🚗",
        "instruction": "Expressão do dia a dia",
        "options": [
          "Tomo engarrafamento",
          "Pego trânsito pesado",
          "Fico parado na rua",
          "Corro de carro"
        ],
        "answer": 1,
        "explanation": "\"Pegar trânsito\" é a expressão mais usada nas cidades brasileiras."
      },
      {
        "prompt": "A que horas costuma ser o almoço no Brasil?",
        "speech": "Ao meio-dia ou 13h",
        "emoji": "🍽️",
        "instruction": "Identifique o horário comum",
        "options": [
          "Às 9h da manhã",
          "Às 16h",
          "Entre 12h e 13h",
          "Às 21h"
        ],
        "answer": 2,
        "explanation": "O almoço brasileiro é a refeição principal entre 12h e 13h30."
      },
      {
        "prompt": "O que significa o advérbio \"Sempre\"?",
        "speech": "Sempre",
        "emoji": "🔄",
        "instruction": "Identifique a frequência",
        "options": [
          "Nunca",
          "Em todas as ocasiões / continuamente",
          "Raramente",
          "Às vezes"
        ],
        "answer": 1,
        "explanation": "Sempre expressa constância total."
      },
      {
        "prompt": "O que significa \"De vez em quando\"?",
        "speech": "De vez em quando",
        "emoji": "⏳",
        "instruction": "Identifique a frequência",
        "options": [
          "Nunca mais",
          "Todos os dias sem falta",
          "Ocasionalmente / às vezes",
          "Sempre"
        ],
        "answer": 2,
        "explanation": "\"De vez em quando\" significa ocasionalmente."
      },
      {
        "prompt": "Complete com o verbo reflexivo: \"Eu ___ às 23 horas.\"",
        "speech": "Eu me deito às 23 horas",
        "emoji": "🛏️",
        "instruction": "Conjugue deitar-se",
        "options": [
          "deito-me formal",
          "me deito",
          "te deitas",
          "se deita"
        ],
        "answer": 1,
        "explanation": "Usa-se \"eu me deito\" para ir dormir."
      },
      {
        "prompt": "Complete com plural: \"Nós ___ na academia à noite.\"",
        "speech": "Nós treinamos na academia",
        "emoji": "🏋️",
        "instruction": "Conjugue treinar",
        "options": [
          "treinamos",
          "treina",
          "treinam",
          "treinando"
        ],
        "answer": 0,
        "explanation": "1ª pessoa do plural: Nós treinamos."
      },
      {
        "prompt": "O que significa \"Bater o ponto\" no trabalho?",
        "speech": "Bater o ponto",
        "emoji": "⏱️",
        "instruction": "Identifique a expressão profissional",
        "options": [
          "Quebrar o relógio da parede",
          "Registrar o horário de entrada ou saída no trabalho",
          "Terminar o café",
          "Fazer hora extra"
        ],
        "answer": 1,
        "explanation": "\"Bater o ponto\" é registrar o ponto eletrônico."
      },
      {
        "prompt": "Como dizer \"Preciso descansar no fim de semana\"?",
        "speech": "Preciso descansar",
        "emoji": "🛋️",
        "instruction": "Selecione a frase",
        "options": [
          "Preciso cansar",
          "Quero quebrar o sábado",
          "Vou dormir para sempre",
          "Preciso descansar no fim de semana"
        ],
        "answer": 3,
        "explanation": "Descansar é repor as energias."
      }
    ]
  },
  {
    "id": "pt-8",
    "language": "pt",
    "level": "A2 · Básico",
    "emoji": "🗺️",
    "title": "Na Cidade & Pedindo Informações",
    "description": "Estação de metrô, ponto de ônibus e vire à direita.",
    "xp": 30,
    "questions": [
      {
        "prompt": "Como perguntar onde pegar o transporte público coletivo?",
        "speech": "Onde fica o ponto de ônibus?",
        "emoji": "🚌",
        "instruction": "Escolha a pergunta",
        "options": [
          "Onde corre o trem?",
          "Qual é o preço do avião?",
          "Como vai a rua?",
          "Onde fica o ponto de ônibus?"
        ],
        "answer": 3,
        "explanation": "\"Ponto de ônibus\" é o local de embarque coletivo nas ruas."
      },
      {
        "prompt": "Como indicar que a pessoa deve continuar em linha reta?",
        "speech": "Siga em frente",
        "emoji": "⬆️",
        "instruction": "Identifique a direção",
        "options": [
          "Pare na esquina",
          "Vire à direita",
          "Dê meia volta",
          "Siga em frente / Vá reto"
        ],
        "answer": 3,
        "explanation": "\"Siga em frente\" orienta a continuar sem virar."
      },
      {
        "prompt": "O que significa \"Vire à esquerda\"?",
        "speech": "Vire à esquerda",
        "emoji": "⬅️",
        "instruction": "Identifique o sentido",
        "options": [
          "Seguir reto",
          "Virar para a direita",
          "Fazer a curva para a esquerda",
          "Entrar na contramão"
        ],
        "answer": 2,
        "explanation": "Vire à esquerda indica o lado esquerdo."
      },
      {
        "prompt": "O que é \"A calçada\"?",
        "speech": "A calçada",
        "emoji": "🚶",
        "instruction": "Identifique o passeio público",
        "options": [
          "Espaço reservado aos pedestres ao lado da rua",
          "A pista de alta velocidade",
          "O canteiro de flores",
          "A garagem subterrânea"
        ],
        "answer": 0,
        "explanation": "A calçada é o passeio de pedestres."
      },
      {
        "prompt": "Como perguntar a distância de um ponto turístico?",
        "speech": "É muito longe daqui?",
        "emoji": "📍",
        "instruction": "Selecione a pergunta",
        "options": [
          "É muito longe daqui?",
          "Tem muitos metros agora?",
          "Onde vai a distância?",
          "Como é a quilometragem?"
        ],
        "answer": 0,
        "explanation": "\"É longe daqui?\" afere a distância física."
      },
      {
        "prompt": "O que é um \"Quarteirão\" ou \"Uma quadra\"?",
        "speech": "Uma quadra",
        "emoji": "🏙️",
        "instruction": "Identifique a unidade urbana",
        "options": [
          "Espaço urbano delimitado por quatro ruas que se cruzam",
          "Um prédio comercial",
          "Uma praça redonda",
          "Um viaduto alto"
        ],
        "answer": 0,
        "explanation": "Uma quadra ou quarteirão delimita o bloco de ruas."
      },
      {
        "prompt": "O que é \"A faixa de pedestres\"?",
        "speech": "Faixa de pedestres",
        "emoji": "🚶‍♂️",
        "instruction": "Identifique a sinalização",
        "options": [
          "Pintura listrada no asfalto para travessia segura de pessoas",
          "Pista exclusiva de motos",
          "Ciclovia de bicicletas",
          "Estacionamento de ônibus"
        ],
        "answer": 0,
        "explanation": "A faixa de pedestres garante prioridade de travessia."
      },
      {
        "prompt": "Como se chama o sinal luminoso de trânsito em diferentes estados do Brasil?",
        "speech": "Semáforo / Sinal / Farol",
        "emoji": "🚦",
        "instruction": "Identifique os sinônimos regionais",
        "options": [
          "Radar",
          "Luz de rua",
          "Luminária urbana",
          "Semáforo, farol (em SP) ou sinal (no RJ)"
        ],
        "answer": 3,
        "explanation": "Semáforo, sinal ou farol são designações regionais válidas."
      },
      {
        "prompt": "O que é \"O metrô\"?",
        "speech": "O metrô",
        "emoji": "🚇",
        "instruction": "Identifique o transporte",
        "options": [
          "Ônibus elétrico de bairro",
          "Transporte ferroviário urbano subterrâneo de alta capacidade",
          "Táxi de aplicativo",
          "Barca marítima"
        ],
        "answer": 1,
        "explanation": "O metrô liga bairros rapidamente."
      },
      {
        "prompt": "Como pedir uma corrida de táxi ou aplicativo?",
        "speech": "Chamar um carro por aplicativo",
        "emoji": "🚕",
        "instruction": "Identifique a expressão moderna",
        "options": [
          "Pegar carona na estrada",
          "Ligar para o trânsito",
          "Alugar uma van",
          "Pedir um carro por aplicativo / Chamar um táxi"
        ],
        "answer": 3,
        "explanation": "Chamar um carro por app é o método mais popular."
      }
    ]
  },
  {
    "id": "pt-9",
    "language": "pt",
    "level": "A2 · Básico",
    "emoji": "🛒",
    "title": "Na Feira Livre & Supermercado",
    "description": "Compre frutas tropicais e saiba quanto custa a dúzia.",
    "xp": 25,
    "questions": [
      {
        "prompt": "Quantas unidades tem \"uma dúzia de laranjas\"?",
        "speech": "Uma dúzia",
        "emoji": "🍊",
        "instruction": "Selecione a quantidade exata",
        "options": [
          "10 unidades",
          "12 unidades",
          "6 unidades",
          "20 unidades"
        ],
        "answer": 1,
        "explanation": "Uma dúzia corresponde a exatamente 12 unidades."
      },
      {
        "prompt": "Quantas unidades tem \"meia dúzia de ovos\"?",
        "speech": "Meia dúzia",
        "emoji": "🥚",
        "instruction": "Identifique a quantidade",
        "options": [
          "12 unidades",
          "6 unidades",
          "8 unidades",
          "5 unidades"
        ],
        "answer": 1,
        "explanation": "Meia dúzia são 6 unidades."
      },
      {
        "prompt": "Qual fruta tropical brasileira com coroa é famosa pelo sabor agridoce?",
        "speech": "Abacaxi",
        "emoji": "🍍",
        "instruction": "Identifique a fruta",
        "options": [
          "Abacaxi",
          "Melão",
          "Banana",
          "Laranja"
        ],
        "answer": 0,
        "explanation": "O abacaxi é conhecido pela casca e coroa verde."
      },
      {
        "prompt": "O que significa pedir \"O troco, por favor\"?",
        "speech": "O troco",
        "emoji": "💵",
        "instruction": "Identifique o termo financeiro",
        "options": [
          "Um brinde do feirante",
          "O recibo de papel",
          "A sacola de plástico",
          "O dinheiro devolvido quando se paga a mais que o valor exato"
        ],
        "answer": 3,
        "explanation": "Troco é a diferença monetária devolvida ao cliente."
      },
      {
        "prompt": "O que é \"Um quilo de carne\"?",
        "speech": "Um quilo",
        "emoji": "🥩",
        "instruction": "Identifique o peso",
        "options": [
          "1.000 gramas de peso",
          "500 gramas",
          "100 gramas",
          "2.000 gramas"
        ],
        "answer": 0,
        "explanation": "1 quilo (kg) equivale a 1.000 gramas."
      },
      {
        "prompt": "O que o cliente pede com: \"Moço, me dá um quilo de tomate bem maduro\"?",
        "speech": "Tomate maduro",
        "emoji": "🍅",
        "instruction": "Interprete o pedido",
        "options": [
          "Suco de tomate",
          "Tomates verdes para plantar",
          "Massa de tomate em lata",
          "Tomates prontos para consumo imediato / vermelhos"
        ],
        "answer": 3,
        "explanation": "Maduro significa pronto para comer."
      },
      {
        "prompt": "O que significa \"O carrinho de compras\"?",
        "speech": "Carrinho de compras",
        "emoji": "🛒",
        "instruction": "Identifique o item",
        "options": [
          "O caminhão de entrega",
          "Veículo com rodas para transportar produtos pelo supermercado",
          "A cesta de palha",
          "A sacola de papel"
        ],
        "answer": 1,
        "explanation": "Carrinho de compras serve para carregar as compras."
      },
      {
        "prompt": "Como perguntar o preço de uma mercadoria?",
        "speech": "Quanto custa este quilo?",
        "emoji": "🏷️",
        "instruction": "Selecione a pergunta",
        "options": [
          "Quanto custa este quilo?",
          "Qual é a riqueza disso?",
          "Como vale o produto?",
          "Onde vai o dinheiro?"
        ],
        "answer": 0,
        "explanation": "\"Quanto custa...?\" é a pergunta comercial padrão."
      },
      {
        "prompt": "O que significa \"Pagar no débito\"?",
        "speech": "Cartão de débito",
        "emoji": "💳",
        "instruction": "Identifique a forma de pagamento bancária",
        "options": [
          "Parcelar a compra para o próximo mês",
          "Descontar o valor imediatamente do saldo da conta corrente",
          "Pagar em notas de papel",
          "Fazer fiado na caderneta"
        ],
        "answer": 1,
        "explanation": "Cartão de débito desconta o dinheiro na hora."
      },
      {
        "prompt": "O que é a \"Fila do caixa preferencial\"?",
        "speech": "Caixa preferencial",
        "emoji": "👵",
        "instruction": "Identifique o atendimento prioritário",
        "options": [
          "Atendimento prioritário para idosos, gestantes e pessoas com deficiência",
          "Fila para quem compra rápido",
          "Caixa exclusivo de funcionários",
          "Fila de compras caras"
        ],
        "answer": 0,
        "explanation": "O caixa preferencial atende prioritariamente quem tem direito por lei."
      }
    ]
  },
  {
    "id": "pt-10",
    "language": "pt",
    "level": "A2 · Básico",
    "emoji": "🏠",
    "title": "A Casa Brasileira & Cômodos",
    "description": "Sala de estar, varanda, cozinha e área de serviço.",
    "xp": 25,
    "questions": [
      {
        "prompt": "Onde se costuma lavar e secar roupas em uma residência brasileira?",
        "speech": "Área de serviço",
        "emoji": "🧺",
        "instruction": "Identifique o cômodo",
        "options": [
          "Na varanda da frente",
          "Na sala de jantar",
          "No quarto de casal",
          "Na área de serviço / lavanderia"
        ],
        "answer": 3,
        "explanation": "A área de serviço é onde fica o tanque e a máquina de lavar."
      },
      {
        "prompt": "Qual é o cômodo onde se recebem as visitas para conversar?",
        "speech": "Sala de estar",
        "emoji": "🛋️",
        "instruction": "Identifique o espaço social",
        "options": [
          "Sótão",
          "Cozinha",
          "Despensa",
          "Sala de estar"
        ],
        "answer": 3,
        "explanation": "A sala de estar é o cômodo social de entrada."
      },
      {
        "prompt": "Onde a família se reúne para dormir?",
        "speech": "No quarto",
        "emoji": "🛏️",
        "instruction": "Identifique o cômodo de repouso",
        "options": [
          "Na garagem",
          "Na cozinha",
          "No quarto / dormitório",
          "No quintal"
        ],
        "answer": 2,
        "explanation": "O quarto é o cômodo de dormir."
      },
      {
        "prompt": "O que é o \"Quintal\"?",
        "speech": "Quintal",
        "emoji": "🏡",
        "instruction": "Identifique a área externa",
        "options": [
          "O teto da casa",
          "O corredor do prédio",
          "A porta principal",
          "Espaço aberto aos fundos da casa com terra, grama ou piso"
        ],
        "answer": 3,
        "explanation": "O quintal é o terreno atrás ou ao redor da casa."
      },
      {
        "prompt": "O que significa \"Mora de aluguel\"?",
        "speech": "Morar de aluguel",
        "emoji": "🔑",
        "instruction": "Identifique o regime de moradia",
        "options": [
          "Ser dono da casa quitada",
          "Pagar um valor mensal ao proprietário pelo uso do imóvel",
          "Morar em hotel grátis",
          "Invadir um terreno"
        ],
        "answer": 1,
        "explanation": "Aluguel é o pagamento mensal pela locação."
      },
      {
        "prompt": "O que é \"A portaria\" de um prédio residencial?",
        "speech": "A portaria",
        "emoji": "🏢",
        "instruction": "Identifique a entrada do edifício",
        "options": [
          "O salão de festas",
          "A garagem de carros",
          "Local de acesso com porteiro para controle de entrada e correspondências",
          "A caixa d’água"
        ],
        "answer": 2,
        "explanation": "A portaria controla a segurança e o acesso."
      },
      {
        "prompt": "O que é \"A pia\"?",
        "speech": "A pia",
        "emoji": "🚰",
        "instruction": "Identifique o equipamento hidrossanitário",
        "options": [
          "A geladeira",
          "Bancada com torneira para lavar louça ou escovar os dentes",
          "O fogão a gás",
          "O forno elétrico"
        ],
        "answer": 1,
        "explanation": "A pia da cozinha ou banheiro serve para lavagem com água."
      },
      {
        "prompt": "O que significa \"A garagem\"?",
        "speech": "A garagem",
        "emoji": "🚗",
        "instruction": "Identifique o espaço",
        "options": [
          "A churrasqueira",
          "O jardim de flores",
          "A piscina",
          "Local coberto ou descoberto para guardar automóveis"
        ],
        "answer": 3,
        "explanation": "Garagem é onde se estacionam os veículos."
      },
      {
        "prompt": "O que é uma \"Churrasqueira\"?",
        "speech": "Churrasqueira",
        "emoji": "🥩",
        "instruction": "Identifique o espaço de lazer culinário",
        "options": [
          "Equipamento ou espaço gourmet para assar carnes na brasa",
          "Uma lareira de aquecer",
          "Um tipo de fogão a lenha",
          "Um armário de pratos"
        ],
        "answer": 0,
        "explanation": "A churrasqueira é ponto de encontro nos fins de semana brasileiros."
      },
      {
        "prompt": "Como dizer \"Vou trancar a porta com a chave\"?",
        "speech": "Trancar a porta",
        "emoji": "🔐",
        "instruction": "Identifique a ação de segurança",
        "options": [
          "Pintar a madeira",
          "Abrir a porta toda",
          "Trancar a porta com a chave",
          "Limpar o trinco"
        ],
        "answer": 2,
        "explanation": "\"Trancar a porta\" é fechar com chave para segurança."
      }
    ]
  },
  {
    "id": "pt-11",
    "language": "pt",
    "level": "B1 · Intermediário",
    "emoji": "📜",
    "title": "Passado Perfeito vs Imperfeito",
    "description": "Ontem eu fui ao cinema vs Antigamente eu morava.",
    "xp": 35,
    "questions": [
      {
        "prompt": "Para uma ação pontual e concluída ontem, usamos:",
        "speech": "Ontem eu comprei um livro",
        "emoji": "📖",
        "instruction": "Selecione o tempo certo",
        "options": [
          "Pretérito Perfeito (\"comprei\")",
          "Pretérito Imperfeito (\"comprava\")",
          "Futuro do presente",
          "Gerúndio"
        ],
        "answer": 0,
        "explanation": "Pretérito Perfeito expressa ação concluída em momento definido."
      },
      {
        "prompt": "Para descrever um hábito contínuo que se repetia na infância, usamos:",
        "speech": "Eu brincava na rua",
        "emoji": "🧒",
        "instruction": "Identifique o tempo do hábito",
        "options": [
          "Presente",
          "Pretérito Perfeito (\"brinquei\")",
          "Futuro",
          "Pretérito Imperfeito (\"brincava\")"
        ],
        "answer": 3,
        "explanation": "O Pretérito Imperfeito descreve hábitos passados."
      },
      {
        "prompt": "Qual o pretérito perfeito de \"ir\" para a 1ª pessoa (eu)?",
        "speech": "Eu fui",
        "emoji": "🚶‍♂️",
        "instruction": "Conjugue o verbo irregular ir",
        "options": [
          "Eu fizesse",
          "Eu ia",
          "Eu fora",
          "Eu fui"
        ],
        "answer": 3,
        "explanation": "Ontem eu fui ao mercado."
      },
      {
        "prompt": "Qual o pretérito imperfeito de \"ter\" para \"nós\"?",
        "speech": "Nós tínhamos",
        "emoji": "💼",
        "instruction": "Conjugue ter no imperfeito",
        "options": [
          "Temos",
          "Tivemos",
          "Teremos",
          "Tínhamos"
        ],
        "answer": 3,
        "explanation": "Antigamente nós tínhamos muito tempo livre."
      },
      {
        "prompt": "Complete com ação pontual: \"Na semana passada eu ___ meu carro.\"",
        "speech": "Vendi meu carro",
        "emoji": "🚗",
        "instruction": "Conjugue vender no perfeito",
        "options": [
          "vendo",
          "vendia",
          "vendera",
          "vendi"
        ],
        "answer": 3,
        "explanation": "Ação acabada na semana passada: vendi."
      },
      {
        "prompt": "Complete o cenário de fundo: \"___ muito calor quando cheguei.\"",
        "speech": "Fazia muito calor",
        "emoji": "☀️",
        "instruction": "Descreva o tempo atmosférico no passado",
        "options": [
          "Fazia",
          "Fez",
          "Fará",
          "Faça"
        ],
        "answer": 0,
        "explanation": "Descrições de clima de fundo usam imperfeito: fazia muito calor."
      },
      {
        "prompt": "Qual o pretérito perfeito irregular de \"fazer\" para \"ele\"?",
        "speech": "Ele fez",
        "emoji": "✍️",
        "instruction": "Conjugue fazer",
        "options": [
          "fazia",
          "fez",
          "fizer",
          "faça"
        ],
        "answer": 1,
        "explanation": "Ontem ele fez um bolo gostoso."
      },
      {
        "prompt": "Complete com a combinação temporal: \"Eu ___ quando o telefone tocou.\"",
        "speech": "Eu dormia quando o telefone tocou",
        "emoji": "📞",
        "instruction": "Ação em andamento interrompida",
        "options": [
          "dormi",
          "dormia",
          "dormirei",
          "durmo"
        ],
        "answer": 1,
        "explanation": "Ação contínua (dormia) interrompida por ação pontual (tocou)."
      },
      {
        "prompt": "Qual a terminação regular de verbos da 1ª conjugação (-ar) no imperfeito?",
        "speech": "Cantava, estudava",
        "emoji": "🎶",
        "instruction": "Identifique a terminação",
        "options": [
          "-ia, -íamos, -iam",
          "-ei, -ou, -amos",
          "-ava, -ávamos, -avam",
          "-ara, -áramos"
        ],
        "answer": 2,
        "explanation": "Verbos em -ar fazem imperfeito em -ava."
      },
      {
        "prompt": "O que a frase expressa: \"Antigamente nós viajávamos todo verão\"?",
        "speech": "Hábito passado",
        "emoji": "🏖️",
        "instruction": "Interprete a frase",
        "options": [
          "Um arrependimento recente",
          "Uma viagem que acontecerá no próximo mês",
          "Uma dúvida",
          "Um hábito costumeiro no passado que não ocorre mais"
        ],
        "answer": 3,
        "explanation": "Expressa costume repetitivo de épocas passadas."
      }
    ]
  },
  {
    "id": "pt-12",
    "language": "pt",
    "level": "B1 · Intermediário",
    "emoji": "✈️",
    "title": "Viagens pelo Brasil & Turismo",
    "description": "Pousadas, praias do Nordeste, passagens e passeios.",
    "xp": 30,
    "questions": [
      {
        "prompt": "Como se chama uma acomodação charmosa e aconchegante típica do litoral?",
        "speech": "Pousada",
        "emoji": "🏖️",
        "instruction": "Identifique o meio de hospedagem",
        "options": [
          "República de estudantes",
          "Barraca de praia",
          "Pousada",
          "Albergue público"
        ],
        "answer": 2,
        "explanation": "\"Pousada\" é a hospedagem típica e aconchegante no Brasil."
      },
      {
        "prompt": "O que significa fazer uma \"viagem bate e volta\"?",
        "speech": "Bate e volta",
        "emoji": "🚗",
        "instruction": "Identifique o tipo de passeio curto",
        "options": [
          "Uma viagem de volta ao mundo de navio",
          "Ir e retornar no mesmo dia sem pernoitar fora",
          "Um voo com cinco conexões",
          "Ficar um mês acampado"
        ],
        "answer": 1,
        "explanation": "Bate e volta é a viagem de um único dia."
      },
      {
        "prompt": "Qual estado brasileiro abriga as famosas cidades históricas de Ouro Preto e Tiradentes?",
        "speech": "Minas Gerais",
        "emoji": "⛪",
        "instruction": "Identifique o estado histórico",
        "options": [
          "Minas Gerais",
          "Bahia",
          "Rio Grande do Sul",
          "Amazonas"
        ],
        "answer": 0,
        "explanation": "Minas Gerais concentra o rico patrimônio barroco colonial."
      },
      {
        "prompt": "O que são as \"Cataratas do Iguaçu\"?",
        "speech": "Cataratas do Iguaçu",
        "emoji": "🌊",
        "instruction": "Identifique a maravilha natural",
        "options": [
          "Um rio no Pantanal",
          "Uma praia de corais no Nordeste",
          "Uma montanha na serra gaúcha",
          "Conjunto monumental de quedas d’água no Paraná na fronteira com a Argentina"
        ],
        "answer": 3,
        "explanation": "As Cataratas do Iguaçu são patrimônio natural mundial."
      },
      {
        "prompt": "Como se chama o bilhete que autoriza o embarque em ônibus intermunicipais?",
        "speech": "Passagem de ônibus",
        "emoji": "🎫",
        "instruction": "Identifique o documento",
        "options": [
          "Boleto bancário",
          "Passagem de ônibus",
          "Cartão cidadão",
          "Protocolo de viagem"
        ],
        "answer": 1,
        "explanation": "Passagem de ônibus é o bilhete de viagem."
      },
      {
        "prompt": "Qual é o bioma úmido famoso pela riquíssima fauna no Centro-Oeste brasileiro?",
        "speech": "Pantanal",
        "emoji": "🐊",
        "instruction": "Identifique a região de ecoturismo",
        "options": [
          "Mata Atlântica",
          "Caatinga",
          "Pampa",
          "Pantanal"
        ],
        "answer": 3,
        "explanation": "O Pantanal é o maior santuário de vida selvagem úmida do mundo."
      },
      {
        "prompt": "O que significa comprar uma passagem aérea \"na baixa temporada\"?",
        "speech": "Baixa temporada",
        "emoji": "📉",
        "instruction": "Identifique a época de viagens",
        "options": [
          "Época de Natal e Ano Novo lotada",
          "Período fora de férias escolares com tarifas mais baratas e destinos vazios",
          "Mês de julho com preços no auge",
          "Feriado de Carnaval"
        ],
        "answer": 1,
        "explanation": "Baixa temporada tem preços menores e menos turistas."
      },
      {
        "prompt": "Como se chama o traslado que leva turistas do aeroporto ao hotel?",
        "speech": "Traslado / Transfer",
        "emoji": "🚐",
        "instruction": "Identifique o transporte",
        "options": [
          "Transfer (ou traslado)",
          "Linha expressa",
          "Escolta",
          "Carona solidária"
        ],
        "answer": 0,
        "explanation": "Transfer é o transporte receptivo entre aeroporto e hotel."
      },
      {
        "prompt": "Qual arquipélago pernambucano é santuário ecológico e famoso pelas águas cristalinas?",
        "speech": "Fernando de Noronha",
        "emoji": "🐬",
        "instruction": "Identifique a ilha paradisíaca",
        "options": [
          "Marajó",
          "Ilhabela",
          "Ilha do Mel",
          "Fernando de Noronha"
        ],
        "answer": 3,
        "explanation": "Fernando de Noronha é um dos destinos mais exclusivos e preservados do país."
      },
      {
        "prompt": "Como dizer \"Gostaria de fechar um pacote turístico para o feriado\"?",
        "speech": "Pacote turístico",
        "emoji": "🌴",
        "instruction": "Identifique a contratação de viagem",
        "options": [
          "Pacote turístico (inclui voo, hotel e passeios)",
          "Caixa de viagem",
          "Mala de turismo",
          "Contrato de férias"
        ],
        "answer": 0,
        "explanation": "Pacote turístico reúne passagens, hospedagem e passeios em um valor único."
      }
    ]
  },
  {
    "id": "pt-13",
    "language": "pt",
    "level": "B1 · Intermediário",
    "emoji": "🩺",
    "title": "No Posto de Saúde, Remédios & Farmácia",
    "description": "Explique dores, peça remédios e tire dúvidas médicas.",
    "xp": 30,
    "questions": [
      {
        "prompt": "Como dizer \"Estou com febre e enjoo\"?",
        "speech": "Estou com febre e enjoo",
        "emoji": "🤒",
        "instruction": "Escolha a frase médica",
        "options": [
          "Tenho calor na barriga",
          "Meu estômago quebrou",
          "Estou com febre e enjoo",
          "Sinto dor de braço"
        ],
        "answer": 2,
        "explanation": "\"Enjoo\" é a sensação de náusea."
      },
      {
        "prompt": "O que é o \"SUS\" no Brasil?",
        "speech": "SUS",
        "emoji": "🏥",
        "instruction": "Identifique o sistema público",
        "options": [
          "Associação de médicos cirurgiões",
          "Plano de saúde privado caro",
          "Sistema Único de Saúde (atendimento médico público e gratuito garantido por lei)",
          "Farmácia de manipulação"
        ],
        "answer": 2,
        "explanation": "O SUS é o sistema público de saúde do Brasil."
      },
      {
        "prompt": "O que significa \"Remédio genérico\"?",
        "speech": "Remédio genérico",
        "emoji": "💊",
        "instruction": "Identifique o tipo de medicamento",
        "options": [
          "Cosmético hidratante",
          "Remédio falsificado ilegal",
          "Remédio natural de ervas",
          "Medicamento com o mesmo princípio ativo da marca de referência, com tarja amarela e preço menor"
        ],
        "answer": 3,
        "explanation": "Genéricos têm a mesma eficácia comprovada por lei e preço reduzido."
      },
      {
        "prompt": "O que é uma \"Receita médica\"?",
        "speech": "Receita médica",
        "emoji": "📄",
        "instruction": "Identifique o documento profissional",
        "options": [
          "Fatura do hospital",
          "Prescrição assinada pelo médico para compra de medicamentos controlados",
          "Manual de primeiros socorros",
          "Atestado de vacinação"
        ],
        "answer": 1,
        "explanation": "A receita médica autoriza a dispensa do medicamento."
      },
      {
        "prompt": "Como expressar que você torceu o pé?",
        "speech": "Torci o tornozelo",
        "emoji": "🦶",
        "instruction": "Identifique a lesão ortopédica",
        "options": [
          "Quebrei o sapato",
          "Torci o tornozelo",
          "Ralei a unha",
          "Cortei o joelho"
        ],
        "answer": 1,
        "explanation": "Torcer o tornozelo é a entorse no pé."
      },
      {
        "prompt": "O que é um \"Pronto-Socorro\" (PS) ou \"UPA\"?",
        "speech": "Pronto-Socorro / UPA",
        "emoji": "🚨",
        "instruction": "Identifique a unidade de emergência",
        "options": [
          "Unidade médica de urgência e emergência aberta 24 horas",
          "Laboratório de exames agendados",
          "Clínica de estética",
          "Consultório de terapia"
        ],
        "answer": 0,
        "explanation": "UPA e Pronto-Socorro atendem casos graves e imediatos."
      },
      {
        "prompt": "Como se chama o papel que o médico emite para justificar a falta ao trabalho por doença?",
        "speech": "Atestado médico",
        "emoji": "📋",
        "instruction": "Identifique o documento de abono",
        "options": [
          "Atestado médico",
          "Receita médica",
          "Prontuário",
          "Laudo de alta"
        ],
        "answer": 0,
        "explanation": "O atestado médico abona as faltas no trabalho decorrentes de enfermidade."
      },
      {
        "prompt": "O que é \"Dor de garganta\"?",
        "speech": "Dor de garganta",
        "emoji": "🧣",
        "instruction": "Identifique o sintoma comum de resfriado",
        "options": [
          "Dor de estômago",
          "Inflamação ou incômodo ao engolir na região da laringe/faringe",
          "Dor nos ouvidos",
          "Dor nas costas"
        ],
        "answer": 1,
        "explanation": "Dor de garganta acompanha resfriados e gripes."
      },
      {
        "prompt": "O que é um \"Curativo\" com micropore ou gaze?",
        "speech": "Curativo",
        "emoji": "🩹",
        "instruction": "Identifique o cuidado de enfermagem",
        "options": [
          "Um gesso no braço",
          "Uma injeção na veia",
          "Uma cirurgia plástica",
          "Proteção estéril aplicada sobre ferimentos e cortes"
        ],
        "answer": 3,
        "explanation": "Curativo protege feridas contra infecções."
      },
      {
        "prompt": "Como dizer \"Tome este remédio de oito em oito horas\"?",
        "speech": "De 8 em 8 horas",
        "emoji": "⏰",
        "instruction": "Identifique a posologia",
        "options": [
          "Tomar a cada intervalo regular de 8 horas",
          "Tomar oito pílulas de uma vez",
          "Tomar só às 8 da manhã",
          "Tomar durante 8 dias seguidos"
        ],
        "answer": 0,
        "explanation": "Indica o intervalo de dosagem do medicamento ao longo do dia."
      }
    ]
  },
  {
    "id": "pt-14",
    "language": "pt",
    "level": "B1 · Intermediário",
    "emoji": "💼",
    "title": "Mercado de Trabalho & Entrevistas",
    "description": "Fale de sua experiência profissional e currículo.",
    "xp": 35,
    "questions": [
      {
        "prompt": "O documento que reúne sua formação e histórico profissional é o:",
        "speech": "Currículo",
        "emoji": "📄",
        "instruction": "Identifique o documento",
        "options": [
          "Recibo de pagamento",
          "Contrato social",
          "Crachá",
          "Currículo (CV)"
        ],
        "answer": 3,
        "explanation": "O currículo resume a carreira do candidato."
      },
      {
        "prompt": "O que é a \"Carteira de Trabalho\" (CTPS) no Brasil?",
        "speech": "Carteira de Trabalho",
        "emoji": "📘",
        "instruction": "Identifique o documento oficial",
        "options": [
          "Cartão de crédito da empresa",
          "Documento que registra formalmente o contrato de trabalho e direitos trabalhistas (CLT)",
          "Crachá de entrada",
          "Título de eleitor"
        ],
        "answer": 1,
        "explanation": "A Carteira de Trabalho oficializa os direitos sob regime CLT."
      },
      {
        "prompt": "O que significa trabalhar sob regime \"CLT\"?",
        "speech": "CLT",
        "emoji": "⚖️",
        "instruction": "Identifique a legislação laboral",
        "options": [
          "Trabalho voluntário",
          "Trabalho temporário informal sem garantias",
          "Empresa individual terceirizada",
          "Consolidação das Leis do Trabalho (com direitos a férias, 13º salário e FGTS)"
        ],
        "answer": 3,
        "explanation": "A CLT regulamenta os direitos do trabalhador formal."
      },
      {
        "prompt": "O que é o \"13º salário\" (décimo terceiro)?",
        "speech": "13º salário",
        "emoji": "💰",
        "instruction": "Identifique a gratificação de fim de ano",
        "options": [
          "Um imposto cobrado em dobro",
          "Gratificação natalina equivalente a um mês extra de salário paga no fim do ano",
          "Uma dedução no salário",
          "Um adiantamento para férias"
        ],
        "answer": 1,
        "explanation": "O décimo terceiro é garantido por lei a empregados com carteira assinada."
      },
      {
        "prompt": "O que o recrutador quer saber com: \"Quais são seus pontos fortes e fracos?\"",
        "speech": "Pontos fortes e fracos",
        "emoji": "🎯",
        "instruction": "Interprete a pergunta clássica",
        "options": [
          "Suas dívidas bancárias",
          "Seus defeitos familiares",
          "Quantos quilos você levanta",
          "Suas principais competências técnicas/comportamentais e áreas de melhoria"
        ],
        "answer": 3,
        "explanation": "Avalia o autoconhecimento e a adequação do profissional ao cargo."
      },
      {
        "prompt": "O que significa \"Trabalho remoto\" ou \"Home office\"?",
        "speech": "Home office",
        "emoji": "💻",
        "instruction": "Identifique a modalidade moderna",
        "options": [
          "Trabalho na rua com vendas",
          "Morar dentro da sede da empresa",
          "Trabalhar a distância a partir de casa utilizando computador e internet",
          "Trabalho braçal externo"
        ],
        "answer": 2,
        "explanation": "Home office permite trabalhar de casa."
      },
      {
        "prompt": "O que é o \"FGTS\" (Fundo de Garantia do Tempo de Serviço)?",
        "speech": "FGTS",
        "emoji": "🏦",
        "instruction": "Identifique o fundo de proteção",
        "options": [
          "Seguro de saúde",
          "Imposto sindical obrigatório",
          "Depósito mensal de 8% feito pela empresa em conta da Caixa que o trabalhador saca na demissão sem justa causa",
          "Plano de aposentadoria privada"
        ],
        "answer": 2,
        "explanation": "O FGTS protege o trabalhador demitido sem justa causa."
      },
      {
        "prompt": "O que significa \"Pedir demissão\"?",
        "speech": "Pedir demissão",
        "emoji": "🚪",
        "instruction": "Identifique a iniciativa do desligamento",
        "options": [
          "A empresa demite por corte de custos",
          "O próprio funcionário decide se desligar espontaneamente da empresa",
          "A empresa fecha as portas",
          "O funcionário ganha uma promoção"
        ],
        "answer": 1,
        "explanation": "Pedir demissão é iniciativa do próprio empregado."
      },
      {
        "prompt": "Como se chama o período de descanso remunerado após um ano de trabalho?",
        "speech": "Férias",
        "emoji": "🏖️",
        "instruction": "Identifique o direito de descanso",
        "options": [
          "Férias regulamentares (de 30 dias)",
          "Licença paternidade",
          "Descanso semanal remunerado",
          "Atestado de folga"
        ],
        "answer": 0,
        "explanation": "O trabalhador tem direito a 30 dias de férias após 12 meses de trabalho."
      },
      {
        "prompt": "O que significa \"Fazer networking\"?",
        "speech": "Networking",
        "emoji": "🤝",
        "instruction": "Identifique a prática profissional",
        "options": [
          "Fazer fofoca de escritório",
          "Trabalhar com cabos de rede de computadores",
          "Construir e cultivar uma rede de contatos profissionais e colaborativos",
          "Procurar vagas em jornais antigos"
        ],
        "answer": 2,
        "explanation": "Networking é a rede de relacionamentos no mercado."
      }
    ]
  },
  {
    "id": "pt-15",
    "language": "pt",
    "level": "B1 · Intermediário",
    "emoji": "👔",
    "title": "Pronomes de Tratamento & Formalidade",
    "description": "Você vs O Senhor / A Senhora no dia a dia.",
    "xp": 30,
    "questions": [
      {
        "prompt": "Para falar com respeito com uma pessoa idosa no Brasil, usamos:",
        "speech": "O senhor ou a senhora",
        "emoji": "👵",
        "instruction": "Escolha o pronome cordial",
        "options": [
          "Você cara",
          "O senhor / A senhora",
          "Tu mano",
          "O cidadão"
        ],
        "answer": 1,
        "explanation": "\"O senhor / A senhora\" demonstra cortesia e respeito."
      },
      {
        "prompt": "Qual pronome de 2ª pessoa é amplamente utilizado no dia a dia em quase todo o Brasil?",
        "speech": "Você",
        "emoji": "👥",
        "instruction": "Identifique o pronome comum",
        "options": [
          "Vós",
          "Você (conjugado na 3ª pessoa do singular)",
          "Vossa Mercê",
          "Vossa Excelência"
        ],
        "answer": 1,
        "explanation": "\"Você\" é o pronome padrão de tratamento informal e cotidiano."
      },
      {
        "prompt": "Em regiões do Sul e Nordeste do Brasil, qual pronome também é muito frequente?",
        "speech": "Tu",
        "emoji": "🧉",
        "instruction": "Identifique a variante regional",
        "options": [
          "Tu (frequentemente conjugado no presente informal)",
          "Vós",
          "Sua Senhoria",
          "Vossa Graça"
        ],
        "answer": 0,
        "explanation": "\"Tu\" é muito vivo no Rio Grande do Sul, Santa Catarina, Maranhão e Pará."
      },
      {
        "prompt": "Qual pronome de tratamento formal é reservado a autoridades como juízes e ministros?",
        "speech": "Vossa Excelência",
        "emoji": "⚖️",
        "instruction": "Identifique a fórmula oficial",
        "options": [
          "Você Excelentíssimo",
          "Vossa Senhoria",
          "Vossa Excelência",
          "O Senhor Doutor"
        ],
        "answer": 2,
        "explanation": "Vossa Excelência é o tratamento solene para altas autoridades."
      },
      {
        "prompt": "Qual a forma abreviada escrita de \"Senhor\" e \"Senhora\"?",
        "speech": "Sr. e Sra.",
        "emoji": "✍️",
        "instruction": "Identifique as abreviações oficiais",
        "options": [
          "Srº e Srª apenas",
          "Snr. e Snra.",
          "Sh. e Sha.",
          "Sr. e Sra."
        ],
        "answer": 3,
        "explanation": "Sr. e Sra. são as abreviaturas consagradas."
      },
      {
        "prompt": "Como se trata informalmente um amigo próximo em tom carinhoso no Brasil?",
        "speech": "Você / Amigo / Cara / Mano",
        "emoji": "🤝",
        "instruction": "Identifique o vocativo coloquial",
        "options": [
          "Vossa Senhoria",
          "Cara, mano, amigo, você",
          "O Nobre Cidadão",
          "Vossa Mercê"
        ],
        "answer": 1,
        "explanation": "Expressões coloquiais usadas entre amigos."
      },
      {
        "prompt": "Como um atendente educado em loja costuma se dirigir ao cliente?",
        "speech": "Pois não, senhor(a), em que posso ajudar?",
        "emoji": "🏬",
        "instruction": "Selecione a abordagem polida",
        "options": [
          "O que manda o camarada?",
          "Ei você, quer o quê?",
          "Pois não, senhor(a), como posso ajudar?",
          "Diga logo o pedido!"
        ],
        "answer": 2,
        "explanation": "Fórmula clássica de atendimento cordial no comércio."
      },
      {
        "prompt": "Qual pronome de tratamento é historicamente utilizado para reitores de universidades?",
        "speech": "Vossa Magnificência",
        "emoji": "🎓",
        "instruction": "Identifique o tratamento acadêmico",
        "options": [
          "Vossa Santidade",
          "Vossa Reverendíssima",
          "Vossa Alteza",
          "Vossa Magnificência"
        ],
        "answer": 3,
        "explanation": "Reitores recebem o tratamento solene de Vossa Magnificência."
      },
      {
        "prompt": "O que expressa o uso de \"Doutor\" para advogados ou médicos no Brasil?",
        "speech": "Doutor",
        "emoji": "🩺",
        "instruction": "Identifique o costume cultural",
        "options": [
          "Uma exigência do código penal",
          "Apenas quem tem tese de doutorado concluída",
          "Tratamento tradicional de deferência social consagrado pelo uso",
          "Uma ofensa irônica"
        ],
        "answer": 2,
        "explanation": "No Brasil é costume tradicional chamar médicos e advogados de \"doutor\"."
      },
      {
        "prompt": "Em cartas formais e comerciais, como se inicia o cabeçalho?",
        "speech": "Prezado(a) Senhor(a)",
        "emoji": "✉️",
        "instruction": "Identifique o vocativo epistolar",
        "options": [
          "Prezado(a) Senhor(a)",
          "Oi galera",
          "Querido amigo",
          "Atenção todos"
        ],
        "answer": 0,
        "explanation": "\"Prezado(a)\" é o início formal adequado para correspondências."
      }
    ]
  },
  {
    "id": "pt-16",
    "language": "pt",
    "level": "B1 · Intermediário",
    "emoji": "🌧️",
    "title": "O Modo Subjuntivo no Cotidiano",
    "description": "Tomara que dê tudo certo e se eu pudesse.",
    "xp": 35,
    "questions": [
      {
        "prompt": "Complete: \"Tomara que amanhã não ___.\"",
        "speech": "Tomara que amanhã não chova",
        "emoji": "☔",
        "instruction": "Conjugue no presente do subjuntivo",
        "options": [
          "chove",
          "chova",
          "choverá",
          "chovesse"
        ],
        "answer": 1,
        "explanation": "\"Tomara que\" exige o presente do subjuntivo: chova."
      },
      {
        "prompt": "Complete o desejo: \"Espero que você ___ muito feliz.\"",
        "speech": "Espero que você seja feliz",
        "emoji": "🌟",
        "instruction": "Conjugue o verbo ser no subjuntivo",
        "options": [
          "será",
          "é",
          "seja",
          "fosse"
        ],
        "answer": 2,
        "explanation": "Esperar que exige o presente do subjuntivo: seja."
      },
      {
        "prompt": "Complete a 2ª condicional: \"Se eu ___ dinheiro, viajaria agora.\"",
        "speech": "Se eu tivesse dinheiro",
        "emoji": "💰",
        "instruction": "Conjugue ter no pretérito imperfeito do subjuntivo",
        "options": [
          "tiver",
          "tenho",
          "teria",
          "tivesse"
        ],
        "answer": 3,
        "explanation": "A condição com se e hipótese usa o pretérito imperfeito do subjuntivo: tivesse."
      },
      {
        "prompt": "Complete a hipótese no futuro: \"Quando você ___ em casa, me ligue.\"",
        "speech": "Quando você chegar em casa",
        "emoji": "🏠",
        "instruction": "Conjugue no futuro do subjuntivo",
        "options": [
          "chegasse",
          "chega",
          "chegar",
          "chegou"
        ],
        "answer": 2,
        "explanation": "\"Quando\" projetado no futuro exige o futuro do subjuntivo: chegar."
      },
      {
        "prompt": "Complete a dúvida: \"Não acho que ele ___ a verdade.\"",
        "speech": "Não acho que ele fale a verdade",
        "emoji": "🤫",
        "instruction": "Conjugue falar",
        "options": [
          "fala",
          "fale",
          "falou",
          "falará"
        ],
        "answer": 1,
        "explanation": "Expressões de incerteza negativa exigem subjuntivo: fale."
      },
      {
        "prompt": "Complete com concessão: \"Embora ___ frio, fomos à praia.\"",
        "speech": "Embora fizesse frio",
        "emoji": "🥶",
        "instruction": "Conjugue fazer no subjuntivo",
        "options": [
          "fizesse",
          "fazia",
          "fez",
          "fará"
        ],
        "answer": 0,
        "explanation": "\"Embora\" exige modo subjuntivo."
      },
      {
        "prompt": "Complete com ordem polida: \"É importante que nós ___ a lição.\"",
        "speech": "É importante que nós façamos a lição",
        "emoji": "📚",
        "instruction": "Conjugue fazer na 1ª pessoa do plural",
        "options": [
          "faríamos",
          "fazemos",
          "fizeram",
          "façamos"
        ],
        "answer": 3,
        "explanation": "Estruturas impessoais exigem presente do subjuntivo: façamos."
      },
      {
        "prompt": "Complete: \"Se você ___ comigo, não se perderia.\"",
        "speech": "Se você viesse comigo",
        "emoji": "🚶",
        "instruction": "Conjugue vir no imperfeito do subjuntivo",
        "options": [
          "veio",
          "vinha",
          "viesse",
          "virá"
        ],
        "answer": 2,
        "explanation": "Hipótese irreal: se viesse."
      },
      {
        "prompt": "Qual é o futuro do subjuntivo de \"fazer\" para \"quando eu\"?",
        "speech": "Quando eu fizer",
        "emoji": "✍️",
        "instruction": "Conjugue fazer no futuro do subjuntivo",
        "options": [
          "fizesse",
          "fazer",
          "fizer",
          "faço"
        ],
        "answer": 2,
        "explanation": "O futuro do subjuntivo de fazer é: quando eu fizer, quando você fizer."
      },
      {
        "prompt": "O que a oração expressa: \"Tomara que passe logo!\"?",
        "speech": "Tomara que",
        "emoji": "🤞",
        "instruction": "Identifique o sentimento",
        "options": [
          "Um lamento do passado",
          "Uma certeza matemática",
          "Uma ordem militar",
          "Um voto fervoroso de esperança e desejo positivo"
        ],
        "answer": 3,
        "explanation": "\"Tomara que\" expressa desejo vivo de esperança."
      }
    ]
  },
  {
    "id": "pt-17",
    "language": "pt",
    "level": "B2 · Avançado",
    "emoji": "🔮",
    "title": "Futuro do Presente & Condicional",
    "description": "Viajarei no próximo ano e eu gostaria de saber.",
    "xp": 40,
    "questions": [
      {
        "prompt": "Como expressar um pedido com máxima elegância polida?",
        "speech": "Eu gostaria de fazer uma pergunta",
        "emoji": "🙏",
        "instruction": "Selecione o futuro do pretérito condicional",
        "options": [
          "Eu gostaria de fazer uma pergunta",
          "Eu quero perguntar logo",
          "Diga-me agora",
          "Vou te perguntar"
        ],
        "answer": 0,
        "explanation": "\"Eu gostaria de...\" suaviza pedidos com extrema polidez."
      },
      {
        "prompt": "Qual é a forma regular de futuro do presente de \"viajar\" para \"eu\"?",
        "speech": "Viajarei",
        "emoji": "🧳",
        "instruction": "Conjugue no futuro do presente",
        "options": [
          "Viajei",
          "Viajava",
          "Viajarei",
          "Viajasse"
        ],
        "answer": 2,
        "explanation": "A desinência de 1ª pessoa no futuro é \"-ei\": viajarei."
      },
      {
        "prompt": "No português falado informal do Brasil, qual perífrase substitui o futuro simples?",
        "speech": "Vou viajar",
        "emoji": "🗣️",
        "instruction": "Identifique a estrutura coloquial brasileira",
        "options": [
          "Terei viajado",
          "Haver de viajar",
          "Deverei viajar",
          "Ir + infinitivo (\"Vou viajar amanhã\")"
        ],
        "answer": 3,
        "explanation": "No dia a dia brasileiro, \"vou fazer\" substitui quase sempre \"farei\"."
      },
      {
        "prompt": "Complete a hipótese de consequência: \"Se tivesse tempo, eu ___ violão.\"",
        "speech": "Eu aprenderia violão",
        "emoji": "🎸",
        "instruction": "Conjugue aprender no condicional",
        "options": [
          "aprendia",
          "aprenderei",
          "aprenderia",
          "aprenda"
        ],
        "answer": 2,
        "explanation": "A consequência de uma condição em -sse é o futuro do pretérito (-ia): aprenderia."
      },
      {
        "prompt": "O que é a \"Mesóclise\" na norma culta padrão?",
        "speech": "Realizar-se-á o evento",
        "emoji": "📖",
        "instruction": "Identifique o fenômeno gramatical",
        "options": [
          "Colocação no fim da frase",
          "Interpolação do pronome oblíquo no meio do verbo no futuro (ex: far-se-á)",
          "Omissão de preposições",
          "Uso de gírias modernas"
        ],
        "answer": 1,
        "explanation": "A mesóclise ocorre com futuros na ausência de palavras atrativas na norma culta."
      },
      {
        "prompt": "Complete a dúvida no passado com futuro do pretérito: \"Quem ___ aquela pessoa misteriosa?\"",
        "speech": "Quem seria aquela pessoa?",
        "emoji": "🕵️",
        "instruction": "Expresse probabilidade ou suposição",
        "options": [
          "será",
          "era",
          "foi",
          "seria"
        ],
        "answer": 3,
        "explanation": "O futuro do pretérito expressa suposição em relação ao passado: quem seria?"
      },
      {
        "prompt": "Como se diz \"Nós viajaremos amanhã de manhã\"?",
        "speech": "Nós viajaremos",
        "emoji": "🚗",
        "instruction": "Conjugue nós no futuro simples",
        "options": [
          "Viajávamos",
          "Viajaremos",
          "Viajáramos",
          "Viajamos ontem"
        ],
        "answer": 1,
        "explanation": "Desinência de 1ª pessoa do plural: -emos: viajaremos."
      },
      {
        "prompt": "Complete: \"Se você me ajudasse, nós ___ mais rápido.\"",
        "speech": "Nós terminaríamos mais rápido",
        "emoji": "⏱️",
        "instruction": "Conjugue terminar no condicional",
        "options": [
          "terminarão",
          "terminaremos",
          "terminamos",
          "terminaríamos"
        ],
        "answer": 3,
        "explanation": "Condicional de nós leva acento na antepenúltima: terminaríamos."
      },
      {
        "prompt": "O que expressa a frase: \"Seriam cerca de dez horas quando o sino tocou\"?",
        "speech": "Seriam cerca de dez horas",
        "emoji": "🔔",
        "instruction": "Identifique a nuance temporal",
        "options": [
          "Hora marcada para o futuro",
          "Certeza pontual exata",
          "Aproximação ou suposição temporal no passado",
          "Promessa formal"
        ],
        "answer": 2,
        "explanation": "Expressa horário aproximado no passado."
      },
      {
        "prompt": "Como formular uma sugestão muito cordial: \"Não ___ melhor sairmos mais cedo?\"",
        "speech": "Não seria melhor?",
        "emoji": "💡",
        "instruction": "Escolha o verbo condicional",
        "options": [
          "foi",
          "será",
          "seria",
          "é"
        ],
        "answer": 2,
        "explanation": "\"Não seria melhor...?\" convida à reflexão de maneira cortês."
      }
    ]
  },
  {
    "id": "pt-18",
    "language": "pt",
    "level": "B2 · Avançado",
    "emoji": "🤙",
    "title": "Gírias Populares do Brasil",
    "description": "Dar um pulo, ficar de boa, vacilar e mandar bem.",
    "xp": 40,
    "questions": [
      {
        "prompt": "O que significa a expressão \"mandar bem\"?",
        "speech": "Mandar bem",
        "emoji": "👏",
        "instruction": "Identifique o significado coloquial",
        "options": [
          "Dar ordens com grosseria",
          "Enviar uma encomenda pelos correios",
          "Fazer algo com excelência / ter grande sucesso em uma tarefa",
          "Reclamar de uma situação"
        ],
        "answer": 2,
        "explanation": "\"Mandar bem\" significa ter um excelente desempenho."
      },
      {
        "prompt": "O que significa a expressão \"dar um pulo\" em algum lugar?",
        "speech": "Dar um pulo",
        "emoji": "👟",
        "instruction": "Identifique a ação",
        "options": [
          "Comprar sapatos novos",
          "Pular corda na academia",
          "Saltar de paraquedas",
          "Ir rapidamente até um local e retornar logo"
        ],
        "answer": 3,
        "explanation": "\"Dar um pulo\" significa fazer uma visita rápida."
      },
      {
        "prompt": "O que significa \"ficar de boa\"?",
        "speech": "Ficar de boa",
        "emoji": "🧘",
        "instruction": "Identifique o estado de espírito",
        "options": [
          "Estar doente na cama",
          "Ficar com raiva silenciosa",
          "Ficar tranquilo, relaxado e em paz sem preocupações",
          "Fazer uma viagem longa"
        ],
        "answer": 2,
        "explanation": "\"Ficar de boa\" significa ficar calmo e em tranquilidade."
      },
      {
        "prompt": "O que significa a gíria \"vacilar\" ou \"dar mole\"?",
        "speech": "Vacilar",
        "emoji": "🤦",
        "instruction": "Identifique o erro coloquial",
        "options": [
          "Dançar no palco",
          "Cometer um erro por distração / bobeira ou mancada",
          "Vencer um campeonato",
          "Dormir cedo demais"
        ],
        "answer": 1,
        "explanation": "\"Vacilar\" é cometer um deslize ou pisar na bola."
      },
      {
        "prompt": "O que significa a expressão \"pagar mico\"?",
        "speech": "Pagar mico",
        "emoji": "🙈",
        "instruction": "Identifique o constrangimento",
        "options": [
          "Pagar a conta do restaurante com desconto",
          "Comprar um animal exótico",
          "Passar por uma situação pública embaraçosa e vergonhosa",
          "Ganhar um sorteio"
        ],
        "answer": 2,
        "explanation": "\"Pagar mico\" significa passar vergonha."
      },
      {
        "prompt": "O que significa a gíria carioca \"Maneiro\" ou a paulistana \"Da hora\"?",
        "speech": "Maneiro / Da hora",
        "emoji": "✨",
        "instruction": "Identifique o elogio popular",
        "options": [
          "Lugar perigoso",
          "Comida estragada",
          "Muito legal / bacana / excelente",
          "Pessoa antipática"
        ],
        "answer": 2,
        "explanation": "\"Maneiro\" e \"Da hora\" são gírias consagradas para algo muito legal."
      },
      {
        "prompt": "O que significa a expressão \"chutar o balde\"?",
        "speech": "Chutar o balde",
        "emoji": "🪣",
        "instruction": "Identifique a atitude impulsiva",
        "options": [
          "Jogar futebol na chuva",
          "Perder a paciência e desistir de se conter / desistir do esforço",
          "Comprar baldes de limpeza",
          "Fazer faxina em casa"
        ],
        "answer": 1,
        "explanation": "\"Chutar o balde\" significa abandonar as restrições por impaciência."
      },
      {
        "prompt": "O que significa a gíria \"Tirar de letra\"?",
        "speech": "Tirar de letra",
        "emoji": "🎯",
        "instruction": "Identifique a facilidade",
        "options": [
          "Cometer um erro grave",
          "Escrever uma carta à mão",
          "Superar uma dificuldade com grande facilidade e maestria",
          "Ler um livro longo"
        ],
        "answer": 2,
        "explanation": "\"Tirar de letra\" significa resolver com facilidade."
      },
      {
        "prompt": "O que significa \"Segurar vela\" em um encontro social?",
        "speech": "Segurar vela",
        "emoji": "🕯️",
        "instruction": "Identifique a situação embaraçosa",
        "options": [
          "Trabalhar em vigília noturna",
          "Faltar luz em casa",
          "Ficar acompanhando um casal de namorados como o único solteiro da mesa",
          "Acender incenso perfumado"
        ],
        "answer": 2,
        "explanation": "\"Segurar vela\" é ser o terceiro elemento sobrando com um casal."
      },
      {
        "prompt": "O que significa \"Fazer uma vaquinha\"?",
        "speech": "Fazer uma vaquinha",
        "emoji": "🐄",
        "instruction": "Identifique a cooperação financeira",
        "options": [
          "Alugar um sítio para churrasco",
          "Comprar gado na fazenda",
          "Juntar dinheiro coletivamente entre várias pessoas para pagar algo comum",
          "Cozinhar carne de panela"
        ],
        "answer": 2,
        "explanation": "\"Fazer uma vaquinha\" é a clássica arrecadação de dinheiro entre amigos."
      }
    ]
  },
  {
    "id": "pt-19",
    "language": "pt",
    "level": "B2 · Avançado",
    "emoji": "🇵🇹",
    "title": "Português do Brasil vs de Portugal",
    "description": "Ônibus vs autocarro, celular vs telemóvel.",
    "xp": 40,
    "questions": [
      {
        "prompt": "Em Portugal, o aparelho \"celular\" é chamado de:",
        "speech": "Telemóvel",
        "emoji": "📱",
        "instruction": "Identifique o termo europeu",
        "options": [
          "Telemóvel",
          "Telefone de bolso",
          "Autocarro",
          "Ficha telefônica"
        ],
        "answer": 0,
        "explanation": "Em Portugal diz-se \"telemóvel\"."
      },
      {
        "prompt": "Em Portugal, como se chama o \"ônibus\" urbano?",
        "speech": "Autocarro",
        "emoji": "🚌",
        "instruction": "Identifique o transporte europeu",
        "options": [
          "Bonde",
          "Comboio",
          "Autocarro",
          "Carrinha"
        ],
        "answer": 2,
        "explanation": "\"Autocarro\" é o ônibus de passageiros em Portugal."
      },
      {
        "prompt": "Em Portugal, o meio de transporte que no Brasil chamamos de \"trem\" é conhecido como:",
        "speech": "Comboio",
        "emoji": "🚆",
        "instruction": "Identifique o transporte ferroviário",
        "options": [
          "Comboio",
          "Autocarro",
          "Metropolitano",
          "Vagonete"
        ],
        "answer": 0,
        "explanation": "\"Comboio\" é o trem em Portugal."
      },
      {
        "prompt": "Como os portugueses costumam chamar uma criança ou garoto pequeno?",
        "speech": "Miúdo / Miúda",
        "emoji": "🧒",
        "instruction": "Identifique o termo carinhoso infantil",
        "options": [
          "Menininho apenas",
          "Pivete",
          "Moleque",
          "Miúdo / Miúda"
        ],
        "answer": 3,
        "explanation": "\"Miúdo\" é a criança em Portugal."
      },
      {
        "prompt": "Em Portugal, como se chama a carne de \"frango\" na culinária popular?",
        "speech": "Frango / Frango assado",
        "emoji": "🍗",
        "instruction": "Identifique o alimento",
        "options": [
          "Galináceo",
          "Frango (e peru para ave maior)",
          "Galo novo",
          "Ave de forno"
        ],
        "answer": 1,
        "explanation": "O termo frango é comum em ambos os lados do Atlântico."
      },
      {
        "prompt": "No Brasil dizemos \"pedestre\". Em Portugal costuma-se usar:",
        "speech": "Peão / Peões",
        "emoji": "🚶",
        "instruction": "Identifique o termo de trânsito em Portugal",
        "options": [
          "Caminhante",
          "Peão (passadeira para peões)",
          "Andarilho",
          "Corredor"
        ],
        "answer": 1,
        "explanation": "A faixa de pedestres em Portugal é a \"passadeira de peões\"."
      },
      {
        "prompt": "Em Portugal, como se chama o \"sorvete\" gelado?",
        "speech": "Gelado",
        "emoji": "🍨",
        "instruction": "Identifique a sobremesa gelada",
        "options": [
          "Gelo saboroso",
          "Sorvete doce",
          "Gelado",
          "Creme frio"
        ],
        "answer": 2,
        "explanation": "Em Portugal pede-se \"um gelado\"."
      },
      {
        "prompt": "O que significa a palavra \"Giro / Gira\" no vocabulário português?",
        "speech": "Que giro!",
        "emoji": "✨",
        "instruction": "Identifique a gíria europeia",
        "options": [
          "Bonito, simpático ou engraçado / legal",
          "Tonto que fica rodando",
          "Muito caro",
          "Chato e irritante"
        ],
        "answer": 0,
        "explanation": "\"Giro\" em Portugal significa bonito ou muito legal."
      },
      {
        "prompt": "Em Portugal, o café expresso servido na xícara pequena é popularmente chamado de:",
        "speech": "Bica",
        "emoji": "☕",
        "instruction": "Identifique a bebida tradicional em Lisboa",
        "options": [
          "Carioca longo",
          "Pingado",
          "Bica (em Lisboa) ou Cimbalino (no Porto)",
          "Expresso puro apenas"
        ],
        "answer": 2,
        "explanation": "Em Lisboa pede-se \"uma bica\"."
      },
      {
        "prompt": "Qual a principal diferença na colocação pronominal em início de frase entre Brasil e Portugal?",
        "speech": "Me dá vs Dá-me",
        "emoji": "💬",
        "instruction": "Identifique a norma culta europeia",
        "options": [
          "Em Portugal não se usam pronomes oblíquos",
          "Não há nenhuma diferença",
          "No Brasil próclise é proibida em qualquer contexto",
          "Em Portugal evita-se iniciar frase com pronome oblíquo (\"Dá-me isto\"); no Brasil informal inicia-se com próclise (\"Me dá isso\")"
        ],
        "answer": 3,
        "explanation": "A próclise inicial é traço característico do português coloquial brasileiro."
      }
    ]
  },
  {
    "id": "pt-20",
    "language": "pt",
    "level": "B2 · Avançado",
    "emoji": "🎭",
    "title": "Expressões Idiomáticas Clássicas",
    "description": "Pagar mico, pisar na bola e tirar o cavalinho da chuva.",
    "xp": 40,
    "questions": [
      {
        "prompt": "O que significa a expressão \"Tirar o cavalinho da chuva\"?",
        "speech": "Tirar o cavalinho da chuva",
        "emoji": "🐎",
        "instruction": "Identifique o aviso idiomático",
        "options": [
          "Guardar os animais no estábulo",
          "Desistir de uma pretensão ou expectativa ilusória / não contar com isso",
          "Levar um guarda-chuva para o passeio",
          "Comprar um cavalo de corrida"
        ],
        "answer": 1,
        "explanation": "\"Pode tirar o cavalinho da chuva\" avisa que algo não vai acontecer."
      },
      {
        "prompt": "O que significa a expressão \"Pisar na bola\"?",
        "speech": "Pisar na bola",
        "emoji": "⚽",
        "instruction": "Identifique o deslize",
        "options": [
          "Dominar a bola no campo",
          "Jogar futebol profissional com maestria",
          "Comprar chuteiras novas",
          "Cometer um erro com alguém / falhar com uma obrigação ou amigo"
        ],
        "answer": 3,
        "explanation": "\"Pisar na bola\" significa decepcionar ou cometer uma mancada."
      },
      {
        "prompt": "O que significa \"Trocar seis por meia dúzia\"?",
        "speech": "Seis por meia dúzia",
        "emoji": "⚖️",
        "instruction": "Identifique a equivalência inútil",
        "options": [
          "Fazer uma mudança que não traz nenhuma vantagem real prática",
          "Comprar ovos frescos na feira",
          "Calcular números pares",
          "Resolver um dilema com inteligência"
        ],
        "answer": 0,
        "explanation": "Seis e meia dúzia são iguais, logo a troca é nula."
      },
      {
        "prompt": "O que significa \"Pensar na morte da bezerra\"?",
        "speech": "Morte da bezerra",
        "emoji": "🐄",
        "instruction": "Identifique o devaneio",
        "options": [
          "Estar de luto por um animal da fazenda",
          "Estar pensativo, distraído ou viajando nos próprios pensamentos",
          "Chorar sem motivo aparente",
          "Estar com sono pesado"
        ],
        "answer": 1,
        "explanation": "\"Pensar na morte da bezerra\" é estar no mundo da lua."
      },
      {
        "prompt": "O que significa a expressão \"Chover no molhado\"?",
        "speech": "Chover no molhado",
        "emoji": "🌧️",
        "instruction": "Identifique a redundância",
        "options": [
          "Desperdiçar água limpa",
          "Comemorar uma tempestade de verão",
          "Lavar o chão duas vezes",
          "Fazer ou dizer algo completamente óbvio, inútil e repetitivo"
        ],
        "answer": 3,
        "explanation": "\"Chover no molhado\" é insistir em algo já evidente e redundante."
      },
      {
        "prompt": "O que significa \"Acabar em pizza\"?",
        "speech": "Acabar em pizza",
        "emoji": "🍕",
        "instruction": "Identifique o desfecho político/social",
        "options": [
          "Terminar sem punição para os culpados / terminar em impunidade após escândalo",
          "Comemorar com um jantar italiano",
          "Comprar pizza para a equipe de trabalho",
          "Fazer uma reunião festiva"
        ],
        "answer": 0,
        "explanation": "Expressão clássica de escândalos que terminam sem consequências."
      },
      {
        "prompt": "O que significa \"Procurar chifre em cabeça de cavalo\"?",
        "speech": "Chifre em cabeça de cavalo",
        "emoji": "🦄",
        "instruction": "Identifique a complicação desnecessária",
        "options": [
          "Caçar animais míticos na floresta",
          "Procurar problemas ou defeitos onde eles não existem / complicar o simples",
          "Tratar de animais machucados",
          "Duvidar da biologia"
        ],
        "answer": 1,
        "explanation": "Significa inventar problemas inexistentes."
      },
      {
        "prompt": "O que significa \"Engolir sapo\"?",
        "speech": "Engolir sapo",
        "emoji": "🐸",
        "instruction": "Identifique a tolerância forçada",
        "options": [
          "Comer alimentos exóticos na floresta",
          "Suportar desaforos, humilhações ou contrariedades calado por necessidade",
          "Ter dor de garganta severa",
          "Gaguejar ao falar em público"
        ],
        "answer": 1,
        "explanation": "\"Engolir sapo\" significa aguentar insultos sem poder revidar."
      },
      {
        "prompt": "O que significa a expressão \"Dar com a língua nos dentes\"?",
        "speech": "Língua nos dentes",
        "emoji": "🤐",
        "instruction": "Identifique a quebra de sigilo",
        "options": [
          "Morder a língua ao mastigar o almoço",
          "Falar demais e revelar um segredo que deveria ser guardado",
          "Ficar com dor de dente",
          "Gaguejar de nervosismo"
        ],
        "answer": 1,
        "explanation": "\"Dar com a língua nos dentes\" é delatar ou contar um segredo."
      },
      {
        "prompt": "O que significa a expressão \"Botar a mão no fogo por alguém\"?",
        "speech": "Mão no fogo",
        "emoji": "🔥",
        "instruction": "Identifique a confiança absoluta",
        "options": [
          "Testar a temperatura da água",
          "Brincar com fósforos perigosos",
          "Sofrer uma queimadura na cozinha",
          "Confiar plenamente na honestidade e integridade de outra pessoa"
        ],
        "answer": 3,
        "explanation": "\"Botar a mão no fogo\" expressa confiança cega e irrestrita."
      }
    ]
  }
];

// Achievements Definitions
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

// Mock Leaderboard Competitors
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
// UI Updates & Rendering
// ============================================================================

function updateUI() {
  const { name, xp, streak, completedLessons, dailyXP, dailyGoal } = appState;

  // Header & Sidebar
  const headerXpEl = document.getElementById('headerXP');
  if (headerXpEl) headerXpEl.textContent = `${xp} XP`;

  const streakCountEl = document.getElementById('streakCount');
  if (streakCountEl) streakCountEl.textContent = `${streak} ${streak === 1 ? 'dia' : 'dias'}`;

  const streakStatEl = document.getElementById('streakStat');
  if (streakStatEl) streakStatEl.textContent = `${streak} ${streak === 1 ? 'dia' : 'dias'}`;

  const totalXpEl = document.getElementById('totalXP');
  if (totalXpEl) totalXpEl.textContent = `${xp} XP`;

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
    todayLabel.textContent = `Hoje, ${now.toLocaleDateString('pt-BR', options)}`;
  }

  // Daily Goal Meter
  const goalCurrentEl = document.getElementById('goalCurrent');
  if (goalCurrentEl) goalCurrentEl.textContent = dailyXP;

  const goalTargetEl = document.getElementById('goalTarget');
  if (goalTargetEl) goalTargetEl.textContent = dailyGoal;

  const goalProgressEl = document.getElementById('goalProgress');
  const goalPct = Math.min(100, Math.round((dailyXP / dailyGoal) * 100));
  if (goalProgressEl) goalProgressEl.style.width = `${goalPct}%`;

  const goalMessageEl = document.getElementById('goalMessage');
  if (goalMessageEl) {
    if (dailyXP >= dailyGoal) {
      goalMessageEl.textContent = '🎉 Incrível! Você atingiu sua meta diária de hoje!';
      goalMessageEl.style.color = 'var(--accent-green)';
    } else {
      goalMessageEl.textContent = `Faltam apenas ${dailyGoal - dailyXP} XP para cumprir sua meta.`;
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
    return `
      <div class="language-item" onclick="filterByLangFromHome('${l.code}')">
        <div class="language-flag">${l.flag}</div>
        <div class="language-info">
          <h3>${l.name}</h3>
          <p>${done} de ${l.total} lições concluídas (10 tarefas cada)</p>
          <div class="language-progress">
            <span style="width: ${pct}%;"></span>
          </div>
        </div>
        <div class="language-percent">${pct}%</div>
      </div>
    `;
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
    countEl.textContent = `${filtered.length} ${filtered.length === 1 ? 'lição' : 'lições'}`;
  }

  if (filtered.length === 0) {
    grid.innerHTML = `
      <div style="grid-column: 1/-1; text-align: center; padding: 48px 20px; color: var(--text-muted);">
        <div style="font-size: 3rem; margin-bottom: 10px;">🔍</div>
        <h3>Nenhuma lição encontrada</h3>
        <p>Tente ajustar sua busca ou selecionar outro idioma.</p>
      </div>
    `;
    return;
  }

  grid.innerHTML = filtered.map(lesson => {
    const isDone = appState.completedLessons.includes(lesson.id);
    return `
      <article class="lesson-card ${isDone ? 'completed' : ''}">
        <div>
          <div class="lesson-card-top">
            <div class="lesson-emoji">${lesson.emoji}</div>
            <div class="lesson-card-info">
              <h3>${lesson.title}</h3>
              <p>${lesson.description}</p>
            </div>
          </div>
          <div class="lesson-card-footer">
            <span class="lesson-badge badge level">${lesson.level}</span>
            <span class="lesson-badge badge xp">⚡ +${lesson.xp} XP</span>
            <span>${lesson.questions.length} tarefas</span>
          </div>
        </div>
        <button class="lesson-start-btn ${isDone ? 'done' : ''}" onclick="launchPracticeLesson('${lesson.id}')">
          ${isDone ? '✓ Concluída (Revisar)' : 'Iniciar lição →'}
        </button>
      </article>
    `;
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
    let badgeText = `#${pos}`;
    if (pos === 1) { badgeClass = 'gold'; badgeText = '🥇'; }
    else if (pos === 2) { badgeClass = 'silver'; badgeText = '🥈'; }
    else if (pos === 3) { badgeClass = 'bronze'; badgeText = '🥉'; }

    return `
      <div class="ranking-row ranking-item ${item.isUser ? 'current-user' : ''}">
        <span class="ranking-position ranking-pos ${badgeClass}">${badgeText}</span>
        <div class="ranking-avatar">${item.avatar}</div>
        <div class="ranking-info ranking-name">
          ${item.name} ${item.isUser ? '<strong>(Você)</strong>' : ''}
        </div>
        <span class="ranking-score ranking-xp">⚡ ${item.xp} XP</span>
      </div>
    `;
  }).join('');
}

function renderAchievements() {
  const container = document.getElementById('achievements');
  if (!container) return;

  container.innerHTML = ACHIEVEMENTS_LIST.map(ach => {
    const isUnlocked = appState.achievements.includes(ach.id);
    return `
      <div class="achievement achievement-badge ${isUnlocked ? 'unlocked' : 'locked'}">
        <span class="achievement-icon icon">${ach.icon}</span>
        <div>
          <strong class="title">${ach.title}</strong>
          <p class="desc">${ach.desc}</p>
        </div>
      </div>
    `;
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

  const target = document.getElementById(`page-${pageKey}`);
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
// Interactive Practice Engine (Questions, Speech, Feedback)
// ============================================================================

let currentExercise = {
  lessonId: null,
  language: 'en',
  title: '',
  questions: [],
  currentIndex: 0,
  selectedAnswer: null,
  score: 0,
  xpReward: 20
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
}

function startGeneralPractice() {
  const lang = appState.practiceLanguage || 'en';
  const langLessons = LESSONS.filter(l => l.language === lang);
  let pool = [];
  langLessons.forEach(l => { pool = pool.concat(l.questions); });

  const shuffled = [...pool].sort(() => 0.5 - Math.random()).slice(0, 10);

  currentExercise = {
    lessonId: null,
    language: lang,
    title: `Treino Rápido (${lang === 'en' ? 'Inglês' : lang === 'es' ? 'Espanhol' : 'Português'})`,
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
  const activeView = document.getElementById('exerciseActiveView');
  const completeView = document.getElementById('exerciseCompleteView');
  if (activeView) activeView.classList.remove('hidden');
  if (completeView) completeView.classList.add('hidden');
  const q = currentExercise.questions[currentExercise.currentIndex];
  const total = currentExercise.questions.length;
  currentExercise.selectedAnswer = null;

  // Question Counter
  const counterEl = document.getElementById('questionCounter');
  if (counterEl) counterEl.textContent = `Questão ${currentExercise.currentIndex + 1} de ${total}`;

  // Progress Bar
  const progressFill = document.querySelector('#exerciseProgress');
  if (progressFill) {
    const pct = ((currentExercise.currentIndex) / total) * 100;
    progressFill.style.width = `${pct}%`;
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
    answerList.innerHTML = q.options.map((opt, idx) => `
      <button class="answer-option" onclick="selectAnswerOption(${idx}, this)">
        <span>${String.fromCharCode(65 + idx)}.</span> ${opt}
      </button>
    `).join('');
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
      feedbackEl.textContent = `❌ Ops! A resposta certa era: "${q.options[q.answer]}". ${q.explanation || ''}`;
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

  // Toggle views without wiping DOM
  activeView.classList.add('hidden');
  completeView.classList.remove('hidden');

  const completeTitle = document.getElementById('completeTitle');
  if (completeTitle) {
    completeTitle.textContent = currentExercise.score === total ? 'Perfeito! 🌟' : 'Exercício Concluído! 🏆';
  }

  const completeSubtitle = document.getElementById('completeSubtitle');
  if (completeSubtitle) {
    completeSubtitle.innerHTML = `Você acertou <strong>${currentExercise.score} de ${total}</strong> tarefas nesta lição.`;
  }

  const completeXpBadge = document.getElementById('completeXpBadge');
  if (completeXpBadge) {
    completeXpBadge.textContent = `⚡ +${earnedXp} XP Ganhos`;
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
// Profile & Settings
// ============================================================================

function handleProfileSave(e) {
  e.preventDefault();
  const input = document.getElementById('userName');
  const goalSelect = document.getElementById('dailyGoal');
  const msg = document.getElementById('profileMessage');

  if (input && input.value.trim()) {
    appState.name = input.value.trim();
  }
  if (goalSelect) {
    appState.dailyGoal = parseInt(goalSelect.value, 10) || 15;
  }

  saveState();
  updateUI();

  if (msg) {
    msg.textContent = '✓ Configurações salvas com sucesso!';
    msg.style.color = 'var(--accent-green)';
    setTimeout(() => { msg.textContent = ''; }, 3000);
  }
  showToast('Perfil atualizado!', 'success');
}

function handleResetProgress() {
  const confirmed = window.confirm('Deseja realmente reiniciar todo o progresso do Polyglot? Suas lições e XP serão zerados.');
  if (!confirmed) return;

  appState = {
    name: 'Aprendiz',
    xp: 0,
    streak: 1,
    lastActiveDate: getTodayString(),
    completedLessons: [],
    dailyXP: 0,
    dailyGoal: 15,
    dailyGoalDate: getTodayString(),
    achievements: [],
    theme: appState.theme || 'light',
    currentLanguageFilter: 'all',
    currentSearchQuery: '',
    practiceLanguage: 'en'
  };

  saveState();
  updateUI();
  showToast('Progresso reiniciado com sucesso.', 'info');
}

// ============================================================================
// Theme Toggle & Toast
// ============================================================================

function toggleTheme() {
  const current = appState.theme === 'dark' ? 'light' : 'dark';
  appState.theme = current;
  applyTheme(current);
  saveState();
  playSound('click');
}

function applyTheme(theme) {
  if (theme === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark');
    if (document.body) {
      document.body.classList.add('dark');
      document.body.setAttribute('data-theme', 'dark');
    }
    const toggleBtn = document.getElementById('themeToggle');
    if (toggleBtn) toggleBtn.textContent = '☀️';
  } else {
    document.documentElement.removeAttribute('data-theme');
    if (document.body) {
      document.body.classList.remove('dark');
      document.body.removeAttribute('data-theme');
    }
    const toggleBtn = document.getElementById('themeToggle');
    if (toggleBtn) toggleBtn.textContent = '🌙';
  }
}

let toastTimer = null;
function showToast(message, type = 'info') {
  const toast = document.getElementById('toast');
  if (!toast) return;

  clearTimeout(toastTimer);
  let icon = 'ℹ️';
  if (type === 'success') icon = '✅';
  if (type === 'warning') icon = '⚠️';
  if (type === 'error') icon = '❌';

  toast.innerHTML = `<span>${icon}</span> <span>${message}</span>`;
  toast.className = `toast show ${type}`;
  toast.hidden = false;

  toastTimer = setTimeout(() => {
    toast.classList.remove('show');
    toast.hidden = true;
  }, 3200);
}

// ============================================================================
// Initialization & Event Listeners
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
  });

  // Mobile menu toggle
  const menuToggle = document.getElementById('menuToggle');
  const sidebar = document.getElementById('sidebar');
  if (menuToggle && sidebar) {
    menuToggle.addEventListener('click', () => {
      sidebar.classList.toggle('open');
      playSound('click');
    });
  }

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
      showToast('💡 Dica: Estude 10 minutos por dia para fixar novos idiomas!', 'info');
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
    });
  }

  // Lesson language filter chips
  document.querySelectorAll('#lessonFilters .filter-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      document.querySelectorAll('#lessonFilters .filter-chip').forEach(c => c.classList.remove('selected'));
      chip.classList.add('selected');
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
