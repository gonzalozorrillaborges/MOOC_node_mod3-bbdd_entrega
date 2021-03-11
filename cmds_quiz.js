
const {User, Quiz, Score} = require("./model.js").models;
const scores = require("./cmds_score.js");

// Show all quizzes in DB including <id> and <author>
exports.list = async (rl) =>  {

  let quizzes = await Quiz.findAll(
    { include: [{
        model: User,
        as: 'author'
      }]
    }
  );
  quizzes.forEach( 
    q => rl.log(`  "${q.question}" (by ${q.author.name}, id=${q.id})`)
  );
}

// Create quiz with <question> and <answer> in the DB
exports.create = async (rl) => {

  let name = await rl.questionP("Enter user");
    let user = await User.findOne({where: {name}});
    if (!user) throw new Error(`User ('${name}') doesn't exist!`);

    let question = await rl.questionP("Enter question");
    if (!question) throw new Error("Response can't be empty!");

    let answer = await rl.questionP("Enter answer");
    if (!answer) throw new Error("Response can't be empty!");

    await Quiz.create( 
      { question,
        answer, 
        authorId: user.id
      }
    );
    rl.log(`   User ${name} creates quiz: ${question} -> ${answer}`);
}

// Test (play) quiz identified by <id>
exports.test = async (rl) => {

  let id = await rl.questionP("Enter quiz Id");
  let quiz = await Quiz.findByPk(Number(id));
  if (!quiz) throw new Error(`  Quiz '${id}' is not in DB`);

  let answered = await rl.questionP(quiz.question);

  if (answered.toLowerCase().trim()===quiz.answer.toLowerCase().trim()) {
    rl.log(`  The answer "${answered}" is right!`);
  } else {
    rl.log(`  The answer "${answered}" is wrong!`);
  }
}

// Play quiz identified by <id>
exports.play = async (rl) => {
  //modificacoines
  //let lista = [];
  
  let long = await Quiz.count();
  let quizzes_all = await Quiz.findAll();
  let quiz_p;
  let lista_ordenada =[];
  let elemento_lista;
  let lista_reordenada =[];
  let answered;
  let score = 0;


  // Se crea una lista con los id de las preguntas
  quizzes_all.forEach(element => {
  lista_ordenada.push(element.id);
    
    //Linea comentada para efectos de depuración del programa
    //rl.log(`Un id de pregunta en la lista ordenada es ${element.id}`);
  })

  //Se reordena la lista sacando elementos de la lista ordenada de manera aleatoria y colocandolos en una nueva lista
  for (i = 0; i < long ; i++){
    elemento_lista = lista_ordenada.splice((Math.floor(Math.random()*(long-i))),1);
    lista_reordenada.push(elemento_lista);
    
    //Linea para efectos de depuración del programa comentada
    //rl.log(`Un elemento de la lista reordenada es ${elemento_lista}`);
  };

  //Linea comentada para efectos de depuracion
  //rl.log(`Tenemos un total de ${long}`);

  //lista_reordenada.forEach( async element => {
  
  for (i = 0; i < long ; i++){ 
    quiz_p = await Quiz.findByPk(Number(lista_reordenada[i]));

    
    //lineas comentadas para efectos de depuración... 
    //Se puede ver la pregunta y respuesta justo antes de responder para tener la respuesta
    //rl.log(`La pregunta es: ${quiz_p.question} y la respuesta es: ${quiz_p.answer}`);

    //if (!quiz_p) throw new Error(`  Quiz '${id}' is not in DB`);

    answered = await rl.questionP(quiz_p.question);
    if (answered.toLowerCase().trim()===quiz_p.answer.toLowerCase().trim()) {
      rl.log(`  The answer "${answered}" is right!`);
      score++;
    } else {
      rl.log(`  The answer "${answered}" is wrong!`);
      i = long;
      //rl.log(`   Score: ${score}`);
      //return;
    }
    
  };

  //se muestra la puntuacion
  rl.log(`   Score: ${score}`);

  //se consulta el nombre para poder crear un nuevo registro en la tabla scores
  let name = await rl.questionP("Enter name");
  if (!name) throw new Error("Response can't be empty!");

  //Busca el usuario en la base de datos para cargar la puntuación 
  let user = await User.findOne({
    where: {name},
  });

  //Si el usuario no existe, crea el usuario y lo busca para tener los datos
  //para crear el score con el user.id correspondiente
  if (!user) {
    await User.create( 
      { name, age: 0 }
    );

    user = await User.findOne({
      where: {name},
    });
  }

  let userId = user.id;

  let verif = await scores.create(userId,score);
  if(!verif) throw new Error("No se pudo crear la puntuación");

  //Guarda en la base de datos los puntos ganados en la columna win y el user.id en el alias userId
  /*
  await Score.create(
    {wins: score,
    userId: user.id}
  );
  */

  //Muestra los puntos optenidos después de almacenarlo en la base de datos
  rl.log(`   User ${name} get ${score} points`);

}

// Update quiz (identified by <id>) in the DB
exports.update = async (rl) => {

  let id = await rl.questionP("Enter quizId");
  let quiz = await Quiz.findByPk(Number(id));

  let question = await rl.questionP(`Enter question (${quiz.question})`);
  if (!question) throw new Error("Response can't be empty!");

  let answer = await rl.questionP(`Enter answer (${quiz.answer})`);
  if (!answer) throw new Error("Response can't be empty!");

  quiz.question = question;
  quiz.answer = answer;
  await quiz.save({fields: ["question", "answer"]});

  rl.log(`  Quiz ${id} updated to: ${question} -> ${answer}`);
}

// Delete quiz & favourites (with relation: onDelete: 'cascade')
exports.delete = async (rl) => {

  let id = await rl.questionP("Enter quiz Id");
  let n = await Quiz.destroy({where: {id}});
  
  if (n===0) throw new Error(`  ${id} not in DB`);
  rl.log(`  ${id} deleted from DB`);
}

