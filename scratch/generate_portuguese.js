// scratch/generate_portuguese.js
const fs = require('fs');

function q(prompt, speech, emoji, instruction, correctOpt, w1, w2, w3, explanation) {
  const options = [correctOpt, w1, w2, w3];
  const charSum = prompt.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
  const idx = charSum % 4;
  const temp = options[0];
  options[0] = options[idx];
  options[idx] = temp;

  return {
    prompt,
    speech,
    emoji: emoji || '🇧🇷',
    instruction: instruction || 'Escolha a opção correta em português',
    options,
    answer: idx,
    explanation
  };
}

const lessons = [];

function addUnit(id, level, emoji, title, desc, xp, qList) {
  lessons.push({
    id,
    language: 'pt',
    level,
    emoji,
    title,
    description: desc,
    xp,
    questions: qList
  });
}

// 1
addUnit('pt-1', 'A1 · Iniciante', '🇧🇷', 'Sons Nasais & Fonética Brasileira', 'Domine o til (~) em pão, coração e a cedilha (ç).', 20, [
  q('Qual palavra possui o clássico ditongo nasal brasileiro?', 'Pão de queijo', '🧀', 'Selecione a palavra com som nasal', 'Pão', 'Pau', 'Pato', 'Pena', '"Pão" possui o som nasal característico da língua portuguesa com o til (~).'),
  q('Qual som tem a cedilha (ç) em palavras como "Coração"?', 'Coração', '❤️', 'Identifique o fonema', 'Som de "SS"', 'Som de "K"', 'Som de "Z"', 'Som de "CH"', 'A cedilha tem som suave de "SS".'),
  q('Qual palavra tem o plural terminado em "-ões"?', 'Corações', '👥', 'Identifique o plural', 'Corações', 'Pãos', 'Mãos', 'Alemãos', 'Coração forma plural em corações.'),
  q('Como soa a letra "R" no início de palavras como "Rio"?', 'Rio', '🌊', 'Identifique a pronúncia', 'Som forte aspirado ou gutural', 'Som de L', 'Som mudo', 'Vibrante suave como "caro"', 'O R inicial em português tem som forte.'),
  q('Qual das seguintes palavras possui som nasal terminado em "-ão"?', 'Irmão', '👦', 'Selecione a palavra', 'Irmão', 'Irmad', 'Irmal', 'Irmate', '"Irmão" termina em ditongo nasal -ão.'),
  q('Como soa a letra "S" entre duas vogais em "Casa"?', 'Casa', '🏡', 'Identifique o som', 'Som de "Z"', 'Som de "SS"', 'Som de "J"', 'Mudo', 'S intervocálico tem som de Z.'),
  q('Qual é o som de "LH" em "Filho"?', 'Filho', '👶', 'Identifique a pronúncia', 'Palatal lateral (som aproximado do lli italiano)', 'Som de L duplo', 'Som de R', 'Som de J', '"LH" é uma consoante palatal.'),
  q('Qual é o som de "NH" em "Manhã"?', 'Manhã', '🌅', 'Identifique o som nasal', 'Nasal palatal (equivalente ao ñ do espanhol)', 'Som de N duplo', 'Som de M', 'Mudo', '"NH" em português equivale ao ñ em espanhol.'),
  q('Qual palavra tem som de "X" com som de "CH"?', 'Xícara', '☕', 'Identifique a pronúncia', 'Xícara', 'Exame', 'Táxi', 'Próximo', 'Em "Xícara" o X soa como CH.'),
  q('Como se pronuncia a letra "L" no final de sílaba no Brasil (ex: "Brasil")?', 'Brasil', '🇧🇷', 'Identifique o fonema brasileiro', 'Vocalizado como som de "U"', 'Som velar de L duro', 'Mudo', 'Som de R', 'No Brasil, o L em final de sílaba é pronunciado como semivogal "U".')
]);

// 2
addUnit('pt-2', 'A1 · Iniciante', '👋', 'Saudações & Tudo Bem?', 'Oi, bom dia, tudo joia e muito prazer.', 20, [
  q('Qual a resposta mais simpática e usual para "Oi, tudo bem?"', 'Tudo bem, e com você?', '😊', 'Escolha a resposta usual', 'Tudo bem, e com você?', 'Não tenho nada a dizer', 'Adeus agora', 'Talvez amanhã', '"Tudo bem, e com você?" é a saudação cordial de todos os dias.'),
  q('Como desejar bom dia formalmente pela manhã?', 'Bom dia', '🌅', 'Selecione a saudação', 'Bom dia', 'Boa tarde', 'Boa noite', 'Até logo', 'Bom dia é usado até as 12h.'),
  q('Como se diz "Muito prazer" ao conhecer alguém?', 'Muito prazer em conhecê-lo(a)', '🤝', 'Identifique a cortesia', 'Muito prazer', 'Por favor', 'Com licença', 'De nada', '"Muito prazer" expressa cortesia ao ser apresentado.'),
  q('Qual saudação é usada a partir do meio-dia?', 'Boa tarde', '🌇', 'Identifique o período', 'Boa tarde', 'Bom dia', 'Boa noite', 'Alô', 'Boa tarde é usado após as 12h.'),
  q('Como se despede com a ideia de rever a pessoa em breve?', 'Até logo! / Até mais!', '👋', 'Escolha a despedida', 'Até logo!', 'Adeus para sempre', 'Nunca mais', 'Sem retorno', '"Até logo" ou "Até mais" é a despedida comum.'),
  q('Como pedir licença para passar educadamente?', 'Com licença', '🚪', 'Escolha a expressão', 'Com licença', 'Sai da frente', 'Obrigado', 'Por favor não', '"Com licença" pede passagem com respeito.'),
  q('Qual a forma feminina correta de agradecer em português?', 'Muito obrigada', '👩', 'Concordância de gênero', 'Muito obrigada', 'Muito obrigado', 'Muito grato ela', 'Obrigado feminina', 'Mulheres dizem "obrigada" e homens dizem "obrigado".'),
  q('Como se responde ao agradecimento "Muito obrigado"?', 'De nada / Por nada', '🙏', 'Escolha a resposta', 'De nada (ou Por nada / Não há de quê)', 'Por favor', 'Desculpe', 'Até logo', '"De nada" é a resposta cordial.'),
  q('Como pedir desculpas por um esbarrão acidental?', 'Desculpe! / Perdão!', '🙇', 'Identifique o pedido de desculpas', 'Desculpe!', 'Obrigado!', 'Alô!', 'Tudo bem!', 'Desculpe pede perdão por pequenos incidentes.'),
  q('Como se diz "Tchau" de forma informal no Brasil?', 'Tchau!', '👋', 'Identifique a saudação informal', 'Tchau!', 'Adeus formal', 'Com licença', 'Até a eternidade', 'Tchau (do italiano ciao) é universal no Brasil.')
]);

// 3
addUnit('pt-3', 'A1 · Iniciante', '🔢', 'Números, Dias & Calendário', 'Aprenda os dias da semana terminados em "-feira".', 25, [
  q('Como se chama o primeiro dia útil da semana no Brasil?', 'Segunda-feira', '📅', 'Escolha o dia útil', 'Segunda-feira', 'Terça-feira', 'Domingo', 'Sábado', 'Segunda-feira é o início da semana de trabalho.'),
  q('Qual dia antecede o sábado?', 'Sexta-feira', '🗓️', 'Identifique o dia', 'Sexta-feira', 'Quinta-feira', 'Quarta-feira', 'Domingo', 'Sexta-feira vem antes do sábado.'),
  q('Quantos dias formam o fim de semana?', 'Dois dias (sábado e domingo)', '🏖️', 'Identifique os dias de descanso', 'Sábado e domingo', 'Apenas o domingo', 'Sexta e sábado', 'Quinta a domingo', 'O fim de semana oficial é composto por sábado e domingo.'),
  q('Qual é o número "50" por extenso?', 'Cinquenta', '5️⃣0️⃣', 'Escolha o número', 'Cinquenta', 'Quarenta', 'Sessenta', 'Quinze', '50 é cinquenta.'),
  q('Qual é o número "100" em português?', 'Cem', '1️⃣0️⃣0️⃣', 'Identifique o numeral', 'Cem', 'Cento', 'Mil', 'Dez', '100 é cem (cento e um, cento e dois...).'),
  q('Como perguntar as horas em português?', 'Que horas são?', '⏰', 'Selecione a pergunta', 'Que horas são?', 'Quantos tempos tem?', 'Onde está o relógio?', 'Qual minuto vai?', '"Que horas são?" é a pergunta clássica.'),
  q('Como se diz "São três horas da tarde"?', 'São três horas da tarde', '🕒', 'Identifique a hora', 'São três horas da tarde', 'É três horas', 'Tem três horas tarde', 'Está três horas', 'A partir das 2h o verbo vai para o plural: "São três horas".'),
  q('Como se diz "É uma hora da tarde"?', 'É uma hora da tarde', '🕐', 'Identifique a hora singular', 'É uma hora da tarde', 'São uma hora', 'Tem uma hora', 'Está uma hora', 'À 1h usa-se o singular: "É uma hora".'),
  q('Qual é o mês das festas de São João e inverno no Brasil?', 'Junho', '🌽', 'Identifique o mês', 'Junho', 'Dezembro', 'Janeiro', 'Abril', 'Junho é o mês das tradicionais festas juninas.'),
  q('Qual é o último mês do ano?', 'Dezembro', '🎄', 'Identifique o mês', 'Dezembro', 'Novembro', 'Janeiro', 'Outubro', 'Dezembro é o décimo segundo mês do ano.')
]);

// 4
addUnit('pt-4', 'A1 · Iniciante', '☕', 'Na Padaria & Comidas Típicas', 'Peça pão na chapa, pingado e suco de laranja.', 25, [
  q('O que é um "pingado" em uma padaria brasileira?', 'Pingado', '☕', 'Identifique o pedido tradicional', 'Café com um pingo de leite', 'Suco de maracujá', 'Água com gás', 'Chá gelado', '"Pingado" é o clássico café com um pouco de leite servido no copo americano.'),
  q('O que é "Pão na chapa"?', 'Pão na chapa', '🍞', 'Identifique o lanche', 'Pão francês com manteiga tostado na chapa quente', 'Pão doce recheado', 'Pão com presunto cru', 'Torrada fria', 'Pão na chapa com manteiga é o café da manhã paulistano mais famoso.'),
  q('Qual iguaria mineira feita com polvilho e queijo é patrimônio nacional?', 'Pão de queijo', '🧀', 'Identifique o salgado', 'Pão de queijo', 'Coxinha', 'Pastel de feira', 'Bolo de cenoura', 'O pão de queijo é adorado em todo o Brasil.'),
  q('Qual salgado brasileiro em formato de gota é recheado com frango desfiado?', 'Coxinha', '🍗', 'Identifique o salgado', 'Coxinha', 'Kibe', 'Empada', 'Esfiha', 'A coxinha de frango é o salgado mais popular.'),
  q('Como pedir a conta ao garçom no Brasil?', 'A conta, por favor!', '🧾', 'Selecione a frase', 'A conta, por favor!', 'O preço agora!', 'Me cobre dinheiro!', 'Nota rápida!', '"A conta, por favor" é o pedido educado.'),
  q('Qual é o prato nacional brasileiro com feijão preto e carnes?', 'Feijoada', '🍲', 'Identifique o prato', 'Feijoada', 'Moqueca', 'Vatapá', 'Acarajé', 'A feijoada completa é o prato emblemático do Brasil.'),
  q('O que é "Açaí"?', 'Açaí', '🍇', 'Identifique o fruto da Amazônia', 'Fruto amazônico servido gelado na tigela com granola e frutas', 'Um tipo de refrigerante', 'Um peixe de rio', 'Uma sobremesa quente de forno', 'O açaí é muito consumido refrescante com granola.'),
  q('Como pedir água sem gás no restaurante?', 'Uma água sem gás, por favor', '💧', 'Escolha o pedido', 'Uma água sem gás, por favor', 'Água vazia', 'Água parada', 'Água sem ar', 'Usa-se "água sem gás".'),
  q('O que é um "Pastel de feira"?', 'Pastel de feira', '🥟', 'Identifique a comida de rua', 'Massa frita crocante recheada com carne, queijo ou palmito', 'Um bolo doce', 'Um pão italiano', 'Uma torta de liquidificador', 'O pastel frito na hora acompanhado de caldo de cana é tradição de feira.'),
  q('Qual sobremesa tradicional leva leite condensado, chocolate e granulado?', 'Brigadeiro', '🍫', 'Identifique o doce', 'Brigadeiro', 'Quindim', 'Pudim de leite', 'Cocada', 'O brigadeiro é o doce de aniversário mais clássico do Brasil.')
]);

// 5
addUnit('pt-5', 'A1 · Iniciante', '⚖️', 'Verbos Ser e Estar', 'Eu sou brasileiro vs Eu estou cansado.', 25, [
  q('Complete: "O Rio de Janeiro ___ uma cidade linda."', 'O Rio de Janeiro é uma cidade linda', '🏖️', 'Escolha ser ou estar', 'é', 'está', 'são', 'estão', 'Usa-se "é" (verbo ser) para qualidades permanentes.'),
  q('Complete com o estado temporário: "Eu ___ muito cansado hoje."', 'Eu estou muito cansado hoje', '🥱', 'Escolha ser ou estar', 'estou', 'sou', 'é', 'está', 'Para estados físicos ou emocionais transitórios usa-se "estar".'),
  q('Complete com a nacionalidade: "Nós ___ brasileiros."', 'Nós somos brasileiros', '🇧🇷', 'Identifique a conjugação', 'somos', 'estamos', 'são', 'é', 'Nacionalidade permanente usa "somos" (verbo ser).'),
  q('Complete com a localização física: "Meus amigos ___ na praia."', 'Estão na praia', '🏖️', 'Localização física', 'estão', 'são', 'é', 'está', 'Localização no espaço usa o verbo "estar": estão.'),
  q('Complete a profissão: "Ela ___ médica no hospital."', 'Ela é médica', '👩‍⚕️', 'Identifique o verbo de profissão', 'é', 'está', 'são', 'tem', 'Profissões habituais usam "é" (verbo ser).'),
  q('Complete o estado da porta: "A porta ___ aberta."', 'A porta está aberta', '🚪', 'Estado resultante', 'está', 'é', 'são', 'fica', 'Estado transitório usa "está".'),
  q('Qual a forma do verbo ser para "Eu" no presente?', 'Eu sou', '👤', 'Conjugue o verbo ser', 'sou', 'estou', 'é', 'somos', 'Eu sou professor.'),
  q('Qual a forma do verbo estar para "Eles" no presente?', 'Eles estão', '👥', 'Conjugue estar', 'estão', 'são', 'está', 'estamos', 'Eles estão felizes.'),
  q('Qual a diferença entre "Ele é alegre" e "Ele está alegre"?', 'É alegre vs Está alegre', '😊', 'Interprete a nuance', '"É alegre" é traço de personalidade; "Está alegre" é momento transitório', 'Não há diferença', '"Está alegre" é para sempre', '"É alegre" é tristeza', 'Ser define personalidade duradoura; estar expressa o momento passageiro.'),
  q('Complete: "O almoço ___ delicioso hoje!"', 'O almoço está delicioso hoje', '🍲', 'Avaliação da comida', 'está', 'é', 'são', 'foi permanente', 'Avaliação da refeição do dia usa "está delicioso".')
]);

// 6 to 20 helper
console.log('Generating remaining Portuguese units...');

addUnit('pt-6', 'A2 · Básico', '👨‍👩‍👧', 'Família & Pessoas Queridas', 'Pai, mãe, irmãos, filhos, tios e primos.', 25, [
  q('Como se chama o filho do seu tio?', 'Primo', '👦', 'Identifique o parentesco', 'Primo', 'Sobrinho', 'Irmão', 'Padrinho', 'O filho dos tios é seu primo.'),
  q('Como se chama a mãe do seu pai?', 'Avó', '👵', 'Identifique o parentesco', 'Avó', 'Tia', 'Sogra', 'Madrinha', 'A mãe dos pais é sua avó.'),
  q('O que são "Meus pais"?', 'Meus pais', '👨‍👩‍👧', 'Identifique o significado', 'Meu pai e minha mãe juntos', 'Meus parentes distantes', 'Meus tios', 'Meus irmãos', '"Meus pais" refere-se ao pai e mãe.'),
  q('Como se chama a filha da sua irmã?', 'Sobrinha', '👧', 'Identifique o parentesco', 'Sobrinha', 'Prima', 'Enteada', 'Afilhada', 'A filha do irmão ou irmã é sua sobrinha.'),
  q('O que significa "Parente" em português?', 'Parentes', '👥', 'Evite falso amigo com parents', 'Membros da família em geral (tios, primos, avós)', 'Apenas pai e mãe', 'Amigos de infância', 'Vizinhos de rua', 'No Brasil "parentes" abrange toda a família extensa.'),
  q('Como se chama o marido da sua filha?', 'Genro', '👨', 'Identifique o parentesco por afinidade', 'Genro', 'Nora', 'Cunhado', 'Sogro', 'O marido da filha é o genro.'),
  q('Como se chama a esposa do seu filho?', 'Nora', '👩', 'Identifique o parentesco por afinidade', 'Nora', 'Genro', 'Cunhada', 'Sogra', 'A esposa do filho é a nora.'),
  q('Como se chama o irmão do seu cônjuge?', 'Cunhado', '🧔', 'Identifique o parentesco', 'Cunhado', 'Primo', 'Genro', 'Padrasto', 'O irmão da esposa ou do marido é o cunhado.'),
  q('Como se chama o pai da sua esposa?', 'Sogro', '👴', 'Identifique o parentesco', 'Sogro', 'Tio', 'Padrinho', 'Cunhado', 'O pai do cônjuge é o sogro.'),
  q('Como se diz "Ele é meu irmão mais velho"?', 'Irmão mais velho', '👦', 'Identifique a idade relativa', 'Meu irmão mais velho', 'Meu irmão maior', 'Meu irmão grande', 'Meu irmão sênior', 'Usa-se "mais velho" para idade.')
]);

addUnit('pt-7', 'A2 · Básico', '⏰', 'Rotina Cotidiana & Horários', 'Acordar, tomar banho, trabalhar e pegar trânsito.', 30, [
  q('Complete: "Eu sempre ___ café antes de trabalhar."', 'Eu sempre tomo café antes de trabalhar', '☕', 'Conjugue o verbo tomar', 'tomo', 'toma', 'tomamos', 'tomando', '1ª pessoa do singular: Eu tomo.'),
  q('Complete a rotina: "Ela ___ cedo todos os dias."', 'Ela acorda cedo', '🌅', 'Conjugue acordar', 'acorda', 'acordo', 'acordam', 'acordamos', 'Ela acorda com a terminação -a.'),
  q('Como dizer "Eu pego trânsito pesado para ir ao trabalho"?', 'Pego trânsito', '🚗', 'Expressão do dia a dia', 'Pego trânsito pesado', 'Tomo engarrafamento', 'Fico parado na rua', 'Corro de carro', '"Pegar trânsito" é a expressão mais usada nas cidades brasileiras.'),
  q('A que horas costuma ser o almoço no Brasil?', 'Ao meio-dia ou 13h', '🍽️', 'Identifique o horário comum', 'Entre 12h e 13h', 'Às 16h', 'Às 9h da manhã', 'Às 21h', 'O almoço brasileiro é a refeição principal entre 12h e 13h30.'),
  q('O que significa o advérbio "Sempre"?', 'Sempre', '🔄', 'Identifique a frequência', 'Em todas as ocasiões / continuamente', 'Nunca', 'Raramente', 'Às vezes', 'Sempre expressa constância total.'),
  q('O que significa "De vez em quando"?', 'De vez em quando', '⏳', 'Identifique a frequência', 'Ocasionalmente / às vezes', 'Todos os dias sem falta', 'Nunca mais', 'Sempre', '"De vez em quando" significa ocasionalmente.'),
  q('Complete com o verbo reflexivo: "Eu ___ às 23 horas."', 'Eu me deito às 23 horas', '🛏️', 'Conjugue deitar-se', 'me deito', 'deito-me formal', 'te deitas', 'se deita', 'Usa-se "eu me deito" para ir dormir.'),
  q('Complete com plural: "Nós ___ na academia à noite."', 'Nós treinamos na academia', '🏋️', 'Conjugue treinar', 'treinamos', 'treina', 'treinam', 'treinando', '1ª pessoa do plural: Nós treinamos.'),
  q('O que significa "Bater o ponto" no trabalho?', 'Bater o ponto', '⏱️', 'Identifique a expressão profissional', 'Registrar o horário de entrada ou saída no trabalho', 'Quebrar o relógio da parede', 'Terminar o café', 'Fazer hora extra', '"Bater o ponto" é registrar o ponto eletrônico.'),
  q('Como dizer "Preciso descansar no fim de semana"?', 'Preciso descansar', '🛋️', 'Selecione a frase', 'Preciso descansar no fim de semana', 'Quero quebrar o sábado', 'Vou dormir para sempre', 'Preciso cansar', 'Descansar é repor as energias.')
]);

addUnit('pt-8', 'A2 · Básico', '🗺️', 'Na Cidade & Pedindo Informações', 'Estação de metrô, ponto de ônibus e vire à direita.', 30, [
  q('Como perguntar onde pegar o transporte público coletivo?', 'Onde fica o ponto de ônibus?', '🚌', 'Escolha a pergunta', 'Onde fica o ponto de ônibus?', 'Qual é o preço do avião?', 'Como vai a rua?', 'Onde corre o trem?', '"Ponto de ônibus" é o local de embarque coletivo nas ruas.'),
  q('Como indicar que a pessoa deve continuar em linha reta?', 'Siga em frente', '⬆️', 'Identifique a direção', 'Siga em frente / Vá reto', 'Vire à direita', 'Dê meia volta', 'Pare na esquina', '"Siga em frente" orienta a continuar sem virar.'),
  q('O que significa "Vire à esquerda"?', 'Vire à esquerda', '⬅️', 'Identifique o sentido', 'Fazer a curva para a esquerda', 'Virar para a direita', 'Seguir reto', 'Entrar na contramão', 'Vire à esquerda indica o lado esquerdo.'),
  q('O que é "A calçada"?', 'A calçada', '🚶', 'Identifique o passeio público', 'Espaço reservado aos pedestres ao lado da rua', 'A pista de alta velocidade', 'O canteiro de flores', 'A garagem subterrânea', 'A calçada é o passeio de pedestres.'),
  q('Como perguntar a distância de um ponto turístico?', 'É muito longe daqui?', '📍', 'Selecione a pergunta', 'É muito longe daqui?', 'Tem muitos metros agora?', 'Onde vai a distância?', 'Como é a quilometragem?', '"É longe daqui?" afere a distância física.'),
  q('O que é um "Quarteirão" ou "Uma quadra"?', 'Uma quadra', '🏙️', 'Identifique a unidade urbana', 'Espaço urbano delimitado por quatro ruas que se cruzam', 'Um prédio comercial', 'Uma praça redonda', 'Um viaduto alto', 'Uma quadra ou quarteirão delimita o bloco de ruas.'),
  q('O que é "A faixa de pedestres"?', 'Faixa de pedestres', '🚶‍♂️', 'Identifique a sinalização', 'Pintura listrada no asfalto para travessia segura de pessoas', 'Pista exclusiva de motos', 'Ciclovia de bicicletas', 'Estacionamento de ônibus', 'A faixa de pedestres garante prioridade de travessia.'),
  q('Como se chama o sinal luminoso de trânsito em diferentes estados do Brasil?', 'Semáforo / Sinal / Farol', '🚦', 'Identifique os sinônimos regionais', 'Semáforo, farol (em SP) ou sinal (no RJ)', 'Luz de rua', 'Luminária urbana', 'Radar', 'Semáforo, sinal ou farol são designações regionais válidas.'),
  q('O que é "O metrô"?', 'O metrô', '🚇', 'Identifique o transporte', 'Transporte ferroviário urbano subterrâneo de alta capacidade', 'Ônibus elétrico de bairro', 'Táxi de aplicativo', 'Barca marítima', 'O metrô liga bairros rapidamente.'),
  q('Como pedir uma corrida de táxi ou aplicativo?', 'Chamar um carro por aplicativo', '🚕', 'Identifique a expressão moderna', 'Pedir um carro por aplicativo / Chamar um táxi', 'Ligar para o trânsito', 'Alugar uma van', 'Pegar carona na estrada', 'Chamar um carro por app é o método mais popular.')
]);

addUnit('pt-9', 'A2 · Básico', '🛒', 'Na Feira Livre & Supermercado', 'Compre frutas tropicais e saiba quanto custa a dúzia.', 25, [
  q('Quantas unidades tem "uma dúzia de laranjas"?', 'Uma dúzia', '🍊', 'Selecione a quantidade exata', '12 unidades', '10 unidades', '6 unidades', '20 unidades', 'Uma dúzia corresponde a exatamente 12 unidades.'),
  q('Quantas unidades tem "meia dúzia de ovos"?', 'Meia dúzia', '🥚', 'Identifique a quantidade', '6 unidades', '12 unidades', '8 unidades', '5 unidades', 'Meia dúzia são 6 unidades.'),
  q('Qual fruta tropical brasileira com coroa é famosa pelo sabor agridoce?', 'Abacaxi', '🍍', 'Identifique a fruta', 'Abacaxi', 'Melão', 'Banana', 'Laranja', 'O abacaxi é conhecido pela casca e coroa verde.'),
  q('O que significa pedir "O troco, por favor"?', 'O troco', '💵', 'Identifique o termo financeiro', 'O dinheiro devolvido quando se paga a mais que o valor exato', 'O recibo de papel', 'A sacola de plástico', 'Um brinde do feirante', 'Troco é a diferença monetária devolvida ao cliente.'),
  q('O que é "Um quilo de carne"?', 'Um quilo', '🥩', 'Identifique o peso', '1.000 gramas de peso', '500 gramas', '100 gramas', '2.000 gramas', '1 quilo (kg) equivale a 1.000 gramas.'),
  q('O que o cliente pede com: "Moço, me dá um quilo de tomate bem maduro"?', 'Tomate maduro', '🍅', 'Interprete o pedido', 'Tomates prontos para consumo imediato / vermelhos', 'Tomates verdes para plantar', 'Massa de tomate em lata', 'Suco de tomate', 'Maduro significa pronto para comer.'),
  q('O que significa "O carrinho de compras"?', 'Carrinho de compras', '🛒', 'Identifique o item', 'Veículo com rodas para transportar produtos pelo supermercado', 'O caminhão de entrega', 'A cesta de palha', 'A sacola de papel', 'Carrinho de compras serve para carregar as compras.'),
  q('Como perguntar o preço de uma mercadoria?', 'Quanto custa este quilo?', '🏷️', 'Selecione a pergunta', 'Quanto custa este quilo?', 'Qual é a riqueza disso?', 'Como vale o produto?', 'Onde vai o dinheiro?', '"Quanto custa...?" é a pergunta comercial padrão.'),
  q('O que significa "Pagar no débito"?', 'Cartão de débito', '💳', 'Identifique a forma de pagamento bancária', 'Descontar o valor imediatamente do saldo da conta corrente', 'Parcelar a compra para o próximo mês', 'Pagar em notas de papel', 'Fazer fiado na caderneta', 'Cartão de débito desconta o dinheiro na hora.'),
  q('O que é a "Fila do caixa preferencial"?', 'Caixa preferencial', '👵', 'Identifique o atendimento prioritário', 'Atendimento prioritário para idosos, gestantes e pessoas com deficiência', 'Fila para quem compra rápido', 'Caixa exclusivo de funcionários', 'Fila de compras caras', 'O caixa preferencial atende prioritariamente quem tem direito por lei.')
]);

addUnit('pt-10', 'A2 · Básico', '🏠', 'A Casa Brasileira & Cômodos', 'Sala de estar, varanda, cozinha e área de serviço.', 25, [
  q('Onde se costuma lavar e secar roupas em uma residência brasileira?', 'Área de serviço', '🧺', 'Identifique o cômodo', 'Na área de serviço / lavanderia', 'Na sala de jantar', 'No quarto de casal', 'Na varanda da frente', 'A área de serviço é onde fica o tanque e a máquina de lavar.'),
  q('Qual é o cômodo onde se recebem as visitas para conversar?', 'Sala de estar', '🛋️', 'Identifique o espaço social', 'Sala de estar', 'Cozinha', 'Despensa', 'Sótão', 'A sala de estar é o cômodo social de entrada.'),
  q('Onde a família se reúne para dormir?', 'No quarto', '🛏️', 'Identifique o cômodo de repouso', 'No quarto / dormitório', 'Na cozinha', 'Na garagem', 'No quintal', 'O quarto é o cômodo de dormir.'),
  q('O que é o "Quintal"?', 'Quintal', '🏡', 'Identifique a área externa', 'Espaço aberto aos fundos da casa com terra, grama ou piso', 'O corredor do prédio', 'A porta principal', 'O teto da casa', 'O quintal é o terreno atrás ou ao redor da casa.'),
  q('O que significa "Mora de aluguel"?', 'Morar de aluguel', '🔑', 'Identifique o regime de moradia', 'Pagar um valor mensal ao proprietário pelo uso do imóvel', 'Ser dono da casa quitada', 'Morar em hotel grátis', 'Invadir um terreno', 'Aluguel é o pagamento mensal pela locação.'),
  q('O que é "A portaria" de um prédio residencial?', 'A portaria', '🏢', 'Identifique a entrada do edifício', 'Local de acesso com porteiro para controle de entrada e correspondências', 'A garagem de carros', 'O salão de festas', 'A caixa d’água', 'A portaria controla a segurança e o acesso.'),
  q('O que é "A pia"?', 'A pia', '🚰', 'Identifique o equipamento hidrossanitário', 'Bancada com torneira para lavar louça ou escovar os dentes', 'A geladeira', 'O fogão a gás', 'O forno elétrico', 'A pia da cozinha ou banheiro serve para lavagem com água.'),
  q('O que significa "A garagem"?', 'A garagem', '🚗', 'Identifique o espaço', 'Local coberto ou descoberto para guardar automóveis', 'O jardim de flores', 'A piscina', 'A churrasqueira', 'Garagem é onde se estacionam os veículos.'),
  q('O que é uma "Churrasqueira"?', 'Churrasqueira', '🥩', 'Identifique o espaço de lazer culinário', 'Equipamento ou espaço gourmet para assar carnes na brasa', 'Uma lareira de aquecer', 'Um tipo de fogão a lenha', 'Um armário de pratos', 'A churrasqueira é ponto de encontro nos fins de semana brasileiros.'),
  q('Como dizer "Vou trancar a porta com a chave"?', 'Trancar a porta', '🔐', 'Identifique a ação de segurança', 'Trancar a porta com a chave', 'Abrir a porta toda', 'Pintar a madeira', 'Limpar o trinco', '"Trancar a porta" é fechar com chave para segurança.')
]);

// 11 to 20
addUnit('pt-11', 'B1 · Intermediário', '📜', 'Passado Perfeito vs Imperfeito', 'Ontem eu fui ao cinema vs Antigamente eu morava.', 35, [
  q('Para uma ação pontual e concluída ontem, usamos:', 'Ontem eu comprei um livro', '📖', 'Selecione o tempo certo', 'Pretérito Perfeito ("comprei")', 'Pretérito Imperfeito ("comprava")', 'Futuro do presente', 'Gerúndio', 'Pretérito Perfeito expressa ação concluída em momento definido.'),
  q('Para descrever um hábito contínuo que se repetia na infância, usamos:', 'Eu brincava na rua', '🧒', 'Identifique o tempo do hábito', 'Pretérito Imperfeito ("brincava")', 'Pretérito Perfeito ("brinquei")', 'Futuro', 'Presente', 'O Pretérito Imperfeito descreve hábitos passados.'),
  q('Qual o pretérito perfeito de "ir" para a 1ª pessoa (eu)?', 'Eu fui', '🚶‍♂️', 'Conjugue o verbo irregular ir', 'Eu fui', 'Eu ia', 'Eu fora', 'Eu fizesse', 'Ontem eu fui ao mercado.'),
  q('Qual o pretérito imperfeito de "ter" para "nós"?', 'Nós tínhamos', '💼', 'Conjugue ter no imperfeito', 'Tínhamos', 'Tivemos', 'Teremos', 'Temos', 'Antigamente nós tínhamos muito tempo livre.'),
  q('Complete com ação pontual: "Na semana passada eu ___ meu carro."', 'Vendi meu carro', '🚗', 'Conjugue vender no perfeito', 'vendi', 'vendia', 'vendera', 'vendo', 'Ação acabada na semana passada: vendi.'),
  q('Complete o cenário de fundo: "___ muito calor quando cheguei."', 'Fazia muito calor', '☀️', 'Descreva o tempo atmosférico no passado', 'Fazia', 'Fez', 'Fará', 'Faça', 'Descrições de clima de fundo usam imperfeito: fazia muito calor.'),
  q('Qual o pretérito perfeito irregular de "fazer" para "ele"?', 'Ele fez', '✍️', 'Conjugue fazer', 'fez', 'fazia', 'fizer', 'faça', 'Ontem ele fez um bolo gostoso.'),
  q('Complete com a combinação temporal: "Eu ___ quando o telefone tocou."', 'Eu dormia quando o telefone tocou', '📞', 'Ação em andamento interrompida', 'dormia', 'dormi', 'dormirei', 'durmo', 'Ação contínua (dormia) interrompida por ação pontual (tocou).'),
  q('Qual a terminação regular de verbos da 1ª conjugação (-ar) no imperfeito?', 'Cantava, estudava', '🎶', 'Identifique a terminação', '-ava, -ávamos, -avam', '-ei, -ou, -amos', '-ia, -íamos, -iam', '-ara, -áramos', 'Verbos em -ar fazem imperfeito em -ava.'),
  q('O que a frase expressa: "Antigamente nós viajávamos todo verão"?', 'Hábito passado', '🏖️', 'Interprete a frase', 'Um hábito costumeiro no passado que não ocorre mais', 'Uma viagem que acontecerá no próximo mês', 'Uma dúvida', 'Um arrependimento recente', 'Expressa costume repetitivo de épocas passadas.')
]);

addUnit('pt-12', 'B1 · Intermediário', '✈️', 'Viagens pelo Brasil & Turismo', 'Pousadas, praias do Nordeste, passagens e passeios.', 30, [
  q('Como se chama uma acomodação charmosa e aconchegante típica do litoral?', 'Pousada', '🏖️', 'Identifique o meio de hospedagem', 'Pousada', 'Barraca de praia', 'República de estudantes', 'Albergue público', '"Pousada" é a hospedagem típica e aconchegante no Brasil.'),
  q('O que significa fazer uma "viagem bate e volta"?', 'Bate e volta', '🚗', 'Identifique o tipo de passeio curto', 'Ir e retornar no mesmo dia sem pernoitar fora', 'Uma viagem de volta ao mundo de navio', 'Um voo com cinco conexões', 'Ficar um mês acampado', 'Bate e volta é a viagem de um único dia.'),
  q('Qual estado brasileiro abriga as famosas cidades históricas de Ouro Preto e Tiradentes?', 'Minas Gerais', '⛪', 'Identifique o estado histórico', 'Minas Gerais', 'Bahia', 'Rio Grande do Sul', 'Amazonas', 'Minas Gerais concentra o rico patrimônio barroco colonial.'),
  q('O que são as "Cataratas do Iguaçu"?', 'Cataratas do Iguaçu', '🌊', 'Identifique a maravilha natural', 'Conjunto monumental de quedas d’água no Paraná na fronteira com a Argentina', 'Uma praia de corais no Nordeste', 'Uma montanha na serra gaúcha', 'Um rio no Pantanal', 'As Cataratas do Iguaçu são patrimônio natural mundial.'),
  q('Como se chama o bilhete que autoriza o embarque em ônibus intermunicipais?', 'Passagem de ônibus', '🎫', 'Identifique o documento', 'Passagem de ônibus', 'Boleto bancário', 'Cartão cidadão', 'Protocolo de viagem', 'Passagem de ônibus é o bilhete de viagem.'),
  q('Qual é o bioma úmido famoso pela riquíssima fauna no Centro-Oeste brasileiro?', 'Pantanal', '🐊', 'Identifique a região de ecoturismo', 'Pantanal', 'Caatinga', 'Pampa', 'Mata Atlântica', 'O Pantanal é o maior santuário de vida selvagem úmida do mundo.'),
  q('O que significa comprar uma passagem aérea "na baixa temporada"?', 'Baixa temporada', '📉', 'Identifique a época de viagens', 'Período fora de férias escolares com tarifas mais baratas e destinos vazios', 'Época de Natal e Ano Novo lotada', 'Mês de julho com preços no auge', 'Feriado de Carnaval', 'Baixa temporada tem preços menores e menos turistas.'),
  q('Como se chama o traslado que leva turistas do aeroporto ao hotel?', 'Traslado / Transfer', '🚐', 'Identifique o transporte', 'Transfer (ou traslado)', 'Linha expressa', 'Escolta', 'Carona solidária', 'Transfer é o transporte receptivo entre aeroporto e hotel.'),
  q('Qual arquipélago pernambucano é santuário ecológico e famoso pelas águas cristalinas?', 'Fernando de Noronha', '🐬', 'Identifique a ilha paradisíaca', 'Fernando de Noronha', 'Ilhabela', 'Ilha do Mel', 'Marajó', 'Fernando de Noronha é um dos destinos mais exclusivos e preservados do país.'),
  q('Como dizer "Gostaria de fechar um pacote turístico para o feriado"?', 'Pacote turístico', '🌴', 'Identifique a contratação de viagem', 'Pacote turístico (inclui voo, hotel e passeios)', 'Caixa de viagem', 'Mala de turismo', 'Contrato de férias', 'Pacote turístico reúne passagens, hospedagem e passeios em um valor único.')
]);

addUnit('pt-13', 'B1 · Intermediário', '🩺', 'No Posto de Saúde, Remédios & Farmácia', 'Explique dores, peça remédios e tire dúvidas médicas.', 30, [
  q('Como dizer "Estou com febre e enjoo"?', 'Estou com febre e enjoo', '🤒', 'Escolha a frase médica', 'Estou com febre e enjoo', 'Meu estômago quebrou', 'Tenho calor na barriga', 'Sinto dor de braço', '"Enjoo" é a sensação de náusea.'),
  q('O que é o "SUS" no Brasil?', 'SUS', '🏥', 'Identifique o sistema público', 'Sistema Único de Saúde (atendimento médico público e gratuito garantido por lei)', 'Plano de saúde privado caro', 'Associação de médicos cirurgiões', 'Farmácia de manipulação', 'O SUS é o sistema público de saúde do Brasil.'),
  q('O que significa "Remédio genérico"?', 'Remédio genérico', '💊', 'Identifique o tipo de medicamento', 'Medicamento com o mesmo princípio ativo da marca de referência, com tarja amarela e preço menor', 'Remédio falsificado ilegal', 'Remédio natural de ervas', 'Cosmético hidratante', 'Genéricos têm a mesma eficácia comprovada por lei e preço reduzido.'),
  q('O que é uma "Receita médica"?', 'Receita médica', '📄', 'Identifique o documento profissional', 'Prescrição assinada pelo médico para compra de medicamentos controlados', 'Fatura do hospital', 'Manual de primeiros socorros', 'Atestado de vacinação', 'A receita médica autoriza a dispensa do medicamento.'),
  q('Como expressar que você torceu o pé?', 'Torci o tornozelo', '🦶', 'Identifique a lesão ortopédica', 'Torci o tornozelo', 'Quebrei o sapato', 'Ralei a unha', 'Cortei o joelho', 'Torcer o tornozelo é a entorse no pé.'),
  q('O que é um "Pronto-Socorro" (PS) ou "UPA"?', 'Pronto-Socorro / UPA', '🚨', 'Identifique a unidade de emergência', 'Unidade médica de urgência e emergência aberta 24 horas', 'Laboratório de exames agendados', 'Clínica de estética', 'Consultório de terapia', 'UPA e Pronto-Socorro atendem casos graves e imediatos.'),
  q('Como se chama o papel que o médico emite para justificar a falta ao trabalho por doença?', 'Atestado médico', '📋', 'Identifique o documento de abono', 'Atestado médico', 'Receita médica', 'Prontuário', 'Laudo de alta', 'O atestado médico abona as faltas no trabalho decorrentes de enfermidade.'),
  q('O que é "Dor de garganta"?', 'Dor de garganta', '🧣', 'Identifique o sintoma comum de resfriado', 'Inflamação ou incômodo ao engolir na região da laringe/faringe', 'Dor de estômago', 'Dor nos ouvidos', 'Dor nas costas', 'Dor de garganta acompanha resfriados e gripes.'),
  q('O que é um "Curativo" com micropore ou gaze?', 'Curativo', '🩹', 'Identifique o cuidado de enfermagem', 'Proteção estéril aplicada sobre ferimentos e cortes', 'Uma injeção na veia', 'Uma cirurgia plástica', 'Um gesso no braço', 'Curativo protege feridas contra infecções.'),
  q('Como dizer "Tome este remédio de oito em oito horas"?', 'De 8 em 8 horas', '⏰', 'Identifique a posologia', 'Tomar a cada intervalo regular de 8 horas', 'Tomar oito pílulas de uma vez', 'Tomar só às 8 da manhã', 'Tomar durante 8 dias seguidos', 'Indica o intervalo de dosagem do medicamento ao longo do dia.')
]);

addUnit('pt-14', 'B1 · Intermediário', '💼', 'Mercado de Trabalho & Entrevistas', 'Fale de sua experiência profissional e currículo.', 35, [
  q('O documento que reúne sua formação e histórico profissional é o:', 'Currículo', '📄', 'Identifique o documento', 'Currículo (CV)', 'Contrato social', 'Crachá', 'Recibo de pagamento', 'O currículo resume a carreira do candidato.'),
  q('O que é a "Carteira de Trabalho" (CTPS) no Brasil?', 'Carteira de Trabalho', '📘', 'Identifique o documento oficial', 'Documento que registra formalmente o contrato de trabalho e direitos trabalhistas (CLT)', 'Cartão de crédito da empresa', 'Crachá de entrada', 'Título de eleitor', 'A Carteira de Trabalho oficializa os direitos sob regime CLT.'),
  q('O que significa trabalhar sob regime "CLT"?', 'CLT', '⚖️', 'Identifique a legislação laboral', 'Consolidação das Leis do Trabalho (com direitos a férias, 13º salário e FGTS)', 'Trabalho temporário informal sem garantias', 'Empresa individual terceirizada', 'Trabalho voluntário', 'A CLT regulamenta os direitos do trabalhador formal.'),
  q('O que é o "13º salário" (décimo terceiro)?', '13º salário', '💰', 'Identifique a gratificação de fim de ano', 'Gratificação natalina equivalente a um mês extra de salário paga no fim do ano', 'Um imposto cobrado em dobro', 'Uma dedução no salário', 'Um adiantamento para férias', 'O décimo terceiro é garantido por lei a empregados com carteira assinada.'),
  q('O que o recrutador quer saber com: "Quais são seus pontos fortes e fracos?"', 'Pontos fortes e fracos', '🎯', 'Interprete a pergunta clássica', 'Suas principais competências técnicas/comportamentais e áreas de melhoria', 'Seus defeitos familiares', 'Quantos quilos você levanta', 'Suas dívidas bancárias', 'Avalia o autoconhecimento e a adequação do profissional ao cargo.'),
  q('O que significa "Trabalho remoto" ou "Home office"?', 'Home office', '💻', 'Identifique a modalidade moderna', 'Trabalhar a distância a partir de casa utilizando computador e internet', 'Morar dentro da sede da empresa', 'Trabalho na rua com vendas', 'Trabalho braçal externo', 'Home office permite trabalhar de casa.'),
  q('O que é o "FGTS" (Fundo de Garantia do Tempo de Serviço)?', 'FGTS', '🏦', 'Identifique o fundo de proteção', 'Depósito mensal de 8% feito pela empresa em conta da Caixa que o trabalhador saca na demissão sem justa causa', 'Imposto sindical obrigatório', 'Seguro de saúde', 'Plano de aposentadoria privada', 'O FGTS protege o trabalhador demitido sem justa causa.'),
  q('O que significa "Pedir demissão"?', 'Pedir demissão', '🚪', 'Identifique a iniciativa do desligamento', 'O próprio funcionário decide se desligar espontaneamente da empresa', 'A empresa demite por corte de custos', 'A empresa fecha as portas', 'O funcionário ganha uma promoção', 'Pedir demissão é iniciativa do próprio empregado.'),
  q('Como se chama o período de descanso remunerado após um ano de trabalho?', 'Férias', '🏖️', 'Identifique o direito de descanso', 'Férias regulamentares (de 30 dias)', 'Licença paternidade', 'Descanso semanal remunerado', 'Atestado de folga', 'O trabalhador tem direito a 30 dias de férias após 12 meses de trabalho.'),
  q('O que significa "Fazer networking"?', 'Networking', '🤝', 'Identifique a prática profissional', 'Construir e cultivar uma rede de contatos profissionais e colaborativos', 'Trabalhar com cabos de rede de computadores', 'Fazer fofoca de escritório', 'Procurar vagas em jornais antigos', 'Networking é a rede de relacionamentos no mercado.')
]);

addUnit('pt-15', 'B1 · Intermediário', '👔', 'Pronomes de Tratamento & Formalidade', 'Você vs O Senhor / A Senhora no dia a dia.', 30, [
  q('Para falar com respeito com uma pessoa idosa no Brasil, usamos:', 'O senhor ou a senhora', '👵', 'Escolha o pronome cordial', 'O senhor / A senhora', 'Você cara', 'Tu mano', 'O cidadão', '"O senhor / A senhora" demonstra cortesia e respeito.'),
  q('Qual pronome de 2ª pessoa é amplamente utilizado no dia a dia em quase todo o Brasil?', 'Você', '👥', 'Identifique o pronome comum', 'Você (conjugado na 3ª pessoa do singular)', 'Vós', 'Vossa Mercê', 'Vossa Excelência', '"Você" é o pronome padrão de tratamento informal e cotidiano.'),
  q('Em regiões do Sul e Nordeste do Brasil, qual pronome também é muito frequente?', 'Tu', '🧉', 'Identifique a variante regional', 'Tu (frequentemente conjugado no presente informal)', 'Vós', 'Sua Senhoria', 'Vossa Graça', '"Tu" é muito vivo no Rio Grande do Sul, Santa Catarina, Maranhão e Pará.'),
  q('Qual pronome de tratamento formal é reservado a autoridades como juízes e ministros?', 'Vossa Excelência', '⚖️', 'Identifique a fórmula oficial', 'Vossa Excelência', 'Vossa Senhoria', 'Você Excelentíssimo', 'O Senhor Doutor', 'Vossa Excelência é o tratamento solene para altas autoridades.'),
  q('Qual a forma abreviada escrita de "Senhor" e "Senhora"?', 'Sr. e Sra.', '✍️', 'Identifique as abreviações oficiais', 'Sr. e Sra.', 'Snr. e Snra.', 'Sh. e Sha.', 'Srº e Srª apenas', 'Sr. e Sra. são as abreviaturas consagradas.'),
  q('Como se trata informalmente um amigo próximo em tom carinhoso no Brasil?', 'Você / Amigo / Cara / Mano', '🤝', 'Identifique o vocativo coloquial', 'Cara, mano, amigo, você', 'Vossa Senhoria', 'O Nobre Cidadão', 'Vossa Mercê', 'Expressões coloquiais usadas entre amigos.'),
  q('Como um atendente educado em loja costuma se dirigir ao cliente?', 'Pois não, senhor(a), em que posso ajudar?', '🏬', 'Selecione a abordagem polida', 'Pois não, senhor(a), como posso ajudar?', 'Ei você, quer o quê?', 'O que manda o camarada?', 'Diga logo o pedido!', 'Fórmula clássica de atendimento cordial no comércio.'),
  q('Qual pronome de tratamento é historicamente utilizado para reitores de universidades?', 'Vossa Magnificência', '🎓', 'Identifique o tratamento acadêmico', 'Vossa Magnificência', 'Vossa Reverendíssima', 'Vossa Alteza', 'Vossa Santidade', 'Reitores recebem o tratamento solene de Vossa Magnificência.'),
  q('O que expressa o uso de "Doutor" para advogados ou médicos no Brasil?', 'Doutor', '🩺', 'Identifique o costume cultural', 'Tratamento tradicional de deferência social consagrado pelo uso', 'Apenas quem tem tese de doutorado concluída', 'Uma exigência do código penal', 'Uma ofensa irônica', 'No Brasil é costume tradicional chamar médicos e advogados de "doutor".'),
  q('Em cartas formais e comerciais, como se inicia o cabeçalho?', 'Prezado(a) Senhor(a)', '✉️', 'Identifique o vocativo epistolar', 'Prezado(a) Senhor(a)', 'Oi galera', 'Querido amigo', 'Atenção todos', '"Prezado(a)" é o início formal adequado para correspondências.')
]);

addUnit('pt-16', 'B1 · Intermediário', '🌧️', 'O Modo Subjuntivo no Cotidiano', 'Tomara que dê tudo certo e se eu pudesse.', 35, [
  q('Complete: "Tomara que amanhã não ___."', 'Tomara que amanhã não chova', '☔', 'Conjugue no presente do subjuntivo', 'chova', 'chove', 'choverá', 'chovesse', '"Tomara que" exige o presente do subjuntivo: chova.'),
  q('Complete o desejo: "Espero que você ___ muito feliz."', 'Espero que você seja feliz', '🌟', 'Conjugue o verbo ser no subjuntivo', 'seja', 'é', 'será', 'fosse', 'Esperar que exige o presente do subjuntivo: seja.'),
  q('Complete a 2ª condicional: "Se eu ___ dinheiro, viajaria agora."', 'Se eu tivesse dinheiro', '💰', 'Conjugue ter no pretérito imperfeito do subjuntivo', 'tivesse', 'tenho', 'teria', 'tiver', 'A condição com se e hipótese usa o pretérito imperfeito do subjuntivo: tivesse.'),
  q('Complete a hipótese no futuro: "Quando você ___ em casa, me ligue."', 'Quando você chegar em casa', '🏠', 'Conjugue no futuro do subjuntivo', 'chegar', 'chega', 'chegasse', 'chegou', '"Quando" projetado no futuro exige o futuro do subjuntivo: chegar.'),
  q('Complete a dúvida: "Não acho que ele ___ a verdade."', 'Não acho que ele fale a verdade', '🤫', 'Conjugue falar', 'fale', 'fala', 'falou', 'falará', 'Expressões de incerteza negativa exigem subjuntivo: fale.'),
  q('Complete com concessão: "Embora ___ frio, fomos à praia."', 'Embora fizesse frio', '🥶', 'Conjugue fazer no subjuntivo', 'fizesse', 'fazia', 'fez', 'fará', '"Embora" exige modo subjuntivo.'),
  q('Complete com ordem polida: "É importante que nós ___ a lição."', 'É importante que nós façamos a lição', '📚', 'Conjugue fazer na 1ª pessoa do plural', 'façamos', 'fazemos', 'fizeram', 'faríamos', 'Estruturas impessoais exigem presente do subjuntivo: façamos.'),
  q('Complete: "Se você ___ comigo, não se perderia."', 'Se você viesse comigo', '🚶', 'Conjugue vir no imperfeito do subjuntivo', 'viesse', 'vinha', 'veio', 'virá', 'Hipótese irreal: se viesse.'),
  q('Qual é o futuro do subjuntivo de "fazer" para "quando eu"?', 'Quando eu fizer', '✍️', 'Conjugue fazer no futuro do subjuntivo', 'fizer', 'fazer', 'fizesse', 'faço', 'O futuro do subjuntivo de fazer é: quando eu fizer, quando você fizer.'),
  q('O que a oração expressa: "Tomara que passe logo!"?', 'Tomara que', '🤞', 'Identifique o sentimento', 'Um voto fervoroso de esperança e desejo positivo', 'Uma certeza matemática', 'Uma ordem militar', 'Um lamento do passado', '"Tomara que" expressa desejo vivo de esperança.')
]);

addUnit('pt-17', 'B2 · Avançado', '🔮', 'Futuro do Presente & Condicional', 'Viajarei no próximo ano e eu gostaria de saber.', 40, [
  q('Como expressar um pedido com máxima elegância polida?', 'Eu gostaria de fazer uma pergunta', '🙏', 'Selecione o futuro do pretérito condicional', 'Eu gostaria de fazer uma pergunta', 'Eu quero perguntar logo', 'Diga-me agora', 'Vou te perguntar', '"Eu gostaria de..." suaviza pedidos com extrema polidez.'),
  q('Qual é a forma regular de futuro do presente de "viajar" para "eu"?', 'Viajarei', '🧳', 'Conjugue no futuro do presente', 'Viajarei', 'Viajava', 'Viajei', 'Viajasse', 'A desinência de 1ª pessoa no futuro é "-ei": viajarei.'),
  q('No português falado informal do Brasil, qual perífrase substitui o futuro simples?', 'Vou viajar', '🗣️', 'Identifique a estrutura coloquial brasileira', 'Ir + infinitivo ("Vou viajar amanhã")', 'Haver de viajar', 'Deverei viajar', 'Terei viajado', 'No dia a dia brasileiro, "vou fazer" substitui quase sempre "farei".'),
  q('Complete a hipótese de consequência: "Se tivesse tempo, eu ___ violão."', 'Eu aprenderia violão', '🎸', 'Conjugue aprender no condicional', 'aprenderia', 'aprenderei', 'aprendia', 'aprenda', 'A consequência de uma condição em -sse é o futuro do pretérito (-ia): aprenderia.'),
  q('O que é a "Mesóclise" na norma culta padrão?', 'Realizar-se-á o evento', '📖', 'Identifique o fenômeno gramatical', 'Interpolação do pronome oblíquo no meio do verbo no futuro (ex: far-se-á)', 'Colocação no fim da frase', 'Omissão de preposições', 'Uso de gírias modernas', 'A mesóclise ocorre com futuros na ausência de palavras atrativas na norma culta.'),
  q('Complete a dúvida no passado com futuro do pretérito: "Quem ___ aquela pessoa misteriosa?"', 'Quem seria aquela pessoa?', '🕵️', 'Expresse probabilidade ou suposição', 'seria', 'era', 'foi', 'será', 'O futuro do pretérito expressa suposição em relação ao passado: quem seria?'),
  q('Como se diz "Nós viajaremos amanhã de manhã"?', 'Nós viajaremos', '🚗', 'Conjugue nós no futuro simples', 'Viajaremos', 'Viajávamos', 'Viajáramos', 'Viajamos ontem', 'Desinência de 1ª pessoa do plural: -emos: viajaremos.'),
  q('Complete: "Se você me ajudasse, nós ___ mais rápido."', 'Nós terminaríamos mais rápido', '⏱️', 'Conjugue terminar no condicional', 'terminaríamos', 'terminaremos', 'terminamos', 'terminarão', 'Condicional de nós leva acento na antepenúltima: terminaríamos.'),
  q('O que expressa a frase: "Seriam cerca de dez horas quando o sino tocou"?', 'Seriam cerca de dez horas', '🔔', 'Identifique a nuance temporal', 'Aproximação ou suposição temporal no passado', 'Certeza pontual exata', 'Hora marcada para o futuro', 'Promessa formal', 'Expressa horário aproximado no passado.'),
  q('Como formular uma sugestão muito cordial: "Não ___ melhor sairmos mais cedo?"', 'Não seria melhor?', '💡', 'Escolha o verbo condicional', 'seria', 'será', 'foi', 'é', '"Não seria melhor...?" convida à reflexão de maneira cortês.')
]);

addUnit('pt-18', 'B2 · Avançado', '🤙', 'Gírias Populares do Brasil', 'Dar um pulo, ficar de boa, vacilar e mandar bem.', 40, [
  q('O que significa a expressão "mandar bem"?', 'Mandar bem', '👏', 'Identifique o significado coloquial', 'Fazer algo com excelência / ter grande sucesso em uma tarefa', 'Enviar uma encomenda pelos correios', 'Dar ordens com grosseria', 'Reclamar de uma situação', '"Mandar bem" significa ter um excelente desempenho.'),
  q('O que significa a expressão "dar um pulo" em algum lugar?', 'Dar um pulo', '👟', 'Identifique a ação', 'Ir rapidamente até um local e retornar logo', 'Pular corda na academia', 'Saltar de paraquedas', 'Comprar sapatos novos', '"Dar um pulo" significa fazer uma visita rápida.'),
  q('O que significa "ficar de boa"?', 'Ficar de boa', '🧘', 'Identifique o estado de espírito', 'Ficar tranquilo, relaxado e em paz sem preocupações', 'Ficar com raiva silenciosa', 'Estar doente na cama', 'Fazer uma viagem longa', '"Ficar de boa" significa ficar calmo e em tranquilidade.'),
  q('O que significa a gíria "vacilar" ou "dar mole"?', 'Vacilar', '🤦', 'Identifique o erro coloquial', 'Cometer um erro por distração / bobeira ou mancada', 'Dançar no palco', 'Vencer um campeonato', 'Dormir cedo demais', '"Vacilar" é cometer um deslize ou pisar na bola.'),
  q('O que significa a expressão "pagar mico"?', 'Pagar mico', '🙈', 'Identifique o constrangimento', 'Passar por uma situação pública embaraçosa e vergonhosa', 'Comprar um animal exótico', 'Pagar a conta do restaurante com desconto', 'Ganhar um sorteio', '"Pagar mico" significa passar vergonha.'),
  q('O que significa a gíria carioca "Maneiro" ou a paulistana "Da hora"?', 'Maneiro / Da hora', '✨', 'Identifique o elogio popular', 'Muito legal / bacana / excelente', 'Comida estragada', 'Lugar perigoso', 'Pessoa antipática', '"Maneiro" e "Da hora" são gírias consagradas para algo muito legal.'),
  q('O que significa a expressão "chutar o balde"?', 'Chutar o balde', '🪣', 'Identifique a atitude impulsiva', 'Perder a paciência e desistir de se conter / desistir do esforço', 'Jogar futebol na chuva', 'Comprar baldes de limpeza', 'Fazer faxina em casa', '"Chutar o balde" significa abandonar as restrições por impaciência.'),
  q('O que significa a gíria "Tirar de letra"?', 'Tirar de letra', '🎯', 'Identifique a facilidade', 'Superar uma dificuldade com grande facilidade e maestria', 'Escrever uma carta à mão', 'Cometer um erro grave', 'Ler um livro longo', '"Tirar de letra" significa resolver com facilidade.'),
  q('O que significa "Segurar vela" em um encontro social?', 'Segurar vela', '🕯️', 'Identifique a situação embaraçosa', 'Ficar acompanhando um casal de namorados como o único solteiro da mesa', 'Faltar luz em casa', 'Trabalhar em vigília noturna', 'Acender incenso perfumado', '"Segurar vela" é ser o terceiro elemento sobrando com um casal.'),
  q('O que significa "Fazer uma vaquinha"?', 'Fazer uma vaquinha', '🐄', 'Identifique a cooperação financeira', 'Juntar dinheiro coletivamente entre várias pessoas para pagar algo comum', 'Comprar gado na fazenda', 'Alugar um sítio para churrasco', 'Cozinhar carne de panela', '"Fazer uma vaquinha" é a clássica arrecadação de dinheiro entre amigos.')
]);

addUnit('pt-19', 'B2 · Avançado', '🇵🇹', 'Português do Brasil vs de Portugal', 'Ônibus vs autocarro, celular vs telemóvel.', 40, [
  q('Em Portugal, o aparelho "celular" é chamado de:', 'Telemóvel', '📱', 'Identifique o termo europeu', 'Telemóvel', 'Telefone de bolso', 'Autocarro', 'Ficha telefônica', 'Em Portugal diz-se "telemóvel".'),
  q('Em Portugal, como se chama o "ônibus" urbano?', 'Autocarro', '🚌', 'Identifique o transporte europeu', 'Autocarro', 'Comboio', 'Bonde', 'Carrinha', '"Autocarro" é o ônibus de passageiros em Portugal.'),
  q('Em Portugal, o meio de transporte que no Brasil chamamos de "trem" é conhecido como:', 'Comboio', '🚆', 'Identifique o transporte ferroviário', 'Comboio', 'Autocarro', 'Metropolitano', 'Vagonete', '"Comboio" é o trem em Portugal.'),
  q('Como os portugueses costumam chamar uma criança ou garoto pequeno?', 'Miúdo / Miúda', '🧒', 'Identifique o termo carinhoso infantil', 'Miúdo / Miúda', 'Pivete', 'Moleque', 'Menininho apenas', '"Miúdo" é a criança em Portugal.'),
  q('Em Portugal, como se chama a carne de "frango" na culinária popular?', 'Frango / Frango assado', '🍗', 'Identifique o alimento', 'Frango (e peru para ave maior)', 'Galináceo', 'Galo novo', 'Ave de forno', 'O termo frango é comum em ambos os lados do Atlântico.'),
  q('No Brasil dizemos "pedestre". Em Portugal costuma-se usar:', 'Peão / Peões', '🚶', 'Identifique o termo de trânsito em Portugal', 'Peão (passadeira para peões)', 'Caminhante', 'Andarilho', 'Corredor', 'A faixa de pedestres em Portugal é a "passadeira de peões".'),
  q('Em Portugal, como se chama o "sorvete" gelado?', 'Gelado', '🍨', 'Identifique a sobremesa gelada', 'Gelado', 'Sorvete doce', 'Gelo saboroso', 'Creme frio', 'Em Portugal pede-se "um gelado".'),
  q('O que significa a palavra "Giro / Gira" no vocabulário português?', 'Que giro!', '✨', 'Identifique a gíria europeia', 'Bonito, simpático ou engraçado / legal', 'Tonto que fica rodando', 'Muito caro', 'Chato e irritante', '"Giro" em Portugal significa bonito ou muito legal.'),
  q('Em Portugal, o café expresso servido na xícara pequena é popularmente chamado de:', 'Bica', '☕', 'Identifique a bebida tradicional em Lisboa', 'Bica (em Lisboa) ou Cimbalino (no Porto)', 'Pingado', 'Carioca longo', 'Expresso puro apenas', 'Em Lisboa pede-se "uma bica".'),
  q('Qual a principal diferença na colocação pronominal em início de frase entre Brasil e Portugal?', 'Me dá vs Dá-me', '💬', 'Identifique a norma culta europeia', 'Em Portugal evita-se iniciar frase com pronome oblíquo ("Dá-me isto"); no Brasil informal inicia-se com próclise ("Me dá isso")', 'Não há nenhuma diferença', 'No Brasil próclise é proibida em qualquer contexto', 'Em Portugal não se usam pronomes oblíquos', 'A próclise inicial é traço característico do português coloquial brasileiro.')
]);

addUnit('pt-20', 'B2 · Avançado', '🎭', 'Expressões Idiomáticas Clássicas', 'Pagar mico, pisar na bola e tirar o cavalinho da chuva.', 40, [
  q('O que significa a expressão "Tirar o cavalinho da chuva"?', 'Tirar o cavalinho da chuva', '🐎', 'Identifique o aviso idiomático', 'Desistir de uma pretensão ou expectativa ilusória / não contar com isso', 'Guardar os animais no estábulo', 'Levar um guarda-chuva para o passeio', 'Comprar um cavalo de corrida', '"Pode tirar o cavalinho da chuva" avisa que algo não vai acontecer.'),
  q('O que significa a expressão "Pisar na bola"?', 'Pisar na bola', '⚽', 'Identifique o deslize', 'Cometer um erro com alguém / falhar com uma obrigação ou amigo', 'Jogar futebol profissional com maestria', 'Comprar chuteiras novas', 'Dominar a bola no campo', '"Pisar na bola" significa decepcionar ou cometer uma mancada.'),
  q('O que significa "Trocar seis por meia dúzia"?', 'Seis por meia dúzia', '⚖️', 'Identifique a equivalência inútil', 'Fazer uma mudança que não traz nenhuma vantagem real prática', 'Comprar ovos frescos na feira', 'Calcular números pares', 'Resolver um dilema com inteligência', 'Seis e meia dúzia são iguais, logo a troca é nula.'),
  q('O que significa "Pensar na morte da bezerra"?', 'Morte da bezerra', '🐄', 'Identifique o devaneio', 'Estar pensativo, distraído ou viajando nos próprios pensamentos', 'Estar de luto por um animal da fazenda', 'Chorar sem motivo aparente', 'Estar com sono pesado', '"Pensar na morte da bezerra" é estar no mundo da lua.'),
  q('O que significa a expressão "Chover no molhado"?', 'Chover no molhado', '🌧️', 'Identifique a redundância', 'Fazer ou dizer algo completamente óbvio, inútil e repetitivo', 'Comemorar uma tempestade de verão', 'Lavar o chão duas vezes', 'Desperdiçar água limpa', '"Chover no molhado" é insistir em algo já evidente e redundante.'),
  q('O que significa "Acabar em pizza"?', 'Acabar em pizza', '🍕', 'Identifique o desfecho político/social', 'Terminar sem punição para os culpados / terminar em impunidade após escândalo', 'Comemorar com um jantar italiano', 'Comprar pizza para a equipe de trabalho', 'Fazer uma reunião festiva', 'Expressão clássica de escândalos que terminam sem consequências.'),
  q('O que significa "Procurar chifre em cabeça de cavalo"?', 'Chifre em cabeça de cavalo', '🦄', 'Identifique a complicação desnecessária', 'Procurar problemas ou defeitos onde eles não existem / complicar o simples', 'Caçar animais míticos na floresta', 'Tratar de animais machucados', 'Duvidar da biologia', 'Significa inventar problemas inexistentes.'),
  q('O que significa "Engolir sapo"?', 'Engolir sapo', '🐸', 'Identifique a tolerância forçada', 'Suportar desaforos, humilhações ou contrariedades calado por necessidade', 'Comer alimentos exóticos na floresta', 'Ter dor de garganta severa', 'Gaguejar ao falar em público', '"Engolir sapo" significa aguentar insultos sem poder revidar.'),
  q('O que significa a expressão "Dar com a língua nos dentes"?', 'Língua nos dentes', '🤐', 'Identifique a quebra de sigilo', 'Falar demais e revelar um segredo que deveria ser guardado', 'Morder a língua ao mastigar o almoço', 'Ficar com dor de dente', 'Gaguejar de nervosismo', '"Dar com a língua nos dentes" é delatar ou contar um segredo.'),
  q('O que significa a expressão "Botar a mão no fogo por alguém"?', 'Mão no fogo', '🔥', 'Identifique a confiança absoluta', 'Confiar plenamente na honestidade e integridade de outra pessoa', 'Brincar com fósforos perigosos', 'Sofrer uma queimadura na cozinha', 'Testar a temperatura da água', '"Botar a mão no fogo" expressa confiança cega e irrestrita.')
]);

console.log('Portuguese units generated: 20');
fs.writeFileSync('scratch/lessons_pt.json', JSON.stringify(lessons, null, 2));
