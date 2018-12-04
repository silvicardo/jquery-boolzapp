
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

/********* AREA MESSAGGI ********/


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
  setTimeout(function () {
    addNewMessageFrom('Ok', contactMessageTemplate, messagesArea);
    micBtn.show();
  }, 1000);
});

function addNewMessageFrom(text, templateMessage, tagToAppend) {
  var template = templateMessage.clone();
  template.children('.message_text').text(text);
  template.removeClass('template');
  tagToAppend.append(template);
}

/************ AREA RICERCA ******************/
var inputRicerca = $('#search_bar_input');
var contactsArea = $('.contacts_list');
var activeContacts = contactsDatabase;
var contactTemplate = $('.contact.template');

console.log(activeContacts);

//Al primo lancio mostra i contatti da cui si hanno dei messaggi
manageContactsListFrom(activeContacts, contactTemplate, contactsArea);

//poi ad ogni rilascio di un tasto con l'input selezionato
inputRicerca.on({
  keyup: function () {
    removeAllContactsFromList();
    var searchResult = getContactsFrom(activeContacts, inputRicerca.val());
    console.log(searchResult);
    manageContactsListFrom(searchResult, contactTemplate, contactsArea);
  },
});

function getContactsFrom(database, searchParameter) {

  var result = [];
  if (searchParameter != null) {
    for (var i = 0; i < database.length; i++) {
      if (database[i].fullName.includes(searchParameter)) {
        result.push(database[i]);
      }
    }

    return result;
  }
  //returns all activeContacts if there is no parameter
  return database;
}

function manageContactsListFrom(contactGroup, contactTemplate, tagToAppend) {
  for (var i = 0; i < contactGroup.length; i++) {
    var contact = contactTemplate.clone();
    var contactName = contact.find('.contact_name');
    var latestMessage = contact.find('.last_message');
    latestMessage.text('Check messaggio');
    contactName.text(contactGroup[i].fullName);
    contact.removeClass('template');
    contact.addClass('real');
    if (i == 0) {
      contact.addClass('selected');
    }

    tagToAppend.append(contact);
  }

}

function removeAllContactsFromList(){
  $('.contact.real').each(function () {
    $(this).remove();
  });
}
