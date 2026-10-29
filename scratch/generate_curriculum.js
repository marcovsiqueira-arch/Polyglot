// scratch/generate_curriculum.js
const fs = require('fs');

function q(prompt, speech, emoji, instruction, correctOpt, w1, w2, w3, explanation) {
  const options = [correctOpt, w1, w2, w3];
  // Deterministic shuffle
  const charSum = prompt.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
  const idx = charSum % 4;
  const temp = options[0];
  options[0] = options[idx];
  options[idx] = temp;

  return {
    prompt,
    speech,
    emoji: emoji || '💬',
    instruction: instruction || 'Escolha a opção correta',
    options,
    answer: idx,
    explanation
  };
}

const lessons = [];

// =========================================================================
// INGLÊS (en-1 to en-20)
// =========================================================================
lessons.push({
  id: 'en-1', language: 'en', level: 'A1 · Iniciante', emoji: '🔤',
  title: 'Alfabeto & Sons Fundamentais',
  description: 'Domine as vogais, dígrafos e sons das consoantes em inglês.',
  xp: 20,
  questions: [
    q('Como se pronuncia a letra "A" no alfabeto?', 'A', '🔤', 'Escolha a pronúncia correta', 'Ei', 'Ah', 'Ai', 'Ou', 'A letra "A" soa como "Ei" em palavras como "Name".'),
    q('Qual palavra tem o som de "th" suave entre os dentes?', 'Thanks', '🗣️', 'Selecione a palavra com "th"', 'Thanks', 'Tree', 'Tank', 'Tom', '"Thanks" pronuncia-se colocando a ponta da língua nos dentes.'),
    q('Como se pronuncia a letra "E" em inglês?', 'E', '🔤', 'Identifique a pronúncia', 'I', 'É', 'Ei', 'Ou', 'A letra "E" soa como "I" (como em "He").'),
    q('Como se pronuncia a letra "I" em inglês?', 'I', '🔤', 'Escolha o som da letra', 'Ai', 'I', 'Ei', 'Eu', 'A letra "I" tem som de "Ai" (como em "Hi").'),
    q('Qual palavra possui o som clássico de "ch" (tch)?', 'Cheese', '🧀', 'Selecione a palavra', 'Cheese', 'School', 'Echo', 'Character', '"Cheese" pronuncia-se com som de "tch".'),
    q('Como soa a letra "W" no início de "Water"?', 'Water', '💧', 'Identifique o som inicial', 'Som de "U" suave', 'Som de "V"', 'Som de "D"', 'Mudo', '"W" tem som semivogal de "U".'),
    q('Em qual palavra a letra "H" é aspirada?', 'House', '🏠', 'Escolha a palavra', 'House', 'Hour', 'Honest', 'Honor', 'Em "House" o H é pronunciado aspirado.'),
    q('Como se pronuncia o "R" americano em "Red"?', 'Red', '🔴', 'Identifique o fonema', 'Com a língua curvada para trás sem tocar o céu da boca', 'Com a garganta', 'Como o R brando do português', 'Totalmente mudo', 'O R americano é retroflexo.'),
    q('Qual palavra rima perfeitamente com "cat"?', 'Hat', '🐱', 'Selecione a rima', 'Hat', 'Cut', 'Cot', 'Kate', '"Hat" rima com "cat" pelo som aberto /æ/.'),
    q('Como se soletra a palavra "DOG" (Cachorro)?', 'D-O-G', '🐕', 'Identifique o soletrar', 'Di - Ou - Dji', 'De - O - Ge', 'Da - U - Ga', 'Di - A - Gi', 'Soletrando: D (/diː/), O (/oʊ/), G (/dʒiː/).')
  ]
});

lessons.push({
  id: 'en-2', language: 'en', level: 'A1 · Iniciante', emoji: '👋',
  title: 'Saudações & Verbo To Be',
  description: 'Aprenda a dizer olá, se apresentar e conjugar I am, You are, He is.',
  xp: 20,
  questions: [
    q('Como se diz "Meu nome é Lucas"?', 'My name is Lucas', '👋', 'Escolha a tradução', 'My name is Lucas', 'I name Lucas', 'My call Lucas', 'Lucas my is', '"My name is..." é a apresentação padrão.'),
    q('Qual a resposta cordial para "Nice to meet you"?', 'Nice to meet you too', '🤝', 'Selecione a resposta', 'Nice to meet you too', 'Good night', 'I am thirsty', 'Please go away', '"Nice to meet you too" significa prazer em conhecê-lo também.'),
    q('Complete: "I ___ a language student."', 'I am a language student', '📚', 'Complete com o verbo', 'am', 'is', 'are', 'be', 'Com "I" usamos "am".'),
    q('Complete: "They ___ from Brazil."', 'They are from Brazil', '🇧🇷', 'Complete a frase', 'are', 'is', 'am', 'be', 'Com "They" usamos "are".'),
    q('Como se diz "Bom dia" em inglês?', 'Good morning', '🌅', 'Escolha a saudação', 'Good morning', 'Good afternoon', 'Good night', 'Good evening', '"Good morning" é usado pela manhã.'),
    q('Como se pergunta "Como você está?"?', 'How are you?', '💬', 'Selecione a pergunta', 'How are you?', 'Who are you?', 'Where are you?', 'Why are you?', '"How are you?" é a saudação de cortesia.'),
    q('Qual a diferença entre "Good evening" e "Good night"?', 'Good evening and Good night', '🌙', 'Escolha a diferença', 'Good evening é ao chegar; Good night é despedida', 'São idênticos', 'Good night é de manhã', 'Good evening é à tarde', 'Usa-se Good evening na chegada e Good night na despedida.'),
    q('Complete: "He ___ very smart."', 'He is very smart', '🧠', 'Complete com to be', 'is', 'are', 'am', 'be', 'Com He/She/It usamos "is".'),
    q('Como se diz "De nada" após um agradecimento?', 'You are welcome', '🙏', 'Escolha a resposta', 'You are welcome', 'Please', 'Excuse me', 'See you', '"You are welcome" significa "De nada".'),
    q('Qual a contração de "I am"?', 'I am', '✏️', 'Selecione a forma contraída', "I'm", "I'am", "Im'", "Ime", '"I am" contrai-se para "I\'m".')
  ]
});

lessons.push({
  id: 'en-3', language: 'en', level: 'A1 · Iniciante', emoji: '⏰',
  title: 'Números, Horas & Dias',
  description: 'Conte até 100, marque reuniões e pergunte as horas.',
  xp: 25,
  questions: [
    q('Como perguntar "Que horas são?" em inglês?', 'What time is it?', '⏰', 'Escolha a pergunta', 'What time is it?', 'How many hours?', 'Where is time?', 'Which hour now?', '"What time is it?" é a pergunta padrão.'),
    q('Como se diz "Quarta-feira"?', 'Wednesday', '📅', 'Selecione o dia', 'Wednesday', 'Thursday', 'Tuesday', 'Monday', 'Wednesday é quarta-feira.'),
    q('Qual é o número "50" por extenso?', 'Fifty', '🔢', 'Escolha o número', 'Fifty', 'Fifteen', 'Five', 'Fivety', '50 é Fifty (15 é Fifteen).'),
    q('Como se diz "São 8 e meia" (8:30)?', 'Half past eight', '🕗', 'Identifique as horas', 'Half past eight', 'Half to eight', 'Eight thirty minutes', 'Middle eight', '"Half past eight" ou "Eight thirty" indicam 8:30.'),
    q('Qual dia vem logo após a sexta-feira (Friday)?', 'Saturday', '🗓️', 'Identifique o dia', 'Saturday', 'Sunday', 'Monday', 'Thursday', 'Saturday é sábado.'),
    q('Qual é o primeiro mês do ano?', 'January', '❄️', 'Escolha o mês', 'January', 'June', 'July', 'February', 'Janeiro é January.'),
    q('Como se diz "Meio-dia" (12:00 PM)?', 'Noon', '☀️', 'Identifique o termo', 'Noon', 'Midnight', 'Night', 'Afternoon', 'Noon significa meio-dia.'),
    q('Como se diz "Meia-noite" (12:00 AM)?', 'Midnight', '🌙', 'Identifique o termo', 'Midnight', 'Noon', 'Darkness', 'Midday', 'Midnight significa meia-noite.'),
    q('Como se diz "Hoje é meu aniversário"?', 'Today is my birthday', '🎂', 'Escolha a frase', 'Today is my birthday', 'Today has my birth', 'I am anniversary', 'My year today', 'Birthday é aniversário de nascimento.'),
    q('Qual preposição usamos antes de dias da semana?', 'On Monday', '📌', 'Complete a regra', 'on', 'in', 'at', 'by', 'Usa-se "on" para dias: "on Monday".')
  ]
});

lessons.push({
  id: 'en-4', language: 'en', level: 'A1 · Iniciante', emoji: '☕',
  title: 'Comidas, Bebidas & No Café',
  description: 'Faça pedidos educados em cafeterias e restaurantes.',
  xp: 20,
  questions: [
    q('Como pedir um café educadamente?', 'I would like a coffee, please', '☕', 'Escolha o pedido educado', 'I would like a coffee, please', 'Give me coffee right now', 'I want coffee quickly', 'Coffee bring here', '"I would like..." significa "Eu gostaria de...".'),
    q('Como se diz "A conta, por favor"?', 'The check, please', '🧾', 'Selecione a frase', 'The check, please', 'The count, please', 'The price, now', 'Money, please', '"The check" ou "the bill" refere-se à conta.'),
    q('Qual é a palavra para "Água com gás"?', 'Sparkling water', '💧', 'Escolha o termo', 'Sparkling water', 'Gas water', 'Soda juice', 'Bubble drink', '"Sparkling water" é água com gás.'),
    q('O que significa "Breakfast"?', 'Breakfast', '🍳', 'Identifique a refeição', 'Café da manhã', 'Almoço', 'Jantar', 'Lanche da tarde', 'Breakfast é a primeira refeição do dia.'),
    q('Qual alimento significa "Pão"?', 'Bread', '🍞', 'Escolha a palavra', 'Bread', 'Butter', 'Cheese', 'Beef', 'Bread é pão.'),
    q('Como se diz "Eu sou vegetariano"?', 'I am vegetarian', '🥗', 'Escolha a tradução', 'I am vegetarian', 'I have vegetarian', 'I eat only grass', 'No meat I am', '"I am vegetarian" é a frase correta.'),
    q('O que o garçom quer saber com: "Are you ready to order?"', 'Are you ready to order?', '📋', 'Interprete a pergunta', 'Vocês estão prontos para pedir?', 'Vocês já pagaram a conta?', 'Onde vocês moram?', 'A comida está fria?', '"Ready to order" significa pronto para fazer o pedido.'),
    q('Qual é a tradução de "Delicious"?', 'Delicious', '😋', 'Identifique o significado', 'Delicioso / Muito gostoso', 'Doce', 'Salgado', 'Apimentado', 'Delicious significa delicioso.'),
    q('Como se diz "Uma mesa para dois, por favor"?', 'A table for two, please', '🍽️', 'Selecione a frase', 'A table for two, please', 'Two chairs here', 'A desk for pair', 'Table with two men', '"A table for two, please" é a solicitação usual.'),
    q('O que significa "Tip" em um restaurante nos EUA?', 'Tip', '💵', 'Identifique o termo', 'Gorjeta para o garçom', 'Cardápio de sobremesas', 'A conta final', 'Um tipo de prato', 'Tip é a gorjeta nos EUA.')
  ]
});

lessons.push({
  id: 'en-5', language: 'en', level: 'A1 · Iniciante', emoji: '👨‍👩‍👧',
  title: 'Família & Pessoas Próximas',
  description: 'Fale sobre pais, irmãos, filhos e parentes.',
  xp: 25,
  questions: [
    q('Como se diz "Meus pais moram em Londres"?', 'My parents live in London', '👨‍👩‍👧', 'Escolha a tradução', 'My parents live in London', 'My relatives lives in London', 'My father mother in London', 'My people live London', '"Parents" significa pais (pai e mãe). Parente é "relative".'),
    q('Como se diz "Irmão" e "Irmã"?', 'Brother and Sister', '👫', 'Escolha o par', 'Brother and Sister', 'Father and Mother', 'Son and Daughter', 'Uncle and Aunt', 'Brother é irmão e Sister é irmã.'),
    q('Qual é o termo para "Avô"?', 'Grandfather', '👴', 'Selecione a palavra', 'Grandfather', 'Father', 'Uncle', 'Nephew', 'Grandfather é avô.'),
    q('Como se diz "Filho" e "Filha"?', 'Son and Daughter', '👶', 'Identifique os termos', 'Son and Daughter', 'Boy and Girl', 'Child and Little', 'Nephew and Niece', 'Son é filho e Daughter é filha.'),
    q('O que significa "Siblings"?', 'Siblings', '👦👧', 'Escolha o significado', 'Irmãos e irmãs em geral', 'Primos', 'Padrinhos', 'Sobrinhos', '"Siblings" engloba irmãos de ambos os sexos.'),
    q('Como se diz "Minha esposa"?', 'My wife', '💍', 'Identifique o termo', 'My wife', 'My woman', 'My girl', 'My partneress', 'Wife é esposa.'),
    q('Como se diz "Meu marido trabalha aqui"?', 'My husband works here', '💼', 'Escolha a frase', 'My husband works here', 'My man job here', 'My husband work here', 'My spouse is work', 'Husband é marido e com he usa-se works com -s.'),
    q('Qual o significado de "Uncle" e "Aunt"?', 'Uncle and Aunt', '🏡', 'Identifique os parentes', 'Tio e Tia', 'Primo e Prima', 'Sogro e Sogra', 'Padrasto e Madrasta', 'Uncle é tio e Aunt é tia.'),
    q('Como se diz "Eu tenho dois primos"?', 'I have two cousins', '👦👦', 'Selecione a frase', 'I have two cousins', 'I have two nephews', 'I has two cousins', 'I am with two cousins', 'Cousin serve tanto para primo quanto para prima.'),
    q('Qual é o possessivo para "dela"?', 'Her car', '🚗', 'Escolha o possessivo', 'Her', 'His', 'Its', 'Their', '"Her" significa dela (his é dele).')
  ]
});

// Helper to push full 10-question units programmatically
function addUnit(id, lang, level, emoji, title, desc, xp, qList) {
  lessons.push({
    id,
    language: lang,
    level,
    emoji,
    title,
    description: desc,
    xp,
    questions: qList
  });
}

// ---------------- EN 6 to 20 ----------------
addUnit('en-6', 'en', 'A2 · Básico', '🏠', 'A Casa, Móveis & Cômodos', 'Vocabulário da sala, cozinha, quarto e banheiro.', 25, [
  q('Onde fica a geladeira em uma casa?', 'In the kitchen', '🧊', 'Identifique o cômodo', 'In the kitchen', 'In the bedroom', 'In the bathroom', 'In the garden', 'Kitchen é cozinha.'),
  q('Onde você dorme?', 'In the bedroom', '🛏️', 'Escolha o cômodo', 'In the bedroom', 'In the living room', 'In the garage', 'In the attic', 'Bedroom é o quarto.'),
  q('Como se diz "Sala de estar"?', 'Living room', '🛋️', 'Identifique o termo', 'Living room', 'Dining room', 'Restroom', 'Hallway', 'Living room é a sala de estar.'),
  q('Qual móvel significa "Mesa"?', 'Table', '🪑', 'Escolha a palavra', 'Table', 'Chair', 'Couch', 'Shelf', 'Table é mesa.'),
  q('Como se diz "Eu moro em um apartamento"?', 'I live in an apartment', '🏢', 'Selecione a frase', 'I live in an apartment', 'I stay in home', 'I have apartment', 'I live on flat', 'Usa-se "I live in an apartment".'),
  q('O que significa "Mirror"?', 'Mirror', '🪞', 'Identifique o objeto', 'Espelho', 'Janela', 'Tapete', 'Armário', 'Mirror é espelho.'),
  q('Como se diz "Abra a janela, por favor"?', 'Open the window, please', '🪟', 'Escolha a frase', 'Open the window, please', 'Close the door now', 'Clean the glass', 'Break the window', 'Window é janela.'),
  q('Onde você toma banho?', 'In the bathroom', '🚿', 'Identifique o local', 'In the bathroom', 'In the kitchen', 'In the office', 'In the balcony', 'Bathroom é o banheiro.'),
  q('Qual é a preposição em "The keys are ___ the table"?', 'On the table', '🔑', 'Escolha a preposição', 'on', 'in', 'at', 'under', 'Usa-se "on" para sobre uma superfície.'),
  q('Como se diz "Telhado"?', 'Roof', '🏠', 'Identifique a parte da casa', 'Roof', 'Floor', 'Wall', 'Ceiling', 'Roof é o telhado externo.')
]);

addUnit('en-7', 'en', 'A2 · Básico', '🌅', 'Rotina Diária & Simple Present', 'Conjugue verbos e use o "-s" na terceira pessoa.', 30, [
  q('Complete: "He ___ up at 7 AM every day."', 'He wakes up at 7 AM', '⏰', 'Conjugue o verbo', 'wakes', 'wake', 'waking', 'is wake', '3ª pessoa singular recebe -s: wakes.'),
  q('Como se diz "Eu tomo banho pela manhã"?', 'I take a shower in the morning', '🚿', 'Escolha a frase', 'I take a shower in the morning', 'I make a bath today', 'I do shower early', 'I am shower now', '"Take a shower" é tomar banho.'),
  q('Qual auxiliar usamos para perguntas no presente com "You"?', 'Do you work here?', '❓', 'Identifique o auxiliar', 'Do', 'Does', 'Is', 'Are', 'Usa-se "Do" com I/you/we/they.'),
  q('Qual auxiliar usamos para perguntas com "She"?', 'Does she live here?', '❓', 'Identifique o auxiliar', 'Does', 'Do', 'Has', 'Is', 'Usa-se "Does" com he/she/it.'),
  q('O que significa o advérbio "Always"?', 'Always', '🔄', 'Identifique o significado', 'Sempre', 'Nunca', 'Às vezes', 'Raramente', 'Always significa sempre.'),
  q('O que significa "Never"?', 'Never', '🚫', 'Identifique o significado', 'Nunca', 'Sempre', 'Talvez', 'Logo', 'Never significa nunca.'),
  q('Como se diz "Ele escova os dentes"?', 'He brushes his teeth', '🪥', 'Selecione a frase', 'He brushes his teeth', 'He clean teeth', 'He brush tooth', 'He does teeth', 'Brushes recebe -es na 3ª pessoa.'),
  q('Complete: "They ___ soccer on weekends."', 'They play soccer on weekends', '⚽', 'Complete com o verbo', 'play', 'plays', 'playing', 'are play', 'Com They o verbo fica na forma base: play.'),
  q('Como se diz "Eu costumo ler antes de dormir"?', 'I usually read before sleeping', '📖', 'Escolha a frase', 'I usually read before sleeping', 'I always sleep reading', 'I read for bed', 'I do read sleep', '"Usually" significa habitualmente / costumo.'),
  q('Qual a forma negativa de "He works"?', 'He does not work', '💼', 'Identifique a negação', 'He does not work', 'He not work', 'He no works', 'He does not works', 'Com o auxiliar "does not", o verbo principal volta à forma base.')
]);

addUnit('en-8', 'en', 'A2 · Básico', '🗺️', 'Na Cidade & Pedindo Direções', 'Aprenda turn left, turn right e go straight.', 30, [
  q('O que significa "Go straight and turn left"?', 'Go straight and turn left', '🧭', 'Escolha o sentido', 'Siga em frente e vire à esquerda', 'Vire à direita na praça', 'Atravesse a rua e pare', 'Volte duas quadras', '"Go straight" = siga em frente; "Turn left" = vire à esquerda.'),
  q('Como perguntar "Onde fica o banco mais próximo?"?', 'Where is the nearest bank?', '🏦', 'Selecione a pergunta', 'Where is the nearest bank?', 'How is bank near?', 'What bank has here?', 'Where does bank go?', '"Nearest" significa o mais próximo.'),
  q('Como se diz "Vire à direita"?', 'Turn right', '➡️', 'Identifique a direção', 'Turn right', 'Turn left', 'Go straight', 'Stop here', 'Turn right é vire à direita.'),
  q('Como se chama a "Faixa de pedestres"?', 'Crosswalk', '🚶', 'Identifique o termo', 'Crosswalk', 'Sidewalk', 'Highway', 'Bridge', 'Crosswalk (ou zebra crossing) é faixa de pedestres.'),
  q('O que significa "Between"?', 'Between the bank and the pharmacy', '📍', 'Identifique a preposição', 'Entre dois lugares', 'Atrás de', 'Em frente a', 'Ao lado de', 'Between significa entre dois pontos.'),
  q('Como se diz "Em frente ao parque"?', 'In front of the park', '🌳', 'Escolha a frase', 'In front of the park', 'Behind the park', 'Next park', 'Near from park', '"In front of" é em frente a.'),
  q('Como se chama a calçada para caminhar?', 'Sidewalk', '🚶‍♂️', 'Identifique o termo', 'Sidewalk', 'Street', 'Road', 'Tunnel', 'Sidewalk é a calçada em inglês americano.'),
  q('Como perguntar "É longe daqui?"?', 'Is it far from here?', '📍', 'Selecione a pergunta', 'Is it far from here?', 'Has distance now?', 'Is it long place?', 'Where is far?', '"Far from here" significa longe daqui.'),
  q('Como se diz "Fica na esquina"?', 'It is on the corner', '📐', 'Escolha a frase', 'It is on the corner', 'It has corner', 'In the edge', 'On the side', '"On the corner" é na esquina.'),
  q('Como se diz "Pegue o ônibus número 10"?', 'Take bus number ten', '🚌', 'Identifique a instrução', 'Take bus number ten', 'Catch train ten', 'Drive bus ten', 'Make bus ten', 'Usa-se o verbo "take" para pegar transporte público.')
]);

addUnit('en-9', 'en', 'A2 · Básico', '🛍️', 'Compras, Preços & No Shopping', 'Pergunte How much does it cost? e negocie.', 25, [
  q('Qual frase pergunta o preço de uma camiseta?', 'How much is this T-shirt?', '👕', 'Selecione a pergunta', 'How much is this T-shirt?', 'How many cost this shirt?', 'What price are shirt?', 'Which money for this?', '"How much is...?" pergunta o preço.'),
  q('Como dizer "Posso experimentar este casaco?"?', 'Can I try this coat on?', '🧥', 'Escolha a frase', 'Can I try this coat on?', 'May I wear this coat?', 'Can I put coat now?', 'Do I use coat?', '"Try on" é provar roupas.'),
  q('O que significa "Expensive"?', 'Expensive', '🏷️', 'Identifique o significado', 'Caro', 'Barato', 'Bonito', 'Antigo', 'Expensive é caro (cheap é barato).'),
  q('O que significa "Cheap"?', 'Cheap', '🏷️', 'Identifique o significado', 'Barato', 'Caro', 'Rápido', 'Pesado', 'Cheap é barato.'),
  q('Onde você experimenta roupas em uma loja?', 'In the fitting room', '🚪', 'Identifique o local', 'In the fitting room', 'In the restroom', 'In the warehouse', 'In the office', 'Fitting room é o provador.'),
  q('Como se diz "Tamanho médio"?', 'Medium size', '📏', 'Escolha o tamanho', 'Medium size', 'Middle size', 'Half size', 'Center size', 'Tamanhos: Small (P), Medium (M), Large (G).'),
  q('Como perguntar "Vocês aceitam cartão de crédito?"?', 'Do you accept credit cards?', '💳', 'Selecione a pergunta', 'Do you accept credit cards?', 'Can I give plastic?', 'Have you card here?', 'Credit card take?', '"Do you accept credit cards?" é a pergunta formal.'),
  q('O que é um "Receipt"?', 'Receipt', '🧾', 'Identifique o documento', 'Comprovante / Nota fiscal', 'Receita médica', 'Etiqueta de preço', 'Envelope', 'Receipt é recibo / comprovante de compra.'),
  q('O que significa "Discount"?', 'Discount', '💰', 'Identifique o termo', 'Desconto no preço', 'Taxa extra', 'Devolução', 'Aumento', 'Discount é desconto.'),
  q('Como se diz "É apenas uma olhadinha, obrigado"?', 'I am just looking, thanks', '👀', 'Escolha a resposta comum', 'I am just looking, thanks', 'I don’t want buy', 'Leave me alone', 'No money today', '"I am just looking, thanks" é a resposta educada a um vendedor.')
]);

addUnit('en-10', 'en', 'A2 · Básico', '🌦️', 'Clima, Estações & Roupas', 'Fale sobre sol, chuva, neve e temperatura.', 25, [
  q('Como se diz "Está chovendo muito hoje"?', 'It is raining a lot today', '🌧️', 'Escolha a frase correta', 'It is raining a lot today', 'It has rain today', 'Is rain much now', 'Today does rain', 'Usa-se "It is raining" para tempo meteorológico.'),
  q('Como se diz "Está ensolarado e quente"?', 'It is sunny and hot', '☀️', 'Identifique a frase', 'It is sunny and hot', 'It is sun with warm', 'Has sun today', 'Sun is high now', 'Sunny é ensolarado e hot é quente.'),
  q('Qual é a estação do outono?', 'Autumn / Fall', '🍂', 'Identifique a estação', 'Autumn (ou Fall)', 'Spring', 'Summer', 'Winter', 'Outono é Autumn (Reino Unido) ou Fall (EUA).'),
  q('Qual é a estação das flores?', 'Spring', '🌸', 'Identifique a estação', 'Spring', 'Winter', 'Summer', 'Autumn', 'Spring é a primavera.'),
  q('Como se diz "Está nevando"?', 'It is snowing', '❄️', 'Escolha a frase', 'It is snowing', 'It is ice now', 'Snow is dropping', 'Has white rain', 'Snowing é nevando.'),
  q('O que significa "Windy"?', 'Windy', '💨', 'Identifique o significado', 'Com muito vento', 'Ensolarado', 'Nublado', 'Seco', 'Windy significa ventoso / com vento.'),
  q('O que você usa quando está chovendo?', 'An umbrella', '☂️', 'Identifique o acessório', 'An umbrella', 'Sunglasses', 'Swimsuit', 'Sandals', 'Umbrella é guarda-chuva.'),
  q('Como se diz "Previsão do tempo"?', 'Weather forecast', '📺', 'Identifique a expressão', 'Weather forecast', 'Climate vision', 'Sky news', 'Rain calendar', 'Weather forecast é previsão do tempo.'),
  q('Como dizer "Está muito frio lá fora"?', 'It is very cold outside', '🥶', 'Escolha a frase', 'It is very cold outside', 'Has ice outside', 'Outside is frozen', 'Makes cold out', 'Cold é frio e outside é lá fora.'),
  q('Qual é a temperatura de congelamento em graus Celsius?', 'Zero degrees', '🧊', 'Identifique a resposta', 'Zero degrees', 'Ten degrees', 'Thirty degrees', 'Hundred degrees', 'Zero degrees Celsius é ponto de congelamento.')
]);

addUnit('en-11', 'en', 'B1 · Intermediário', '✈️', 'No Aeroporto & Imigração', 'Check-in, portão de embarque e alfândega.', 30, [
  q('Onde você embarca no avião no aeroporto?', 'At the boarding gate', '🛫', 'Identifique o local', 'At the boarding gate', 'At the baggage claim', 'At the ticket counter', 'At the taxi stand', '"Boarding gate" é o portão de embarque.'),
  q('O que o oficial de imigração pergunta com: "What is the purpose of your visit?"', 'Purpose of visit', '🛂', 'Interprete a pergunta', 'Qual o objetivo da sua viagem?', 'Quanto dinheiro você tem?', 'Onde está sua mala?', 'Qual é seu hotel?', '"Purpose" é o propósito / finalidade.'),
  q('Como responder que você está viajando a turismo?', 'I am here for tourism', '🏖️', 'Escolha a resposta', 'I am here for tourism', 'I am walking here', 'I have tourist visa only', 'Just wandering around', '"I am here for tourism" é a resposta clara e direta.'),
  q('Como se chama a esteira onde você retira as malas?', 'Baggage claim', '🧳', 'Identifique o local', 'Baggage claim', 'Customs office', 'Check-in desk', 'Runway', 'Baggage claim é a restituição de bagagem.'),
  q('O que é o "Boarding pass"?', 'Boarding pass', '🎫', 'Identifique o documento', 'Cartão de embarque', 'Passaporte oficial', 'Visto de entrada', 'Seguro viagem', 'Boarding pass é o cartão de embarque.'),
  q('Como se diz "Voo atrasado"?', 'Delayed flight', '⏳', 'Identifique o status', 'Delayed flight', 'Canceled flight', 'Early flight', 'On time flight', 'Delayed significa atrasado.'),
  q('O que significa "Carry-on bag"?', 'Carry-on bag', '🎒', 'Identifique a bagagem', 'Mala de mão / bagagem de cabine', 'Mala despachada pesada', 'Carrinho de malas', 'Mochila escolar', 'Carry-on bag é a mala de mão.'),
  q('Como perguntar onde fica a esteira de bagagens?', 'Where is the baggage claim?', '🧳', 'Selecione a pergunta', 'Where is the baggage claim?', 'Where bags drop?', 'Where is suitcase park?', 'Which luggage area?', '"Where is the baggage claim?" é a pergunta exata.'),
  q('O que significa "Customs"?', 'Customs', '👮', 'Identifique o setor', 'Alfândega', 'Polícia local', 'Banheiros', 'Loja duty-free', 'Customs é a alfândega.'),
  q('Como dizer "Quanto tempo dura o voo?"?', 'How long is the flight?', '⏱️', 'Escolha a pergunta', 'How long is the flight?', 'What time flight has?', 'How distance we fly?', 'How much hours travel?', '"How long is...?" pergunta a duração de tempo.')
]);

addUnit('en-12', 'en', 'B1 · Intermediário', '📜', 'Passado Simples: Verbos Irregulares', 'Domine went, saw, bought, took e thought.', 35, [
  q('Qual é o passado de "buy" (comprar)?', 'Bought', '💳', 'Escolha o passado', 'Bought', 'Buyed', 'Brought', 'Buying', 'O passado de buy é o irregular "bought".'),
  q('Qual é o passado de "go" (ir)?', 'Went', '🚶', 'Escolha o passado', 'Went', 'Goed', 'Gone', 'Going', 'O passado de go é "went".'),
  q('Qual é o passado de "see" (ver)?', 'Saw', '👀', 'Escolha o passado', 'Saw', 'Seed', 'Seen', 'Sight', 'O passado de see é "saw".'),
  q('Qual é o passado de "eat" (comer)?', 'Ate', '🍽️', 'Escolha o passado', 'Ate', 'Eaten', 'Eated', 'Eating', 'O passado de eat é "ate".'),
  q('Como negar no passado: "Eu não assisti TV ontem"?', 'I did not watch TV yesterday', '📺', 'Selecione a negação', 'I did not watch TV yesterday', 'I not watched TV', 'I no watch TV', 'I did not watched TV', 'Usa-se "did not" + verbo na forma base.'),
  q('Qual o passado do verbo "to have" (ter)?', 'Had', '💼', 'Identifique a forma', 'Had', 'Haved', 'Has', 'Having', 'O passado de have é "had".'),
  q('Qual o passado de "take" (pegar / levar)?', 'Took', '📸', 'Escolha o passado', 'Took', 'Taked', 'Taken', 'Tooken', 'O passado de take é "took".'),
  q('Complete: "Yesterday we ___ pizza for dinner."', 'Yesterday we had pizza', '🍕', 'Complete a frase', 'had', 'have', 'having', 'has', 'Ação no passado: had.'),
  q('Qual é o passado de "write" (escrever)?', 'Wrote', '✍️', 'Identifique o verbo', 'Wrote', 'Written', 'Writed', 'Writing', 'O passado de write é "wrote".'),
  q('Como perguntar: "Você foi à praia ontem?"?', 'Did you go to the beach yesterday?', '🏖️', 'Selecione a pergunta', 'Did you go to the beach yesterday?', 'Did you went to beach?', 'Went you to beach?', 'Do you went yesterday?', 'Na pergunta no passado com "Did", o verbo fica na forma base "go".')
]);

addUnit('en-13', 'en', 'B1 · Intermediário', '🏨', 'No Hotel, Hospedagem & Check-in', 'Faça check-in, solicite toalhas e tire dúvidas.', 30, [
  q('Como dizer "Tenho uma reserva no nome de Silva"?', 'I have a reservation under the name of Silva', '🛎️', 'Selecione a frase', 'I have a reservation under the name of Silva', 'I book room for Silva now', 'My name has hotel', 'I have one room Silva', '"Under the name of..." é a expressão formal para reservas.'),
  q('A que horas geralmente é o "Check-out"?', 'Check-out time', '🕚', 'Identifique o horário comum', 'Around 11 AM or noon', 'At midnight', 'At 6 AM', 'Anytime you want', 'Check-out costuma ser às 11h ou meio-dia.'),
  q('Como pedir toalhas limpas para o quarto?', 'Could we have extra towels, please?', '🛁', 'Escolha a solicitação', 'Could we have extra towels, please?', 'Bring cloths quickly', 'Where is bathroom sheets?', 'I want clean paper', 'Towels são toalhas.'),
  q('O que significa "Wake-up call"?', 'Wake-up call', '📞', 'Identifique o serviço', 'Serviço de despertador pelo telefone do hotel', 'Chamada internacional cara', 'Pedido de café da manhã', 'Aviso de incêndio', 'Wake-up call é o serviço de despertar.'),
  q('Como perguntar se o café da manhã está incluído na diária?', 'Is breakfast included?', '🥐', 'Selecione a pergunta', 'Is breakfast included?', 'Does hotel give free food?', 'Is morning coffee gratis?', 'Have we food price?', '"Is breakfast included?" é a pergunta padrão.'),
  q('Qual a palavra para "Chave do quarto"?', 'Room key / Keycard', '🔑', 'Identifique o objeto', 'Room key (ou Keycard)', 'Door code', 'Secret card', 'Lock opener', 'Room key ou keycard é a chave do quarto.'),
  q('O que significa "Single room"?', 'Single room', '🛏️', 'Identifique o tipo de quarto', 'Quarto para uma pessoa (cama de solteiro)', 'Quarto duplo de luxo', 'Quarto sem banheiro', 'Suíte presidencial', 'Single room é quarto para uma pessoa.'),
  q('Como dizer "O ar-condicionado não está funcionando"?', 'The air conditioning is not working', '❄️', 'Escolha a frase', 'The air conditioning is not working', 'Cold machine is dead', 'Air is broken here', 'No cold wind now', '"Not working" significa não está funcionando.'),
  q('O que é o "Elevator"?', 'Elevator', '🛗', 'Identifique o termo', 'Elevador', 'Escada de emergência', 'Recepção', 'Estacionamento', 'Elevator (EUA) ou Lift (Reino Unido) é o elevador.'),
  q('O que significa a placa "Do Not Disturb"?', 'Do Not Disturb', '🚫', 'Identifique o aviso', 'Não perturbe', 'Favor limpar o quarto', 'Saída proibida', 'Quarto vago', '"Do Not Disturb" significa não perturbe.')
]);

addUnit('en-14', 'en', 'B1 · Intermediário', '🏥', 'Saúde, Sintomas & Na Farmácia', 'Descreva dores e compre analgésicos.', 30, [
  q('Como expressar "Estou com dor de garganta"?', 'I have a sore throat', '🤒', 'Escolha a tradução', 'I have a sore throat', 'My neck is pain', 'I am throat hurt', 'Pain in mouth', '"Sore throat" é dor de garganta.'),
  q('Como se diz "Dor de cabeça"?', 'Headache', '🤕', 'Identifique o sintoma', 'Headache', 'Toothache', 'Stomachache', 'Earache', 'Headache é dor de cabeça.'),
  q('O que é um "Painkiller"?', 'Painkiller', '💊', 'Identifique o medicamento', 'Analgésico / remédio para dor', 'Antibiótico forte', 'Xarope para tosse', 'Pomada para pele', 'Painkiller é analgésico.'),
  q('O que significa "Prescription"?', 'Prescription', '📄', 'Identifique o documento', 'Receita médica', 'Bula do remédio', 'Conta do hospital', 'Atestado de óbito', 'Prescription é a receita prescrita pelo médico.'),
  q('Como dizer "Estou com febre alta"?', 'I have a high fever', '🌡️', 'Escolha a frase', 'I have a high fever', 'I am with hot temperature', 'My body is burning', 'I feel heat sick', 'Fever é febre.'),
  q('Como se diz "Eu sou alérgico a penicilina"?', 'I am allergic to penicillin', '⚠️', 'Selecione a declaração', 'I am allergic to penicillin', 'I have allergy of penicillin', 'Penicillin makes me bad', 'No penicillin for me', '"I am allergic to..." expressa alergia a algo.'),
  q('O que significa "Dizzy"?', 'Dizzy', '😵', 'Identifique a sensação', 'Tonto / com vertigem', 'Sonolento', 'Com fome', 'Cansado', 'Dizzy significa tonto ou zonzo.'),
  q('Como se chama o "Xarope para tosse"?', 'Cough syrup', '🥄', 'Identifique o remédio', 'Cough syrup', 'Throat juice', 'Cold water', 'Drop medicine', 'Cough syrup é xarope para tosse.'),
  q('Como dizer "Machuquei meu tornozelo"?', 'I hurt my ankle', '🦶', 'Escolha a frase', 'I hurt my ankle', 'My foot is broken', 'I destroyed my leg', 'Pain in knee', 'Ankle é tornozelo e hurt é machucar.'),
  q('Como se diz "Melhoras logo!" a um doente?', 'Get well soon!', '💐', 'Escolha a mensagem carinhosa', 'Get well soon!', 'Be healthy now!', 'Recover quickly please!', 'No more sick!', '"Get well soon!" é a frase padrão para desejar melhoras.')
]);

addUnit('en-15', 'en', 'B1 · Intermediário', '💼', 'Trabalho, Profissões & E-mails', 'Escreva e-mails profissionais com clareza.', 35, [
  q('Como iniciar um e-mail formal em inglês?', 'Dear Mr. Smith', '✉️', 'Escolha a saudação formal', 'Dear Mr. Smith', 'Hey dude', 'What is up', 'Yo Smith', '"Dear Mr./Ms." é o início formal adequado.'),
  q('Como encerrar um e-mail profissional cordialmente?', 'Best regards', '✍️', 'Escolha a despedida profissional', 'Best regards', 'Kisses and hugs', 'Bye bye', 'See you later alligator', '"Best regards" ou "Sincerely" são encerramentos profissionais.'),
  q('O que significa "Deadline"?', 'Deadline', '⏰', 'Identifique o termo corporativo', 'Prazo limite de entrega', 'Linha de chegada', 'Fim do expediente', 'Demissão em massa', 'Deadline é o prazo limite para finalizar uma tarefa.'),
  q('O que é um "Meeting"?', 'Meeting', '👥', 'Identifique o evento', 'Reunião de trabalho', 'Almoço informal', 'Festa de aniversário', 'Entrevista de saída', 'Meeting é reunião.'),
  q('Como se chama o currículo profissional em inglês americano?', 'Resume', '📄', 'Identifique o documento', 'Resume', 'CV card', 'Job list', 'Career paper', 'Resume (nos EUA) ou CV (no Reino Unido) é o currículo.'),
  q('O que significa "CEO" (Chief Executive Officer)?', 'CEO', '👔', 'Identifique o cargo', 'Diretor executivo / Presidente da empresa', 'Gerente de compras', 'Chefe de segurança', 'Estagiário sênior', 'CEO é o presidente executivo.'),
  q('Como dizer "Anexo o relatório solicitado"?', 'Please find attached the report', '📎', 'Escolha a frase corporativa', 'Please find attached the report', 'Look report inside', 'I put file together', 'Report is glued here', '"Please find attached..." é a frase padrão para anexos.'),
  q('O que é "Overtime"?', 'Overtime', '⏱️', 'Identifique o termo de trabalho', 'Hora extra de trabalho', 'Tempo de descanso', 'Férias remuneradas', 'Atraso tolerável', 'Overtime são horas extras.'),
  q('Como dizer "Estou fora do escritório até segunda"?', 'I am out of the office until Monday', '🚪', 'Selecione a resposta automática', 'I am out of the office until Monday', 'I no work today Monday', 'My desk is empty', 'Gone away forever', 'Mensagem clássica de Out of Office (OOO).'),
  q('O que significa "To hire"?', 'To hire', '🤝', 'Identifique o verbo', 'Contratar um funcionário', 'Demitir alguém', 'Promover de cargo', 'Pedir aumento', 'Hire é contratar (fire é demitir).')
]);

addUnit('en-16', 'en', 'B1 · Intermediário', '🌍', 'Present Perfect & Experiências', 'Use Have you ever...? para falar de viagens e vida.', 35, [
  q('Complete: "Have you ever ___ sushi?"', 'Have you ever eaten sushi?', '🍣', 'Escolha o particípio', 'eaten', 'ate', 'eating', 'eat', 'Present Perfect exige particípio passado: eaten.'),
  q('Complete: "I have lived in this city ___ five years."', 'For five years', '⏳', 'Escolha for ou since', 'for', 'since', 'during', 'from', 'Usa-se "for" para duração de tempo (5 anos).'),
  q('Complete: "She has worked here ___ 2020."', 'Since 2020', '📅', 'Escolha for ou since', 'since', 'for', 'from', 'in', 'Usa-se "since" para ponto de início no tempo.'),
  q('O que significa "Already" no Present Perfect?', 'I have already finished', '✅', 'Identifique o sentido', 'Já (ação realizada antes do esperado)', 'Ainda não', 'Nunca', 'Sempre', 'Already indica que a ação já foi concluída.'),
  q('Onde colocamos "Yet" em frases interrogativas e negativas?', 'Have you finished yet?', '❓', 'Identifique a posição', 'No final da frase', 'No início', 'Entre o sujeito e verbo', 'Antes do particípio', 'Yet costuma vir no final da frase.'),
  q('Complete: "He has ___ visited Japan."', 'He has never visited Japan', '🇯🇵', 'Complete a experiência', 'never', 'ever', 'not ever', 'no', 'Never expressa que ele nunca visitou.'),
  q('Qual a diferença entre "have been to" e "have gone to"?', 'Been to vs Gone to', '🧳', 'Identifique a diferença', '"Been to" foi e voltou; "Gone to" ainda está lá', 'São idênticos', '"Gone to" é no passado remoto', '"Been to" é só para trabalho', 'Been to indica viagem completa com retorno.'),
  q('Complete: "We ___ just arrived home."', 'We have just arrived home', '🏡', 'Complete com have/has', 'have', 'has', 'had', 'are', 'Com "We" usa-se "have". Just indica que acabou de acontecer.'),
  q('Como perguntar: "Você já esteve em Nova York?"?', 'Have you ever been to New York?', '🗽', 'Selecione a pergunta', 'Have you ever been to New York?', 'Did you already go to NY?', 'Were you in NY ever?', 'Have you gone NY?', '"Have you ever been to...?" é a pergunta clássica.'),
  q('Qual o particípio passado do verbo "to write"?', 'Written', '✍️', 'Identifique a forma', 'Written', 'Wrote', 'Writed', 'Writing', 'Write -> Wrote -> Written.')
]);

addUnit('en-17', 'en', 'B2 · Avançado', '🔮', 'Futuro: Will vs Going To', 'Previsões espontâneas vs planos organizados.', 40, [
  q('Para um plano já agendado e decidido com antecedência, usamos:', 'I am going to travel next month', '📆', 'Selecione a frase correta', 'I am going to travel next month', 'I will maybe travel tomorrow', 'I travel future', 'I shall to go', '"Going to" é usado para planos pré-estabelecidos.'),
  q('Para uma decisão tomada no instante em que se fala (espontânea), usamos:', 'I will answer the phone', '📞', 'Identifique a estrutura', 'Will ("I will answer it")', 'Going to', 'Present continuous', 'Past tense', 'Decisões no momento da fala usam "will".'),
  q('Para promessas solenes, qual estrutura é tradicional?', 'I promise I will help you', '🤝', 'Identifique o auxiliar', 'Will', 'Going to', 'Might', 'Must', 'Promessas utilizam "will": "I will always love you".'),
  q('Complete a previsão: "Look at those dark clouds! It ___ rain."', 'It is going to rain', '⛈️', 'Escolha pela evidência física', 'is going to', 'will maybe', 'does', 'would', 'Com evidências visuais presentes usa-se "is going to rain".'),
  q('Qual a contração negativa de "will not"?', 'Won’t', '🚫', 'Identifique a contração', "Won't", "Willn't", "Wont't", "Wilt", "Will not contrai-se para won't."),
  q('Como fazer uma oferta cordial com "Shall"?', 'Shall I carry your bag?', '🧳', 'Selecione a frase polida', 'Shall I carry your bag?', 'Will you make my bag?', 'Do I bag for you?', 'Shall bag be mine?', '"Shall I...?" é oferta formal britânica.'),
  q('Complete: "By this time tomorrow, I ___ be flying to Paris."', 'I will be flying', '✈️', 'Future continuous', 'will', 'going', 'am', 'was', 'Will be flying indica ação contínua em progresso no futuro.'),
  q('O que expressa a frase: "I might visit my parents this weekend"?', 'Might', '🏡', 'Interprete o modal', 'Uma possibilidade incerta (talvez eu visite)', 'Certeza absoluta', 'Uma obrigação legal', 'Uma ordem', 'Might expressa possibilidade com menor certeza.'),
  q('Como dizer "Não se preocupe, eu te ligo mais tarde"?', 'Don’t worry, I will call you later', '📱', 'Escolha a frase espontânea', 'Don’t worry, I will call you later', 'No worry, I am to call', 'I call you after', 'Calm, I make call', 'Promessa / decisão espontânea com will.'),
  q('O que significa "As soon as I arrive, I will text you"?', 'As soon as', '💬', 'Identifique o sentido', 'Assim que eu chegar, te mando mensagem', 'Se eu chegar tarde, não mando nada', 'Antes de chegar eu ligo', 'Enquanto eu viajo eu durmo', '"As soon as" significa assim que / logo que.')
]);

addUnit('en-18', 'en', 'B2 · Avançado', '🧠', 'Condicionais & Situações Hipotéticas', 'Domine If I were you, I would take the offer.', 40, [
  q('Complete a 2ª condicional: "If I won the lottery, I ___ buy a mansion."', 'I would buy', '🏰', 'Complete no modo hipotético', 'would', 'will', 'have', 'am', 'A 2ª condicional usa Past Simple + would.'),
  q('Complete o conselho: "If I ___ you, I would accept the job offer."', 'If I were you', '👔', 'Identifique o subjuntivo formal', 'were', 'was', 'am', 'will be', 'No inglês formal de hipótese usa-se "were" com I/he/she.'),
  q('Qual condicional expressa verdades científicas universais (Zero Conditional)?', 'If you heat ice, it melts', '🧊', 'Identifique a regra', 'Present + Present ("If you heat ice, it melts")', 'Past + Would', 'Will + Might', 'Past perfect + Would have', 'Zero conditional usa presente nas duas orações.'),
  q('Complete a 1ª condicional (realista): "If it rains tomorrow, we ___ stay home."', 'We will stay home', '🌧️', 'Escolha a consequência', 'will', 'would', 'had', 'were', '1ª condicional usa If + Present, Will + base form.'),
  q('O que a 3ª condicional expressa (Third Conditional)?', 'If I had studied, I would have passed', '📜', 'Identifique o sentido', 'Arrependimento ou hipótese sobre um passado impossível de mudar', 'Planos para o próximo ano', 'Ordens imediatas', 'Fatos da física', 'A 3ª condicional trata do passado não ocorrido.'),
  q('Complete: "If you ___ told me earlier, I could have helped."', 'If you had told me', '🗣️', 'Complete no passado perfeito', 'had', 'have', 'would', 'did', 'Na 3ª condicional a condição leva had + particípio.'),
  q('O que significa a palavra "Unless"?', 'Unless you hurry, you will miss the train', '⏳', 'Identifique o conectivo', 'A não ser que / A menos que', 'Porque', 'Desde que', 'Embora', '"Unless" equivale a "if not" (a menos que).'),
  q('Complete: "I will go to the party provided that you ___ with me."', 'Provided that you come', '🎉', 'Identifique o conectivo condicional', 'come', 'came', 'will come', 'had come', '"Provided that" significa contanto que.'),
  q('Como dizer "Se eu soubesse, teria te avisado"?', 'If I had known, I would have told you', '💡', 'Selecione a 3ª condicional', 'If I had known, I would have told you', 'If I knew, I told you', 'If I know, I will tell', 'If I was knowing, I would tell', 'Estrutura clássica de arrependimento no passado.'),
  q('O que expressa a oração: "Wish I were taller"?', 'I wish', '📏', 'Identifique o sentimento', 'Desejo de uma realidade diferente no presente', 'Previsão matemática', 'Reclamação agressiva', 'Pergunta sobre altura', '"I wish + were" expressa desejo no presente.')
]);

addUnit('en-19', 'en', 'B2 · Avançado', '⚡', 'Phrasal Verbs Indispensáveis', 'Aprenda look forward to, give up e run out of.', 40, [
  q('O que significa o phrasal verb "to give up"?', 'Give up', '🏳️', 'Identifique o significado', 'Desistir / abandonar um esforço', 'Devolver um livro', 'Subir escadas', 'Aumentar o volume', '"Give up" significa desistir.'),
  q('O que significa "I am looking forward to our vacation"?', 'Look forward to', '🏖️', 'Interprete a frase', 'Estou aguardando ansiosamente pelas férias', 'Estou com medo das férias', 'Cancelei minhas férias', 'Esqueci minhas férias', '"Look forward to" significa aguardar com expectativa positiva.'),
  q('O que significa "We ran out of coffee"?', 'Run out of', '☕', 'Identifique a situação', 'Nosso café acabou completamente', 'Derrubamos o café no chão', 'Tomamos café correndo', 'Compramos café demais', '"Run out of" significa esgotar o estoque / ficar sem.'),
  q('O que significa "Turn off the lights"?', 'Turn off', '💡', 'Identifique a ação', 'Desligar / apagar as luzes', 'Ligar as luzes', 'Trocar as lâmpadas', 'Comprar lâmpadas', 'Turn off é desligar ou apagar.'),
  q('O que significa "Put off the meeting"?', 'Put off', '📅', 'Identifique o sentido', 'Adiar a reunião para outra data', 'Cancelar para sempre', 'Iniciar a reunião', 'Gritar na reunião', '"Put off" significa adiar / postergar.'),
  q('O que significa "Find out"?', 'Find out', '🔍', 'Identifique o significado', 'Descobrir uma informação', 'Perder um objeto', 'Inventar uma mentira', 'Procurar sem achar', '"Find out" significa descobrir ou se informar.'),
  q('O que significa "Call off the match"?', 'Call off', '⚽', 'Identifique a decisão', 'Cancelar a partida', 'Comemorar o jogo', 'Aumentar o tempo', 'Mudar o estádio', '"Call off" significa cancelar definitivamente.'),
  q('O que significa "Get along with someone"?', 'Get along with', '🤝', 'Identifique o relacionamento', 'Dar-se bem com alguém / ter boa convivência', 'Brigar constantemente', 'Morar longe', 'Trabalhar junto por obrigação', '"Get along with" significa ter bom relacionamento.'),
  q('O que significa "Look after my dog"?', 'Look after', '🐕', 'Identifique o cuidado', 'Cuidar do meu cachorro', 'Procurar meu cachorro perdido', 'Comprar ração', 'Correr atrás do cão', '"Look after" significa cuidar / zelar.'),
  q('O que significa "Figure out a solution"?', 'Figure out', '🧩', 'Identifique a habilidade', 'Encontrar / compreender uma solução para um problema', 'Criar mais problemas', 'Copiar de alguém', 'Desistir da busca', '"Figure out" significa desvendar ou solucionar.')
]);

addUnit('en-20', 'en', 'B2 · Avançado', '🎭', 'Expressões Idiomáticas Nativas', 'Entenda break a leg, piece of cake e hit the sack.', 40, [
  q('Quando alguém diz que um teste foi "a piece of cake", o que significa?', 'Piece of cake', '🍰', 'Identifique a gíria', 'Foi extremamente fácil / uma moleza', 'Foi muito gostoso', 'Foi longo e cansativo', 'Foi confuso', '"Piece of cake" significa muito fácil.'),
  q('O que significa desejar "Break a leg" a um artista antes do show?', 'Break a leg', '🎭', 'Identifique o costume', 'Boa sorte! (expressão teatral tradicional)', 'Espero que você caia', 'O show vai ser ruim', 'Cuidado com os degraus', '"Break a leg" é a forma clássica de desejar boa sorte sem dar azar.'),
  q('O que significa "I feel under the weather today"?', 'Under the weather', '🤒', 'Identifique o estado de saúde', 'Estou me sentindo indisposto ou meio doente', 'Está chovendo na minha cidade', 'Estou com muito frio', 'Gosto de olhar as nuvens', '"Under the weather" significa estar adoentado ou indisposto.'),
  q('O que significa "Hit the sack"?', 'Hit the sack', '🛏️', 'Identifique a ação cotidiana', 'Ir dormir / ir para a cama', 'Bater em um saco de boxe', 'Ir às compras', 'Trabalhar no campo', '"Hit the sack" significa ir dormir.'),
  q('O que significa a expressão "Once in a blue moon"?', 'Once in a blue moon', '🌕', 'Identifique a frequência', 'Raramente / quase nunca', 'Todos os meses', 'Toda semana', 'Nas noites de verão', '"Once in a blue moon" expressa algo muito raro.'),
  q('O que significa "Cost an arm and a leg"?', 'Cost an arm and a leg', '💸', 'Identifique o valor', 'Custar os olhos da cara / ser caríssimo', 'Ser muito barato', 'Ser doado de graça', 'Estar quebrado', 'Significa custar uma fortuna.'),
  q('O que significa "Bite the bullet"?', 'Bite the bullet', '😬', 'Identifique a atitude', 'Enfrentar uma situação difícil com coragem', 'Comer rápido demais', 'Discutir com alguém', 'Fugir do perigo', '"Bite the bullet" é encarar o inevitável com firmeza.'),
  q('O que significa "Spill the beans"?', 'Spill the beans', '🤫', 'Identifique a atitude', 'Revelar um segredo acidentalmente ou por fofoca', 'Derrubar o prato de comida', 'Cozinhar feijão', 'Guardar silêncio absoluto', '"Spill the beans" significa abrir o bico / contar o segredo.'),
  q('O que significa "Burn the midnight oil"?', 'Burn the midnight oil', '🕯️', 'Identifique o hábito de estudo', 'Trabalhar ou estudar até altas horas da madrugada', 'Acender fogueiras à noite', 'Desperdiçar energia elétrica', 'Dormir muito cedo', 'Significa virar a noite estudando ou trabalhando.'),
  q('O que significa "See eye to eye with someone"?', 'See eye to eye', '👀', 'Identifique a harmonia', 'Concordar plenamente com alguém', 'Olhar com raiva', 'Ter a mesma altura física', 'Usar óculos idênticos', '"See eye to eye" significa estar em total concordância.')
]);

console.log('English units generated: 20');

// Save partial
fs.writeFileSync('scratch/lessons_en.json', JSON.stringify(lessons, null, 2));
