
// creazione dei dati
var riccardoSilvi = {
  fullName: 'Riccardo Silvi',
  conversation: [],
};
var emanueleMazzante = {
  fullName: 'Emanuele Mazzante',
  conversation: [],
};
var michelePapagni = {
  fullName: 'Michele Papagni',
  conversation: [],
};
var fabioForghieri = {
  fullName: 'Fabio Forghieri',
  conversation: [],
};
var javascriptLanguage = {
  fullName: 'Javascript',
  conversation: [],
};
var chiaraPassaro = {
  fullName: 'Chiara Passaro',
  conversation: [],
};
var paolaPoggini = {
  fullName: 'Paola Poggini',
  conversation: [],
};
var giuseppeBarbara = {
  fullName: 'Giuseppe Barbara',
  conversation: [],
};
var gianlucaBianco = {
  fullName: 'Matteo Pelosi',
  conversation: [],
};
var diegoAneli = {
  fullName: 'Diego Aneli',
  conversation: [],
};

var appUser = riccardoSilvi;
var activeContactsDatabase = [diegoAneli, gianlucaBianco, giuseppeBarbara, paolaPoggini, chiaraPassaro, javascriptLanguage, fabioForghieri, michelePapagni, emanueleMazzante];

generateRandomConversationsFor(activeContactsDatabase);

console.log(activeContactsDatabase);


/***************** RANDOM MESSAGES ******************/

function generateRandomConversationsFor(activeContacts) {

  for (var i = 0; i < activeContacts.length; i++) {
    activeContacts[i].conversation = randomConversation();
  }

}

function randomConversation() {

  var messagesAmount = getRandomNumber(3, 7);
  var conversation = [];
  for (var i = 0; i < messagesAmount; i++) {
    conversation.push(randomMessage());
  }

  return conversation;
}

function randomMessage() {
  var newMessage = {
    message: 'Bacon ipsum dolor amet jerky chuck shankle swine pork loin ribeye',
  };
  newMessage.date = '10:35';
  newMessage.isContactMessage = (getRandomNumber(0, 1) != 1) ? false : true;

  return newMessage;
}

function getRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}
