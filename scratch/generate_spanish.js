// scratch/generate_spanish.js
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
    emoji: emoji || '🇪🇸',
    instruction: instruction || 'Escolha a opção correta em espanhol',
    options,
    answer: idx,
    explanation
  };
}

const lessons = [];

function addUnit(id, level, emoji, title, desc, xp, qList) {
  lessons.push({
    id,
    language: 'es',
    level,
    emoji,
    title,
    description: desc,
    xp,
    questions: qList
  });
}

// 1
addUnit('es-1', 'A1 · Iniciante', '🇪🇸', 'Pronúncia & Fonética Hispânica', 'Aprenda os sons do J, LL, Ñ e o R vibrante.', 20, [
  q('Qual som tem a letra "J" em espanhol (ex: "Jardín")?', 'Jardín', '🌸', 'Escolha a pronúncia correta', 'Som gutural aspirado (como o R forte)', 'Som de J em português', 'Som mudo', 'Som de S', 'O "J" em espanhol soa como um R aspirado forte.'),
  q('Como se pronuncia o dígrafo "LL" na maioria dos países hispânicos?', 'Calle', '🛣️', 'Identifique o fonema', 'Som de "i" ou "dj" suave (ex: caye / cadje)', 'Som de "L" duplo demorado', 'Som de "lh" igual ao português', 'Totalmente mudo', 'O "yeísmo" pronuncia o LL como semivogal "i" ou "dj" brando.'),
  q('Qual palavra contém a consoante exclusiva do espanhol "Ñ"?', 'Niño', '🧒', 'Selecione a palavra com "ñ"', 'Niño', 'Nino', 'Ninho', 'Nito', 'A letra "Ñ" tem som de "nh" em português.'),
  q('Como soa a letra "Z" na pronúncia padrão da Espanha?', 'Zapato', '👞', 'Identifique o som peninsular', 'Com a língua entre os dentes (ceceio similar ao th inglês)', 'Som de Z em zebra', 'Som de S agudo', 'Som de CH', 'Na Espanha peninsular, a letra Z tem som interdental.'),
  q('Como soa o "R" duplo em "Perro" (cachorro)?', 'Perro', '🐕', 'Identifique a pronúncia do RR', 'Vibrante múltiplo na ponta da língua', 'Na garganta como no francês', 'Mudo', 'Como o S sonoro', 'O "RR" espanhol vibra na ponta da língua contra os alvéolos.'),
  q('A letra "H" no início de "Hola" tem qual som?', 'Hola', '👋', 'Escolha o som da letra H', 'Completamente muda', 'Aspirada como em inglês', 'Som de R forte', 'Som de J', 'Em espanhol a letra "H" é sempre muda (salvo em estrangeirismos).'),
  q('Qual a diferença fonética entre "B" e "V" em espanhol?', 'Beso y Vino', '🍷', 'Identifique a regra', 'Na maioria dos dialetos têm exatamente o mesmo som bilabial', 'O V é labiodental vibrante e o B não', 'O V é sempre mudo', 'O B soa como P', 'Em espanhol falado, B e V têm praticamente a mesma pronúncia.'),
  q('Como se pronuncia a letra "C" antes de E e I na Espanha?', 'Cinco', '5️⃣', 'Identifique o som', 'Interdental (língua entre os dentes)', 'Som de K', 'Som de Ch', 'Som de T', 'Na Espanha, "ce" e "ci" ceceiam como o Z.'),
  q('Qual palavra significa "amarelo" com som de "ll"?', 'Amarillo', '🟡', 'Identifique a cor', 'Amarillo', 'Rojo', 'Azul', 'Verde', 'Amarillo é amarelo em espanhol.'),
  q('Como se diz "Espanha" em espanhol com a letra Ñ?', 'España', '🇪🇸', 'Escolha a grafia correta', 'España', 'Espanha', 'Espania', 'Espana', 'A grafia oficial é "España" com a letra ñ.')
]);

// 2
addUnit('es-2', 'A1 · Iniciante', '👋', 'Saludos, Cortesía & ¿Cómo te llamas?', 'Primeiras palavras para quebrar o gelo em espanhol.', 20, [
  q('Como se responde educadamente a "Mucho gusto"?', 'Mucho gusto', '🤝', 'Selecione a resposta', 'Encantado de conocerte', 'Hasta la vista', 'Tengo hambre', 'Por favor', '"Encantado" ou "El gusto es mío" responde a Mucho gusto.'),
  q('Como se diz "Por favor" em espanhol?', 'Por favor', '🙏', 'Escolha a frase', 'Por favor', 'Por gentileza', 'De nada', 'Con permiso', '"Por favor" escreve-se da mesma forma.'),
  q('Como perguntar o nome de alguém informalmente?', '¿Cómo te llamas?', '💬', 'Selecione a pergunta', '¿Cómo te llamas?', '¿Quién tiene nombre?', '¿Cuál es su llamar?', '¿Dónde te llamas?', '"¿Cómo te llamas?" pergunta o nome informalmente.'),
  q('Como responder "Eu me chamo Carlos"?', 'Me llamo Carlos', '👤', 'Escolha a resposta', 'Me llamo Carlos', 'Yo nombre Carlos', 'Mi llamar Carlos', 'Carlos es mi', '"Me llamo..." é a resposta natural.'),
  q('Qual saudação é usada durante a tarde?', 'Buenas tardes', '🌇', 'Identifique a saudação', 'Buenas tardes', 'Buenos días', 'Buenas noches', 'Hola tarde', 'Buenas tardes é boa tarde.'),
  q('Como se diz "Até logo" em espanhol?', 'Hasta luego', '👋', 'Escolha a despedida', 'Hasta luego', 'Hasta nunca', 'Chao sempre', 'Hasta ayer', '"Hasta luego" significa até logo.'),
  q('O que significa "Con permiso"?', 'Con permiso', '🚪', 'Identifique a cortesia', 'Com licença', 'Obrigado', 'Desculpe', 'De nada', '"Con permiso" pede licença para passar ou entrar.'),
  q('Como se diz "Muito obrigado" em espanhol?', 'Muchas gracias', '💐', 'Escolha o agradecimento', 'Muchas gracias', 'Muito obrigado', 'Mucha gratitud', 'Graçias', '"Muchas gracias" expressa gratidão.'),
  q('Como se responde a "Muchas gracias"?', 'De nada', '😊', 'Escolha a resposta', 'De nada', 'Por favor', 'Perdón', 'Hasta pronto', '"De nada" é a resposta usual.'),
  q('Como dizer "Desculpe" para pedir desculpas por um esbarrão?', 'Perdón / Disculpe', '🙇', 'Identifique o pedido de desculpas', 'Perdón (ou Disculpe)', 'Gracias', 'Hola', 'Encantado', 'Perdón ou Disculpe serve para pedir desculpas.')
]);

// 3
addUnit('es-3', 'A1 · Iniciante', '🔢', 'Números, Fechas & La Hora', 'Aprenda uno, dos, tres, lunes e ¿Qué hora es?', 25, [
  q('Como se diz "São duas horas da tarde"?', 'Son las dos de la tarde', '⏰', 'Escolha a frase', 'Son las dos de la tarde', 'Es las dos de la tarde', 'Son dos horas tarde', 'Tiene dos horas', 'A partir das 2h usa-se "Son las...". Para 1h: "Es la una".'),
  q('Como se diz "É uma hora em ponto"?', 'Es la una en punto', '🕐', 'Identifique a hora singular', 'Es la una en punto', 'Son la una en punto', 'Tiene una hora', 'Está la una', 'A 1h é singular: "Es la una".'),
  q('Qual é o número "15" em espanhol?', 'Quince', '1️⃣5️⃣', 'Escolha o número', 'Quince', 'Cinco', 'Cincuenta', 'Diez y cinco', '15 em espanhol é "Quince".'),
  q('Qual é o número "30" em espanhol?', 'Treinta', '3️⃣0️⃣', 'Escolha o número', 'Treinta', 'Trece', 'Tres', 'Treintena', '30 é Treinta (13 é Trece).'),
  q('Como se diz "Segunda-feira" em espanhol?', 'Lunes', '📅', 'Identifique o dia', 'Lunes', 'Martes', 'Miércoles', 'Viernes', 'Segunda-feira é Lunes.'),
  q('Qual é o dia de "Sexta-feira"?', 'Viernes', '🗓️', 'Identifique o dia', 'Viernes', 'Jueves', 'Sábado', 'Domingo', 'Sexta-feira é Viernes.'),
  q('Qual mês do ano corresponde a "Mayo"?', 'Mayo', '🌸', 'Identifique o mês', 'Maio', 'Março', 'Mês', 'Meio', 'Mayo é o mês de maio.'),
  q('Como se diz "Hoje é sábado, 10 de outubro"?', 'Hoy es sábado diez de octubre', '🍂', 'Selecione a data', 'Hoy es sábado, diez de octubre', 'Hoy tiene diez octubre', 'Ahora es sábado diez', 'Sábado diez es hoy', 'Datas usam "Hoy es [dia] de [mês]".'),
  q('Como se diz "Quinze para as quatro" (3:45)?', 'Las cuatro menos cuarto', '🕒', 'Identifique as horas', 'Las cuatro menos cuarto', 'Tres y cuarenta cinco minutos', 'Cuatro antes quince', 'Falta quince cuatro', 'Em espanhol usa-se "menos cuarto" para 15 para a hora.'),
  q('Qual é a palavra para "Ano bissexto"?', 'Año bisiesto', '📆', 'Identifique o termo', 'Año bisiesto', 'Año doble', 'Año largo', 'Año de febrero', 'Año bisiesto é o ano de 366 dias.')
]);

// 4
addUnit('es-4', 'A1 · Iniciante', '🥘', 'En el Café, Tapas & Restaurante', 'Peça la cuenta por favor, agua con gas e tapas.', 25, [
  q('Como pedir a conta ao garçom?', 'La cuenta, por favor', '🧾', 'Selecione o pedido', 'La cuenta, por favor', 'El dinero, gracias', 'La suma aquí', 'El ticket ahora', '"La cuenta, por favor" é universal.'),
  q('Como pedir água mineral sem gás?', 'Agua sin gas, por favor', '💧', 'Escolha a frase', 'Agua sin gas, por favor', 'Agua natural pura', 'Agua quieta gracias', 'Agua fresca sem gas', 'Usa-se "Agua sin gas".'),
  q('O que são as tradicionais "Tapas" na Espanha?', 'Tapas', '🍢', 'Identifique o prato', 'Pequenas porções de petiscos servidas com bebida', 'Sobremesas de chocolate', 'Sopas quentes de inverno', 'Prato gigante individual', 'Tapas são pequenas porções para compartilhar.'),
  q('Qual prato espanhol é feito com arroz, açafrão e frutos do mar?', 'Paella', '🥘', 'Identifique a iguaria', 'Paella', 'Gazpacho', 'Churros', 'Tortilla de patatas', 'A Paella é o prato emblemático de Valência.'),
  q('O que significa "La carta" no restaurante?', 'La carta', '📋', 'Identifique o objeto', 'O cardápio / menu', 'A carta de correio', 'A nota fiscal', 'A toalha de mesa', 'La carta é o cardápio.'),
  q('Como se diz "Café com leite"?', 'Café con leche', '☕', 'Identifique a bebida', 'Café con leche', 'Café con crema', 'Leche con café', 'Café cortado solo', 'Café con leche é a bebida tradicional.'),
  q('O que é um "Café solo"?', 'Café solo', '☕', 'Identifique o preparo', 'Café preto / expresso puro sem leite', 'Café com canela', 'Café gelado', 'Café com açúcar duplo', 'Café solo é o expresso puro.'),
  q('Como dizer "Está delicioso!" em espanhol?', '¡Está muy rico!', '😋', 'Escolha o elogio gastronômico', '¡Está muy rico! (ou ¡Está delicioso!)', '¡Es mucho sabor!', '¡Tiene gusto alto!', '¡Come bien!', 'Para comida usa-se "estar rico/a".'),
  q('O que é a "Tortilla de patatas"?', 'Tortilla de patatas', '🥔', 'Identifique a receita', 'Omelete típica feita com ovos e batatas', 'Pão de milho mexicano', 'Torta doce de maçã', 'Bolo de cenoura', 'A tortilla espanhola leva ovos e batatas.'),
  q('Como pedir licença para o garçom?', '¡Camarero, por favor!', '🛎️', 'Chame o garçom', '¡Camarero, por favor! (ou ¡Mesero!)', '¡Garçom aqui!', '¡Señor de la comida!', '¡Tráigame ya!', 'Camarero (Espanha) ou Mesero (América Latina).')
]);

// 5
addUnit('es-5', 'A1 · Iniciante', '⚖️', 'Los Verbos Ser y Estar', 'Descubra quando usar es vs está em espanhol.', 25, [
  q('Complete: "Madrid ___ la capital de España."', 'Madrid es la capital de España', '🏛️', 'Escolha ser ou estar', 'es', 'está', 'son', 'están', 'Para fatos permanentes usa-se "es" (verbo ser).'),
  q('Complete com o estado emocional transitório: "Yo ___ muy cansado hoy."', 'Estoy muy cansado hoy', '🥱', 'Escolha ser ou estar', 'estoy', 'soy', 'es', 'está', 'Estados físicos ou emocionais passageiros usam "estar".'),
  q('Qual a diferença entre "es listo" e "está listo"?', 'Es listo vs Está listo', '🧠', 'Interprete a nuance', '"Es listo" é inteligente; "Está listo" é preparado / pronto', 'São idênticos', '"Está listo" é rápido', '"Es listo" é preguiçoso', 'Ser listo = inteligente; Estar listo = pronto.'),
  q('Complete: "Mis amigos ___ en la playa."', 'Están en la playa', '🏖️', 'Localização física', 'están', 'son', 'es', 'está', 'Para localização física no espaço usa-se o verbo "estar".'),
  q('Complete: "Nosotros ___ brasileños."', 'Somos brasileños', '🇧🇷', 'Nacionalidade', 'somos', 'estamos', 'son', 'sois', 'Nacionalidade exige o verbo "ser": somos.'),
  q('Complete: "El café ___ frío."', 'El café está frío', '☕', 'Temperatura momentânea', 'está', 'es', 'son', 'están', 'Temperatura de alimentos usa "estar": está frío.'),
  q('Complete: "La fiesta ___ en mi casa."', 'La fiesta es en mi casa', '🎉', 'Local de eventos', 'es', 'está', 'son', 'fue', 'Acontecimentos e eventos usam "ser" para o local: "La fiesta es...".'),
  q('Complete: "Ella ___ médica en el hospital."', 'Ella es médica', '👩‍⚕️', 'Profissão', 'es', 'está', 'son', 'era', 'Profissões permanentes usam "ser".'),
  q('Complete: "La puerta ___ abierta."', 'La puerta está abierta', '🚪', 'Estado da porta', 'está', 'es', 'son', 'están', 'Estado resultante de uma ação usa "estar": está abierta.'),
  q('Qual a forma conjugada de "Yo" no presente do verbo SER?', 'Yo soy', '👤', 'Conjugue o verbo ser', 'soy', 'estoy', 'eres', 'somos', 'Yo soy (verbo ser).')
]);

// 6
addUnit('es-6', 'A2 · Básico', '👨‍👩‍👧', 'La Familia & Posesivos', 'Mi padre, tu hermana, su primo e nuestros amigos.', 25, [
  q('Como se diz "minha mãe" em espanhol?', 'Mi madre', '👩', 'Escolha a tradução', 'Mi madre', 'Mia madre', 'La madre mía', 'Me madre', 'O possessivo antes do substantivo é "mi".'),
  q('Como se diz "Meu pai e minha mãe" em uma palavra?', 'Mis padres', '👨‍👩‍👧', 'Identifique o termo', 'Mis padres', 'Mis papaces', 'Mis parentes', 'Mis viejos solares', 'Padres engloba pai e mãe.'),
  q('O que significa "Abuelo" e "Abuela"?', 'Abuelo y abuela', '👴👵', 'Identifique os parentes', 'Avô e Avó', 'Tio e Tia', 'Padrinho e Madrinha', 'Primo e Prima', 'Abuelo é avô e abuela é avó.'),
  q('Como se diz "Irmão mais velho"?', 'Hermano mayor', '👦', 'Identifique o termo', 'Hermano mayor', 'Hermano viejo', 'Hermano grande', 'Hermano alto', 'Mayor expressa mais velho em idade.'),
  q('Como se diz "Irmão mais novo"?', 'Hermano menor', '👶', 'Identifique o termo', 'Hermano menor', 'Hermano joven', 'Hermano pequeño', 'Hermano bajo', 'Menor expressa mais novo em idade.'),
  q('Qual o significado de "Tío" e "Tía"?', 'Tío y Tía', '🏡', 'Identifique os parentes', 'Tio e Tia', 'Sogro e Sogra', 'Primo e Prima', 'Genro e Nora', 'Tío é tio e tía é tia.'),
  q('O que significa "Hijo" e "Hija"?', 'Hijo e Hija', '👶', 'Identifique o parentesco', 'Filho e Filha', 'Sobrinho e Sobrinha', 'Irmão e Irmã', 'Enteado e Enteada', 'Hijo é filho e hija é filha.'),
  q('Como se diz "Nosso cachorro"?', 'Nuestro perro', '🐕', 'Escolha o possessivo plural', 'Nuestro perro', 'Nosso perro', 'De nosotros perro', 'Nuestras perro', 'Nuestro é o possessivo de 1ª pessoa plural masculino.'),
  q('O que significa "Suegro" e "Suegra"?', 'Suegro y Suegra', '👵👴', 'Identifique os parentes por casamento', 'Sogro e Sogra', 'Genro e Nora', 'Cunhado e Cunhada', 'Padrasto e Madrasta', 'Suegro é sogro e suegra é sogra.'),
  q('Como se diz "Primo" e "Prima"?', 'Primo y Prima', '👧👦', 'Identifique os termos', 'Primo y Prima', 'Sobrino y Sobrina', 'Hermano y Hermana', 'Nieto y Nieta', 'Primo e prima escrevem-se da mesma forma.')
]);

// 7
addUnit('es-7', 'A2 · Básico', '⏰', 'Rutina Diaria & Verbos Reflexivos', 'Me levanto temprano, me ducho e me acuesto.', 30, [
  q('Como se diz "Eu acordo às sete"?', 'Me despierto a las siete', '⏰', 'Selecione a forma reflexiva', 'Me despierto a las siete', 'Yo despierto en siete', 'Despiértome a las siete', 'Me levanto siete', 'Despertarse é reflexivo: "Me despierto".'),
  q('Qual pronome reflexivo acompanha a 1ª pessoa "Yo"?', 'Me lavo', '🪞', 'Identifique o pronome', 'me', 'te', 'se', 'nos', 'O pronome reflexivo de Yo é "me".'),
  q('Como se diz "Ele toma banho todos os dias"?', 'Él se ducha todos los días', '🚿', 'Escolha a frase', 'Él se ducha todos los días', 'Él ducha cada día', 'Él toma baño diario', 'Él es duchando', 'Ducharse com él vira "se ducha".'),
  q('O que significa o verbo reflexivo "Acostarse"?', 'Acostarse', '🛏️', 'Identifique o significado', 'Ir para a cama / deitar-se para dormir', 'Acordar cedo', 'Vestir uma camisa', 'Almoçar', 'Acostarse significa deitar-se para dormir.'),
  q('Como conjugar acostarse para Yo no presente (o-ue)?', 'Me acuesto a las diez', '🕙', 'Conjugue o verbo irregular', 'Me acuesto', 'Me acosto', 'Yo acuesto', 'Acóstome', 'Acostarse tem ditongação: o -> ue: me acuesto.'),
  q('Como se diz "Nós nos vestimos rapidamente"?', 'Nos vestimos rápidamente', '👕', 'Selecione a frase plural', 'Nos vestimos rápidamente', 'Nosotros vestimos rápido', 'Se vestimos veloz', 'Nos vestiamos ahora', 'Vestirse com nosotros usa o pronome "nos".'),
  q('O que significa "Lavarse los dientes"?', 'Lavarse los dientes', '🪥', 'Identifique o hábito higiênico', 'Escovar os dentes', 'Lavar o rosto', 'Pentear o cabelo', 'Lavar as mãos', 'Em espanhol costuma-se dizer "lavarse los dientes" ou "cepillarse".'),
  q('O que significa "Peinarse"?', 'Peinarse', '💇', 'Identifique a ação', 'Pentear o cabelo', 'Cortar as unhas', 'Fazer a barba', 'Secar os pés', 'Peinarse significa pentear o cabelo com pente (peine).'),
  q('Como dizer "Você se veste muito bem"?', 'Te vistes muy bien', '👗', 'Escolha a frase', 'Te vistes muy bien', 'Tú vistes bonito', 'Te vientes bien', 'Vísteste bien', 'Vestirse com tú vira "te vistes".'),
  q('Como se diz "Eu vou para o trabalho de metrô"?', 'Voy al trabajo en metro', '🚇', 'Identifique o meio de transporte', 'Voy al trabajo en metro', 'Yo voy trabalho metro', 'Voy para metro trabajo', 'Ando em metrô laboral', 'Usa-se a preposição "en" para meios de transporte: en metro, en autobús.')
]);

// 8
addUnit('es-8', 'A2 · Básico', '🗺️', 'Direcciones & Transporte Público', 'Gira a la derecha, siga recto e el metro.', 30, [
  q('O que significa "Gira a la derecha"?', 'Gira a la derecha', '➡️', 'Identifique o sentido', 'Vire à direita', 'Vire à esquerda', 'Siga em frente', 'Pare o carro', '"Derecha" é direita ("Izquierda" é esquerda).'),
  q('O que significa "Siga todo recto"?', 'Siga todo recto', '⬆️', 'Identifique a orientação', 'Siga sempre em frente', 'Dê meia volta', 'Vire à esquerda na praça', 'Atravesse o parque', '"Todo recto" significa sempre em frente.'),
  q('Como perguntar onde fica o ponto de ônibus?', '¿Dónde está la parada de autobús?', '🚏', 'Selecione a pergunta', '¿Dónde está la parada de autobús?', '¿Dónde es el bus point?', '¿Cuál estación de bus?', '¿Dónde para el carro?', 'Parada de autobús é o ponto de ônibus.'),
  q('Como se chama a estação de metrô?', 'Estación de metro', '🚇', 'Identifique o local', 'Estación de metro', 'Parada subterránea', 'Terminal de tren', 'Paso de metro', 'Estación de metro é a estação ferroviária urbana.'),
  q('O que significa "Cruce la calle"?', 'Cruce la calle', '🚶', 'Identifique a instrução', 'Atravesse a rua', 'Pare na calçada', 'Corra pela pista', 'Volte para a esquina', 'Cruzar la calle é atravessar a rua.'),
  q('O que é "La esquina"?', 'La esquina', '📐', 'Identifique o ponto geométrico urbano', 'A esquina da rua', 'O meio do quarteirão', 'A praça central', 'A ponte', 'La esquina é a esquina.'),
  q('Como dizer que algo fica "Perto daqui"?', 'Está cerca de aquí', '📍', 'Escolha a expressão de proximidade', 'Está cerca de aquí', 'Está lejos de aquí', 'Tiene cerca ahora', 'Es junto aquí', 'Cerca significa perto (lejos significa longe).'),
  q('Como dizer que um museu fica "Longe daqui"?', 'Está muy lejos de aquí', '🚗', 'Escolha a expressão de distância', 'Está muy lejos de aquí', 'Está cerca de aquí', 'Queda distante agora', 'Tiene leguas acá', 'Lejos significa longe.'),
  q('O que é "El semáforo"?', 'El semáforo', '🚦', 'Identifique o equipamento urbano', 'O semáforo / sinal de trânsito', 'A placa de pare', 'O radar de velocidade', 'A calçada de pedestres', 'Semáforo é o sinal luminoso de trânsito.'),
  q('Como perguntar "Quanto custa o bilhete de metrô?"?', '¿Cuánto cuesta el billete de metro?', '🎫', 'Selecione a pergunta', '¿Cuánto cuesta el billete de metro?', '¿Cuál precio metro ticket?', '¿Cuánto vale el pase metro?', '¿Qué dinero el metro?', 'Billete (Espanha) ou boleto (América Latina) é a passagem.')
]);

// 9
addUnit('es-9', 'A2 · Básico', '🛍️', 'De Compras, Ropa & ¿Cuánto cuesta?', 'Compre roupas, pergunte tamanhos e pechinche.', 25, [
  q('Como perguntar o preço de uma jaqueta?', '¿Cuánto cuesta esta chaqueta?', '🧥', 'Escolha a pergunta', '¿Cuánto cuesta esta chaqueta?', '¿Qué vale el saco?', '¿Cuánto es chaqueta?', '¿Qué precio tiene?', '"¿Cuánto cuesta...?" é a pergunta padrão.'),
  q('O que significa "La talla"?', 'La talla', '📏', 'Identifique o termo de vestuário', 'O tamanho da roupa (P, M, G)', 'A cor da peça', 'O tecido de algodão', 'O preço de etiqueta', 'Talla refere-se ao tamanho de roupas.'),
  q('Qual palavra significa "Sapato"?', 'Zapato', '👞', 'Identifique o calçado', 'Zapato', 'Sombrero', 'Guante', 'Camisa', 'Zapato é sapato.'),
  q('Onde você experimenta as roupas em uma loja?', 'En el probador', '🚪', 'Identifique o local da loja', 'En el probador', 'En el baño', 'En la caja', 'En el escaparate', 'Probador é o provador da loja.'),
  q('O que significa "El escaparate"?', 'El escaparate', '🪟', 'Identifique o termo comercial', 'A vitrine da loja', 'A sacola de compras', 'O caixa registrador', 'O cabide de metal', 'Escaparate é a vitrine.'),
  q('Como pedir uma camiseta em tamanho maior?', '¿Tiene una talla más grande?', '👕', 'Escolha o pedido', '¿Tiene una talla más grande?', 'Quiero camisa gigante', 'Dame talla alta', 'Pon camisa mayor', '"Una talla más grande" pede um tamanho maior.'),
  q('O que significa "Rebajas"?', 'Rebajas', '🏷️', 'Identifique a época comercial', 'Liquidações / Promoções de desconto', 'Novos lançamentos caros', 'Roupas com defeito', 'Fechamento da loja', 'Rebajas são as liquidações anuais na Espanha.'),
  q('Como se diz "Camisa branca de algodão"?', 'Camisa blanca de algodón', '👔', 'Identifique o material', 'Camisa blanca de algodón', 'Camisa blanca de lana', 'Camisa blanca de seda', 'Camisa blanca de cuero', 'Algodón significa algodão.'),
  q('O que é "Pagar en efectivo"?', 'Pagar en efectivo', '💵', 'Identifique a forma de pagamento', 'Pagar com dinheiro em espécie / notas', 'Pagar com cartão de crédito', 'Pagar parcelado em 12 vezes', 'Pagar por pix', 'En efectivo significa em dinheiro vivo.'),
  q('Como dizer "Vou levar esta camiseta"?', 'Me llevo esta camiseta', '🛍️', 'Escolha a decisão de compra', 'Me llevo esta camiseta', 'Yo tomo esta camisa', 'Pongo camiseta para mí', 'Compro llevar esto', '"Me llevo..." é a frase típica ao decidir levar um produto.')
]);

// 10
addUnit('es-10', 'A2 · Básico', '🏡', 'La Casa, Muebles & Habitaciones', 'El salón, la cocina, el dormitorio e el balcón.', 25, [
  q('Onde fica a cama?', 'En el dormitorio', '🛏️', 'Selecione o cômodo', 'En el dormitorio', 'En la cocina', 'En el baño', 'En el pasillo', '"Dormitorio" ou "habitación" é o quarto.'),
  q('Como se chama a "Sala de estar"?', 'El salón / La sala de estar', '🛋️', 'Identifique o cômodo', 'El salón', 'El comedor', 'La terraza', 'El ático', 'El salón é a sala de estar.'),
  q('Onde você cozinha o jantar?', 'En la cocina', '🍳', 'Identifique o cômodo', 'En la cocina', 'En el garaje', 'En el sótano', 'En el tejado', 'Cocina é a cozinha.'),
  q('O que significa "La nevera" ou "El frigorífico"?', 'La nevera', '🧊', 'Identifique o eletrodoméstico', 'A geladeira', 'O fogão', 'O micro-ondas', 'A máquina de lavar', 'Nevera ou frigorífico é a geladeira.'),
  q('O que é "El sofá"?', 'El sofá', '🛋️', 'Identifique o móvel', 'O sofá', 'A poltrona', 'A cadeira', 'A mesa de centro', 'El sofá é o sofá.'),
  q('Como se chama a "Varanda" do apartamento?', 'El balcón / La terraza', '🌅', 'Identifique o espaço', 'El balcón (ou La terraza)', 'El desván', 'El patio interior', 'El portal', 'Balcón ou terraza é a varanda.'),
  q('O que significa "La ventana"?', 'La ventana', '🪟', 'Identifique a parte da casa', 'A janela', 'A porta de entrada', 'A cortina de seda', 'O trinco', 'Ventana é janela.'),
  q('Como se diz "Espelho do banheiro"?', 'Espejo del baño', '🪞', 'Identifique o objeto', 'Espejo del baño', 'Cristal del baño', 'Reflejo del baño', 'Vidrio del baño', 'Espejo é espelho.'),
  q('O que é "La alfombra"?', 'La alfombra', '🧶', 'Identifique o item de decoração', 'O tapete', 'A almofada', 'A cortina', 'O quadro de parede', 'Alfombra é tapete.'),
  q('O que significa "El ascensor"?', 'El ascensor', '🛗', 'Identifique a máquina', 'O elevador do prédio', 'A escada em caracol', 'O corredor principal', 'A garagem', 'Ascensor é o elevador.')
]);

// 11
addUnit('es-11', 'B1 · Intermediário', '📆', 'Pretérito Indefinido: Acciones Pasadas', 'Ayer viajé, comí paella e compré billetes.', 35, [
  q('Qual o passado de "hablar" para "yo" no Pretérito Indefinido?', 'Hablé', '🗣️', 'Escolha a terminação correta', 'Hablé', 'Hablaba', 'He hablado', 'Hablo', 'A terminação de 1ª pessoa no Indefinido (-ar) é "-é": hablé.'),
  q('Qual o passado irregular de "ir" para "yo"?', 'Fui', '🚶', 'Identifique o verbo', 'Fui', 'Iba', 'He ido', 'Fue', 'Yo fui a Madrid ontem.'),
  q('Qual o passado de "comer" para "nosotros"?', 'Comimos', '🍽️', 'Conjugue o verbo', 'Comimos', 'Comíamos', 'Comemos', 'Comieron', 'Comimos é comemos no passado.'),
  q('Complete com pretérito indefinido: "Ayer ellos ___ una película."', 'Ayer vieron una película', '🎬', 'Conjugue ver', 'vieron', 'veían', 'ven', 'han visto', 'Vieron é o passado para ellos.'),
  q('Qual o passado de "estar" para "yo" (irregular)?', 'Estuve', '📍', 'Conjugue o verbo estar', 'Estuve', 'Estaba', 'Estuvei', 'Esté', 'Estar tem raiz irregular no passado: estuve, estuviste, estuvo.'),
  q('Qual o passado de "hacer" para "él"?', 'Hizo', '✍️', 'Identifique a grafia correta', 'Hizo', 'Hizó', 'Hice', 'Hacio', 'Él hizo a tarefa com a letra Z.'),
  q('O que significa a palavra temporal "Ayer"?', 'Ayer', '🔙', 'Identifique o dia', 'Ontem', 'Hoje', 'Amanhã', 'Semana passada', 'Ayer significa ontem.'),
  q('O que significa "Anoche"?', 'Anoche', '🌙', 'Identifique o período', 'Ontem à noite', 'Hoje à noite', 'Amanhã cedo', 'Madrugada', 'Anoche significa ontem à noite.'),
  q('Qual o passado de "tener" para "tú"?', 'Tuviste', '💼', 'Conjugue tener', 'Tuviste', 'Tenías', 'Tuvisteis', 'Tenes', 'Tú tuviste uma boa ideia.'),
  q('Complete: "El año pasado ___ a México."', 'El año pasado viajamos a México', '🇲🇽', 'Complete no passado pontual', 'viajamos', 'viajábamos', 'viajaremos', 'viajan', 'Ação concluída no ano passado usa o Pretérito Indefinido.')
]);

// 12
addUnit('es-12', 'B1 · Intermediário', '🎯', 'Por vs Para Sin Errores', 'Diferencie motivo ("por ti") de finalidade ("para trabajar").', 35, [
  q('Complete: "Estudio español ___ vivir en Barcelona."', 'Estudio español para vivir en Barcelona', '🇪🇸', 'Escolha por ou para', 'para', 'por', 'de', 'con', 'Para objetivo/finalidade com infinitivo usa-se "para".'),
  q('Complete a expressão de gratidão: "Muchas gracias ___ tu ayuda."', 'Muchas gracias por tu ayuda', '🙏', 'Motivo do agradecimento', 'por', 'para', 'de', 'en', 'Para expressar motivo de agradecimento usa-se "por": Gracias por...'),
  q('Complete o prazo limite: "El informe debe estar listo ___ el viernes."', 'Para el viernes', '📅', 'Prazo no tempo', 'para', 'por', 'en', 'durante', 'Para prazos limites de entrega usa-se "para": para el viernes.'),
  q('Complete o meio de locomoção ou passagem: "Caminamos ___ el parque."', 'Por el parque', '🌳', 'Movimento através de um lugar', 'por', 'para', 'sobre', 'hacia', 'Movimento através de um espaço usa "por": caminar por el parque.'),
  q('Complete a troca de valores: "Te vendo mi bicicleta ___ cincuenta euros."', 'Por cincuenta euros', '🚲', 'Troca ou preço', 'por', 'para', 'de', 'con', 'Preço e trocas financeiras usam "por": por 50 euros.'),
  q('Complete o destinatário de um presente: "Este regalo es ___ mi hermana."', 'Para mi hermana', '🎁', 'Destinatário final', 'para', 'por', 'con', 'de', 'Destinatário de um objeto usa "para": para mi hermana.'),
  q('Complete a causa ou motivo: "Llegó tarde ___ culpa del tráfico."', 'Por culpa del tráfico', '🚗', 'Causa / motivo', 'por', 'para', 'de', 'en', 'Causa usa "por": por culpa de.'),
  q('O que significa a expressão "Por si acaso"?', 'Por si acaso', '🌂', 'Identifique a locução adverbial', 'Por via das dúvidas / Caso seja necessário', 'Com certeza', 'Nunca na vida', 'De repente', '"Por si acaso" equivale a por via das dúvidas.'),
  q('O que significa "Para siempre"?', 'Para siempre', '♾️', 'Identifique a expressão de tempo', 'Para sempre / eternamente', 'Por pouco tempo', 'Para amanhã', 'Nunca mais', '"Para siempre" significa para sempre.'),
  q('O que significa "Por fin"?', 'Por fin terminamos', '🎉', 'Identifique o alívio', 'Finalmente / Até que enfim', 'No início', 'Por acaso', 'Pelo final', '"Por fin" significa finalmente ou até que enfim.')
]);

// 13
addUnit('es-13', 'B1 · Intermediário', '✈️', 'En el Aeropuerto & La Aduana', 'Puerta de embarque, pasaporte e equipaje de mano.', 30, [
  q('Como se diz "Mala de mão" em espanhol?', 'Equipaje de mano', '🧳', 'Selecione a expressão correta', 'Equipaje de mano', 'Maleta portátil', 'Bolsa de avión', 'Mochila de viaje', '"Equipaje de mano" é a bagagem de cabine.'),
  q('Onde você embarca no avião?', 'En la puerta de embarque', '🛫', 'Identifique o local', 'En la puerta de embarque', 'En la cinta de maletas', 'En el mostrador de boletos', 'En la pista', '"Puerta de embarque" é o portão de embarque.'),
  q('O que é a "Tarjeta de embarque"?', 'Tarjeta de embarque', '🎫', 'Identifique o documento', 'O cartão de embarque', 'O passaporte diplomático', 'O visto consular', 'A carteira de motorista', 'Tarjeta de embarque é o cartão de embarque.'),
  q('O que significa "Vuelo retrasado"?', 'Vuelo retrasado', '⏳', 'Identifique o status do voo', 'Voo atrasado', 'Voo cancelado', 'Voo pontual', 'Voo de volta', 'Retrasado significa atrasado.'),
  q('Onde você retira as malas despachadas após o voo?', 'En la cinta de equipajes', '🛄', 'Identifique a área', 'En la cinta de equipajes (reclamación)', 'En la aduana', 'En la oficina de turismo', 'En el taxi', 'Cinta de equipajes é a esteira de restituição.'),
  q('O que o oficial de aduana pergunta com: "¿Tiene algo que declarar?"', '¿Tiene algo que declarar?', '👮', 'Interprete a pergunta aduaneira', 'Você tem mercadorias tributáveis a declarar?', 'Qual é sua profissão?', 'Onde está sua carteira?', 'Quanto custou a passagem?', 'Pergunta padrão sobre mercadorias na alfândega.'),
  q('O que significa "Escala" em uma viagem de avião?', 'Vuelo con escala', '🗺️', 'Identifique o tipo de voo', 'Conexão ou parada intermediária em outro aeroporto', 'Voo direto sem paradas', 'Voo cancelado', 'Primeira classe', 'Vuelo con escala tem paradas intermediárias.'),
  q('Como se diz "Passagem de ida e volta"?', 'Billete de ida y vuelta', '🎟️', 'Identifique o bilhete completo', 'Billete de ida y vuelta', 'Boleto solo ida', 'Pase de avión duplo', 'Ticket de vuelta solo', 'Ida y vuelta significa ida e volta.'),
  q('O que é "El mostrador de facturación"?', 'Mostrador de facturación', '🏢', 'Identifique o balcão', 'O balcão de check-in e despacho de malas', 'A lanchonete do saguão', 'A sala vip', 'O controle de segurança', 'Facturar equipaje é despachar as malas no balcão.'),
  q('Como dizer "Perdi minha mala de viagem"?', 'He perdido mi maleta', '🧳', 'Escolha a declaração de extravio', 'He perdido mi maleta', 'Mi bolso corrió lejos', 'No hay mi equipaje hoy', 'Olvidé la maleta avión', '"He perdido mi maleta" comunica o extravio da mala.')
]);

// 14
addUnit('es-14', 'B1 · Intermediário', '💊', 'En la Farmacia, Salud & Médico', 'Me duele la cabeza, fiebre e pastillas.', 30, [
  q('Como dizer "Estou com dor de cabeça"?', 'Me duele la cabeza', '🤕', 'Escolha a frase', 'Me duele la cabeza', 'Tengo dolor de testa', 'Mi cabeza está mal', 'Siento cabeza rota', 'O verbo doler funciona como gustar: "Me duele la cabeza".'),
  q('Como dizer "Estou com dor de estômago"?', 'Me duele el estómago', '🤢', 'Escolha a frase', 'Me duele el estómago', 'Tengo barriga rota', 'Estómago me pica', 'Dolor en la comida', '"Me duele el estómago" é a frase médica exata.'),
  q('O que é uma "Receta médica"?', 'Receta médica', '📄', 'Identifique o documento', 'A prescrição do médico para comprar remédios', 'A nota fiscal da farmácia', 'A bula explicativa', 'O recibo de consulta', 'Receta médica é a prescrição.'),
  q('O que significa "Pastillas"?', 'Pastillas', '💊', 'Identifique a apresentação farmacêutica', 'Comprimidos / pílulas', 'Xarope líquido', 'Pomada de pele', 'Injeção', 'Pastillas são comprimidos ou pastilhas.'),
  q('Como dizer "Estou com febre alta"?', 'Tengo mucha fiebre', '🌡️', 'Identifique o sintoma', 'Tengo mucha fiebre', 'Mi cuerpo está en fuego', 'Siento calor médico', 'Estoy con temperatura quemando', 'Fiebre é febre.'),
  q('O que significa "Toser" e "Tos"?', 'Toser', '🗣️', 'Identifique o reflexo respiratório', 'Tossir e Tosse', 'Espirrar e Espirro', 'Chorar e Lágrima', 'Gaguejar e Gagueira', 'Tos é tosse e toser é tossir.'),
  q('O que é "Jarabe para la tos"?', 'Jarabe para la tos', '🥄', 'Identifique o medicamento', 'Xarope para tosse', 'Colírio para olhos', 'Pomada para dor', 'Soro fisiológico', 'Jarabe é xarope.'),
  q('Como se diz "Curativo adesivo" (Band-Aid) na Espanha?', 'Una tirita', '🩹', 'Identifique o curativo', 'Una tirita (ou curita)', 'Un parche grande', 'Un vendaje duro', 'Un lazo de piel', 'Na Espanha diz-se "tirita" e na América Latina "curita".'),
  q('O que é uma "Alergia"?', 'Tengo alergia al polen', '🤧', 'Identifique a condição', 'Alergia a uma substância', 'Uma gripe comum', 'Uma fratura óssea', 'Uma inflamação muscular', 'Alergia escreve-se de forma idêntica.'),
  q('Como se deseja saúde após alguém espirrar em espanhol?', '¡Salud! / ¡Jesús!', '🤧', 'Escolha a cortesia', '¡Salud! (ou ¡Jesús!)', '¡Gracias!', '¡Silencio!', '¡Perdón!', 'Diz-se "¡Salud!" ou "¡Jesús!" quando alguém espirra.')
]);

// 15
addUnit('es-15', 'B1 · Intermediário', '💼', 'El Trabajo, Profesiones & Oficina', 'Entrevista de trabajo, sueldo e horario laboral.', 35, [
  q('O que significa "Sueldo"?', 'Sueldo', '💵', 'Identifique o termo financeiro laboral', 'Salário / remuneração mensal', 'Imposto de renda', 'Férias remuneradas', 'Contrato de aluguel', '"Sueldo" ou "salario" é a remuneração pelo trabalho.'),
  q('Como se chama a "Entrevista de emprego"?', 'Entrevista de trabajo', '👔', 'Identifique o evento seletivo', 'Entrevista de trabajo', 'Cita de negocios', 'Reunión de empleo', 'Charla laboral', 'Entrevista de trabajo é a entrevista de emprego.'),
  q('O que significa "Horario laboral"?', 'Horario laboral', '⏰', 'Identifique o conceito', 'A jornada de trabalho diária', 'A hora do almoço', 'As férias anuais', 'A hora extra', 'Horario laboral é o expediente de trabalho.'),
  q('O que é o "Jefe" ou "La jefa"?', 'El jefe / La jefa', '🏢', 'Identifique o cargo', 'O chefe / a chefe ou gerente', 'O colega de mesa', 'O estagiário', 'O cliente', 'Jefe é o superior hierárquico.'),
  q('O que significa "Despedir a un empleado"?', 'Despedir', '🚪', 'Identifique a ação administrativa', 'Demitir um funcionário', 'Contratar alguém novo', 'Promover a diretor', 'Dar um aumento', 'Despedir significa demitir.'),
  q('O que significa "Contratar"?', 'Contratar', '🤝', 'Identifique a ação', 'Admitir / formalizar novo funcionário', 'Demitir com justa causa', 'Aposentar alguém', 'Reclamar do trabalho', 'Contratar significa admitir funcionário.'),
  q('O que são as "Vacaciones pagadas"?', 'Vacaciones', '🏖️', 'Identifique o direito trabalhista', 'Férias remuneradas', 'Feriados nacionais', 'Licença médica', 'Horas extras no sábado', 'Vacaciones pagadas são férias remuneradas.'),
  q('Como se diz "Estágio profissional"?', 'Prácticas / Pasantía', '🎓', 'Identifique o cargo de início', 'Prácticas (Espanha) ou Pasantía (América Latina)', 'Trabajo leve', 'Escuela de empleo', 'Oficina menor', 'Prácticas ou pasantía é o estágio de estudantes.'),
  q('O que significa "Estar de baja médica"?', 'Baja médica', '🏥', 'Identifique a situação', 'Estar de licença médica por doença', 'Estar desempregado', 'Pedir demissão', 'Trabalhar em home office', 'Estar de baja médica é estar afastado por saúde.'),
  q('O que é uma "Reunión de equipo"?', 'Reunión de equipo', '👥', 'Identifique a assembleia', 'Reunião de equipe de trabalho', 'Festa de fim de ano', 'Almoço com clientes', 'Entrevista individual', 'Reunión de equipo é a reunião de time.')
]);

// 16
addUnit('es-16', 'B1 · Intermediário', '📜', 'Pretérito Imperfecto: Infancia y Recuerdos', 'Cuando era niño vivía en el campo e jugaba al fútbol.', 35, [
  q('Qual tempo usamos para hábitos contínuos da infância?', 'Cuando era niño jugaba en la calle', '🧒', 'Identifique o tempo verbal', 'Pretérito Imperfecto (jugaba)', 'Pretérito Indefinido (jugué)', 'Presente', 'Futuro', 'O Pretérito Imperfeito expressa hábitos passados frequentes.'),
  q('Qual é a forma imperfeita do verbo "ser" para "yo"?', 'Yo era', '👶', 'Conjugue o verbo ser no imperfeito', 'era', 'fui', 'sido', 'estaba', 'A conjugação é: era, eras, era, éramos, erais, eran.'),
  q('Qual é a forma imperfeita de "ir" para "nosotros"?', 'Íbamos', '🚶‍♂️', 'Conjugue o verbo ir', 'íbamos', 'fuimos', 'íais', 'vamos', 'Íbamos leva acento gráfico na primeira sílaba.'),
  q('Complete com o hábito passado: "Todos los veranos ___ a la playa."', 'Íbamos a la playa', '🏖️', 'Complete a rotina passada', 'íbamos', 'fuimos', 'iremos', 'vamos', 'Para ações rotineiras no passado usa-se o Imperfeito.'),
  q('Qual a terminação regular de -AR no Pretérito Imperfeito?', 'Cantaba, cantabas', '🎤', 'Identifique a terminação', '-aba, -abas, -aba, -ábamos, -abais, -aban', '-é, -aste, -ó', '-ía, -ías, -ía', '-ar, -ares, -aron', 'Verbos em -ar terminam em -aba no imperfeito.'),
  q('Qual a terminação regular de -ER e -IR no Pretérito Imperfeito?', 'Comía, vivía', '🍲', 'Identifique a terminação', '-ía, -ías, -ía, -íamos, -íais, -ían', '-aba, -abas, -aba', '-í, -iste, -ió', '-iera, -ieras', 'Verbos em -er e -ir levam a terminação acentuada -ía.'),
  q('Complete a descrição: "La casa ___ grande y tenía jardín."', 'La casa era grande', '🏡', 'Descreva o imóvel no passado', 'era', 'fue', 'es', 'estuvo', 'Descrições de cenários no passado usam o imperfeito: era grande.'),
  q('Quantos verbos são totalmente irregulares no Pretérito Imperfeito do espanhol?', 'Ser, ir y ver', '🔢', 'Identifique a quantidade', 'Apenas três (ser, ir e ver)', 'Mais de cinquenta', 'Todos os verbos', 'Nenhum, todos são regulares', 'Existem apenas 3 verbos irregulares no imperfeito espanhol: ser, ir e ver.'),
  q('Qual a conjugação de "ver" para "yo" no imperfeito?', 'Yo veía', '👀', 'Conjugue ver', 'veía', 'vi', 'veiba', 'vía', 'A conjugação é: yo veía.'),
  q('O que a frase expressa: "Hacía mucho frío cuando salí"?', 'Hacía frío', '❄️', 'Interprete a relação temporal', 'O clima de fundo contínuo (imperfeito) durante uma ação pontual (indefinido)', 'Uma previsão futura', 'Uma dúvida no presente', 'Um desejo', 'Hacía frío descreve o cenário quando a ação pontual (salí) ocorreu.')
]);

// 17
addUnit('es-17', 'B2 · Avançado', '✨', 'El Modo Subjuntivo: Deseos y Dudas', 'Ojalá que haga sol e quiero que vengas.', 40, [
  q('Complete: "¡Ojalá que mañana ___ buen tiempo!"', 'Ojalá que mañana haga buen tiempo', '☀️', 'Conjugue no subjuntivo', 'haga', 'hace', 'hará', 'hacía', '"Ojalá que" exige o presente do subjuntivo: haga.'),
  q('Complete a expressão de desejo: "Quiero que tú ___ con nosotros."', 'Quiero que tú vengas', '🎉', 'Conjugue venir', 'vengas', 'vienes', 'vendrás', 'ven', 'Com sujeitos diferentes, o verbo querer exige subjuntivo: que vengas.'),
  q('Complete a dúvida: "Dudo que él ___ la verdad."', 'Dudo que él diga la verdad', '🤫', 'Conjugue decir', 'diga', 'dice', 'dirá', 'dijo', 'Verbos de dúvida (dudar) exigem modo subjuntivo: diga.'),
  q('Complete a certeza: "Es verdad que ella ___ español muy bien."', 'Es verdad que habla español', '🇪🇸', 'Identifique o modo da certeza', 'habla', 'hable', 'hablara', 'hablaría', 'Expressões de certeza objetiva (es verdad) usam indicativo: habla.'),
  q('Complete com conselho: "Es importante que você ___ agua."', 'Es importante que bebas agua', '💧', 'Conjugue beber', 'bebas', 'bebes', 'beberás', 'bebiste', 'Expressões impessoais de importância exigem subjuntivo: bebas.'),
  q('Complete a hipótese futura: "Cuando yo ___ tiempo, te llamaré."', 'Cuando yo tenga tiempo', '⏱️', 'Conjugue tener', 'tenga', 'tengo', 'tendré', 'tuve', 'Quando "cuando" refere-se a tempo futuro, exige subjuntivo: tenga.'),
  q('Complete com esperança: "Espero que te ___ bien en el examen."', 'Espero que te vaya bien', '📝', 'Conjugue ir', 'vaya', 'va', 'irá', 'fuese', 'Esperar que exige subjuntivo: que te vaya bien.'),
  q('Como dizer "Não acho que seja uma boa ideia"?', 'No creo que sea una buena idea', '💡', 'Selecione a frase', 'No creo que sea una buena idea', 'No creo que es buena idea', 'No pienso que será idea', 'Dudo que es idea', 'No creer exige subjuntivo: sea.'),
  q('Complete: "Buscamos un hotel que ___ piscina."', 'Que tenga piscina', '🏊', 'Objeto indefinido', 'tenga', 'tiene', 'tendrá', 'tenía', 'Quando o antecedente é indeterminado ou procurado, usa-se subjuntivo: tenga.'),
  q('Qual é o presente do subjuntivo de "ser" para "yo"?', 'Yo sea', '🌟', 'Identifique a forma', 'sea', 'soy', 'fuese', 'sería', 'O presente do subjuntivo de ser é: sea, seas, sea, seamos, seáis, sean.')
]);

// 18
addUnit('es-18', 'B2 · Avançado', '🔮', 'Futuro Simple y Condicional', 'Viajaré el próximo año e me gustaría pedir.', 40, [
  q('Como dizer "Eu viajarei ano que vem"?', 'Viajaré el próximo año', '🧳', 'Escolha o futuro regular', 'Viajaré el próximo año', 'Voy viajar año próximo', 'Viajo en futuro', 'He de viajar', 'A terminação de futuro para yo (-ar, -er, -ir) é "-é": viajaré.'),
  q('Qual é a raiz irregular de "hacer" no futuro?', 'Haré', '✍️', 'Identifique a raiz', 'har- (haré, harás, hará)', 'hac- (haceré)', 'hiz- (hizeré)', 'hag- (hagaré)', 'Hacer vira har- no futuro e condicional.'),
  q('Qual é a raiz de "tener" no futuro?', 'Tendré', '💼', 'Identifique a raiz', 'tendr- (tendré, tendrás)', 'ten- (teneré)', 'tuv- (tuveré)', 'teng- (tengaré)', 'Tener vira tendr- no futuro.'),
  q('Como fazer um pedido com extrema delicadeza?', 'Me gustaría un vaso de agua', '🙏', 'Selecione o condicional de cortesia', 'Me gustaría un vaso de agua', 'Quiero agua ya', 'Deme agua rápido', 'Voy a tener agua', '"Me gustaría..." suaviza pedidos com elegância.'),
  q('Complete a 2ª condicional hipotética: "Si tuviera dinero, ___ por el mundo."', 'Viajaría por el mundo', '🌍', 'Conjugue viajar no condicional', 'viajaría', 'viajaré', 'viajo', 'viajase', 'A consequência de uma hipótese com subjuntivo pretérito é o condicional: viajaría.'),
  q('Qual a terminação regular do condicional para todas as pessoas?', '-ía, -ías, -ía, -íamos, -íais, -ían', '📐', 'Identifique as terminações', '-ía, -ías, -ía, -íamos, -íais, -ían', '-é, -ás, -á', '-ara, -aras, -ara', '-ré, -rás, -rá', 'O condicional simples usa -ía adicionado ao infinitivo.'),
  q('Como expressar probabilidade no presente com o futuro?', '¿Dónde estará Carlos?', '🔍', 'Identifique o uso de probabilidade', '¿Dónde estará Carlos? (Onde será que está Carlos?)', 'Carlos viajará amanhã', 'Carlos nunca esteve aqui', 'Carlos foi embora ontem', 'O futuro em espanhol expressa dúvida ou probabilidade no presente.'),
  q('Qual o futuro do verbo "poner" para "yo"?', 'Pondré', '📌', 'Identifique a raiz irregular', 'Pondré', 'Poneré', 'Pusé', 'Pongaré', 'Poner tem raiz irregular: pondré.'),
  q('Qual o futuro de "decir" para "nosotros"?', 'Diremos', '🗣️', 'Conjugue decir no futuro', 'Diremos', 'Deciremos', 'Diríamos', 'Dijimos', 'Decir tem raiz dir-: diremos.'),
  q('Como dizer "Eu preferiria ficar em casa hoje"?', 'Preferiría quedarme en casa hoy', '🏡', 'Escolha o condicional', 'Preferiría quedarme en casa hoy', 'Preferiré estar en casa', 'Quiero casa ahora', 'Prefiero quedado casa', 'Preferiría expressa preferência hipotética polida.')
]);

// 19
addUnit('es-19', 'B2 · Avançado', '🗣️', 'Modismos y Frases Hechas', 'No tener pelos en la lengua e estar en las nubes.', 40, [
  q('O que significa dizer que alguém "no tiene pelos en la lengua"?', 'No tiene pelos en la lengua', '💬', 'Identifique a expressão', 'Fala a verdade com sinceridade e sem rodeios', 'Tem dor de dente', 'Fala baixinho', 'Fica em silêncio', 'Expressão para quem fala abertamente a verdade.'),
  q('O que significa "Estar en las nubes"?', 'Estar en las nubes', '☁️', 'Identifique o estado mental', 'Estar distraído ou no mundo da lua', 'Estar voando de avião', 'Estar muito feliz', 'Estar chovendo', '"Estar en las nubes" significa estar desatento.'),
  q('O que significa "Tirar la toalla"?', 'Tirar la toalla', '🏳️', 'Identifique a atitude', 'Desistir de algo diante das dificuldades', 'Lavar a roupa de banho', 'Ir à praia nadar', 'Comemorar uma vitória', '"Tirar la toalla" é uma metáfora do boxe para desistir.'),
  q('O que significa a expressão "Tomar el pelo a alguien"?', 'Tomar el pelo', '💇', 'Identifique a brincadeira', 'Zombar amigavelmente / pregar uma peça em alguém', 'Cortar o cabelo de alguém', 'Puxar o cabelo em uma briga', 'Elogiar o penteado', '"Tomar el pelo" significa caçoar ou brincar com alguém.'),
  q('O que significa "Costar un ojo de la cara"?', 'Costar un ojo de la cara', '💸', 'Identifique o preço', 'Custar uma fortuna / ser caríssimo', 'Ser muito barato', 'Ser doado gratuitamente', 'Custar pouco esforço', 'Expressão para itens extremamente caros.'),
  q('O que significa "Ser pan comido"?', 'Es pan comido', '🍞', 'Identifique a facilidade', 'Ser muito fácil / uma moleza', 'Estar com fome', 'Comer pão na padaria', 'Ser muito antigo', '"Pan comido" é o equivalente a "moleza / bico".'),
  q('O que significa "Estar hasta las narices"?', 'Estar hasta las narices', '😤', 'Identifique o sentimento', 'Estar de saco cheio / farto de uma situação', 'Estar gripado com coriza', 'Estar com frio no rosto', 'Estar cheirando perfume', '"Estar hasta las narices" significa estar saturado / sem paciência.'),
  q('O que significa "Meter la pata"?', 'Meter la pata', '🐾', 'Identifique o erro', 'Cometer uma gafe / pisar na bola', 'Acelerar o carro', 'Chutar uma bola com força', 'Caminhar descalço', '"Meter la pata" significa cometer um deslize embaraçoso.'),
  q('O que significa "Dar en el clavo"?', 'Dar en el clavo', '🔨', 'Identifique o acerto', 'Acertar em cheio / dar a resposta precisa', 'Martelar o dedo', 'Comprar ferramentas', 'Errar a direção', '"Dar en el clavo" significa acertar com precisão.'),
  q('O que significa "Hacer la vista gorda"?', 'Hacer la vista gorda', '🙈', 'Identifique a atitude', 'Fingir que não viu uma infração / tolerar', 'Comer muito na janta', 'Usar óculos grossos', 'Ficar cego de raiva', '"Hacer la vista gorda" significa fingir não ver.')
]);

// 20
addUnit('es-20', 'B2 · Avançado', '🎉', 'Jerga y Expresiones del Mundo Hispano', 'Chévere, guay, buena onda, vale e molar.', 40, [
  q('Na Espanha, a gíria "¡Qué guay!" significa:', '¡Qué guay!', '🤩', 'Identifique a gíria espanhola', 'Que legal / Muito bacana!', 'Que triste!', 'Que confuso!', 'Que caro!', '"Guay" é o clássico "legal" da Espanha.'),
  q('Na Colômbia e Venezuela, o termo "Chévere" expressa:', 'Chévere', '🇨🇴', 'Identifique a gíria caribenha', 'Ótimo / muito legal / excelente', 'Comida apimentada', 'Pessoa chata', 'Problema financeiro', '"Chévere" é um elogio universal na região andina/caribenha.'),
  q('No México e Argentina, "Buena onda" refere-se a:', 'Buena onda', '🇲🇽', 'Identifique a expressão social', 'Pessoa simpática / energia positiva e agradável', 'Música alta', 'Onda do mar perigosa', 'Clima quente de praia', '"Buena onda" descreve alguém simpático e acolhedor.'),
  q('Na Espanha, o que expressa o termo onipresente "¡Vale!"?', '¡Vale!', '🇪🇸', 'Identifique o significado coloquial', 'Entendido! / Combinado! / Tudo bem!', 'Valor monetário', 'Adeus para sempre', 'Não quero isso', '"Vale" é usado dezenas de vezes ao dia para concordar.'),
  q('Na Espanha, o que significa o verbo coloquial "Molar"?', 'Esta canción mola mucho', '🎸', 'Identifique o verbo de gíria', 'Agradar muito / ser muito legal e bacana', 'Fazer barulho irritante', 'Quebrar um instrumento', 'Tocar violão desafinado', '"Molar" significa ser muito legal.'),
  q('No México, o que significa a gíria "¡Qué padre!"?', '¡Qué padre!', '🌮', 'Identifique a gíria mexicana', 'Que legal / que incrível!', 'Que homem sério!', 'Que pai bravo!', 'Que lugar distante!', '"¡Qué padre!" no México significa fantástico ou excelente.'),
  q('Na Argentina e Uruguai, o que significa "Che"?', '¡Che, mirá esto!', '🇦🇷', 'Identifique o vocativo rio-platense', 'Forma coloquial de chamar a atenção de alguém (como "ouviu?", "cara")', 'Comida típica de carne', 'Despedida formal', 'Pedido de desculpas', '"Che" é o vocativo característico dos argentinos e uruguaios.'),
  q('No Chile, a gíria "Cachái" significa:', '¿Cachái?', '🇨🇱', 'Identifique a gíria chilena', 'Você entende? / Sacou?', 'Você tem pressa?', 'Onde você mora?', 'Qual é seu preço?', '"Cachái" vem do inglês to catch e significa "entendeu?".'),
  q('Na Argentina, como é chamado um amigo próximo?', 'Un pibe / Un chabón', '👥', 'Identifique o termo rio-platense', 'Pibe (jovem) / amigo', 'Jefe de oficina', 'Señor mayor', 'Extranjero', '"Pibe" significa jovem ou garoto na Argentina.'),
  q('O que significa "Estar flipando" na gíria espanhola?', 'Estoy flipando', '🤯', 'Identifique a reação de espanto', 'Estar chocado, maravilhado ou surpreso', 'Estar com sono profundo', 'Estar com fome', 'Estar nadando na piscina', '"Flipando" expressa choque ou admiração intensa.')
]);

console.log('Spanish units generated: 20');
fs.writeFileSync('scratch/lessons_es.json', JSON.stringify(lessons, null, 2));
