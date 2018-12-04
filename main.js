
console.log('Hello from main.js. Welcome to Boolzapp');


//MILESTONE 1
// Aggiunta di un messaggio: l’utente scrive un testo nella parte bassa e cliccando invia il testo viene aggiunto al thread sopra, come messaggio verde

//Per ora senza conservare una cronologia messaggi aggiungo solamente

var inputField = $('#message_input');
var sendMessageBtn = $('#send_message');
var micBtn = $('#trigger_mic');
var messagesArea = $('.messages_area');
var userMessageTemplate = $('.message.user_message.template');
var contactMessageTemplate = $('.message.contact_message.template');

//alla prima digitazione nel campo input appare il tasto invia
//e il tasto microfono viene nascosto
inputField.keypress(function () {
  if (sendMessageBtn.css('display') == 'none') {
    sendMessageBtn.show();
    micBtn.hide();
  }
});

//alla pressione del tasto invia
//recupera il tasto dal field e popola il testo
//nel messaggio template che viene poi aggiunto alla pagina
sendMessageBtn.click(function () {
  addNewMessageFrom(inputField.val(), userMessageTemplate, messagesArea);
  inputField.val('');
  sendMessageBtn.hide();
  micBtn.show();
  addNewMessageFrom('Ok', contactMessageTemplate, messagesArea);
});


function addNewMessageFrom(text, templateMessage, tagToAppend) {
  var template = templateMessage.clone();
  template.children('.message_text').text(text);
  template.removeClass('template');
  tagToAppend.append(template);
}
