
console.log('Hello from main.js. Welcome to Boolzapp');


//MILESTONE 1
// Aggiunta di un messaggio: l’utente scrive un testo nella parte bassa e cliccando invia il testo viene aggiunto al thread sopra, come messaggio verde

//***********CARICAMENTO DATABASE COMPLETO **************//
var activeContacts = activeContactsDatabase;
var selectedContact = activeContactsDatabase[0];
var queryResult = [];
var isSearching = false;

//***********PUNTATORI JQUERY **************//
var inputField = $('#message_input');
var sendMessageBtn = $('#send_message');
var micBtn = $('#trigger_mic');
var messagesArea = $('.messages_area');
var userMessageTemplate = $('.message.user_message.template');
var contactMessageTemplate = $('.message.contact_message.template');
var inputRicerca = $('#search_bar_input');
var contactsArea = $('.contacts_list');
var contactTemplate = $('.contact.template');

//*********** PRIMO LANCIO **************//

console.log(activeContacts);

//Al primo lancio mostra i contatti da cui si hanno dei messaggi
manageContactsListFrom(activeContacts, contactTemplate, contactsArea);
//e gestisce l'area della chat corrente per il primo contatto
manageChatAreaFor(activeContacts[0]);

//gestisce la nav destra in rapporto alla conversazione aperta
manageTopRightBarFor(activeContacts[0]);

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
  var messaggio =  inputField.val();
  addNewMessageFrom(messaggio, userMessageTemplate, messagesArea);
  updateDatabaseFrom(messaggio, selectedContact, false);
  inputField.val('');
  sendMessageBtn.hide();
  setTimeout(function () {
    addNewMessageFrom('Ok', contactMessageTemplate, messagesArea);
    updateDatabaseFrom('Ok', selectedContact, true);
    micBtn.show();
  }, 1000);
});

function addNewMessageFrom(text, templateMessage, tagToAppend) {
  var template = templateMessage.clone();
  template.children('.message_text').text(text);
  template.removeClass('template');
  template.addClass('real');
  tagToAppend.append(template);
}

function updateDatabaseFrom(message, selectedContact, isContactMessage) {
  console.log('updating with ' + message);
  console.log(selectedContact);
  //nuovo messaggio da testo, Booleano vero se messaggio Contatto,
  //falso se messaggio utente
  var newMessage = newObjectMessageFrom(message, isContactMessage);
  selectedContact.conversation.push(newMessage);
}

//Gestione dropdown

$('.dropdown_menu.message_actions .fa-caret-down').click(function(){
  toggleStatusFor($(this).parent());
});

$('.dropdown_menu .dropdown_options').mouseleave(function(){
  toggleStatusFor($(this).parent());
});

$('.dropdown_menu .dropdown_options li.delete').click(function () {
  console.log('cliccato dropdown delete');
  //solo ui
  var dropdownMenu = $(this).parent().parent();
  var currentMessage = dropdownMenu.parent();
  currentMessage.remove();
  //da gestire lato dati

});

function toggleStatusFor(dropdown){
  console.log('togglo da click');
  dropdown.toggleClass('active').toggleClass('waiting');
}


/************ AREA RICERCA-LISTA CONTATTI ******************/

//poi ad ogni rilascio di un tasto con l'input selezionato
inputRicerca.on({
  keyup: function () {
    if (inputRicerca.val() == '' && event.wich == 8) {
      console.log('ricerca vuota');
      isSearching = false;
      manageContactsListFrom(activeContacts, contactTemplate, contactsArea);
      manageChatAreaFor(activeContacts[0]);
      manageTopRightBarFor(activeContacts[0]);
    } else {
      isSearching = true;
      removeAllContactsFromList();
      queryResult = getContactsFrom(activeContacts, inputRicerca.val());
      if (queryResult.length > 0) {
        console.log(queryResult);
        console.log(queryResult.length + ' risultati trovati');
        removeAllDisplayedMessages();
        manageContactsListFrom(queryResult, contactTemplate, contactsArea);
        //aggiorno i puntatori per l'evento click
        $(document).on('click', '.contact.real', handleContactClick);
        manageChatAreaFor(queryResult[0]);
        manageTopRightBarFor(queryResult[0]);
      }
    }

  },
});

//al click di un contatto nella lista sinistra
$('.contact.real').click(handleContactClick);

function manageTopRightBarFor(selectedContact) {
  //Recupero gli elementi della nav
  var contactName = $('.conversation_nav .contact_data').find('.contact_name');
  var contactPic = $('.conversation_nav .contact_pic');
  var picSource = 'assets/' + selectedContact.picture;
  //li popolo con i dati dell'utente
  contactName.text(selectedContact.fullName);
  contactPic.attr('src', picSource);

}

function handleContactClick() {
  console.log('cliccato contatto');
  var clickedContact = $(this);
  $('.contact.real').removeClass('selected');
  clickedContact.addClass('selected');
  var contactIndex = $('.contact.real').index(clickedContact);
  console.log(contactIndex);
  removeAllDisplayedMessages();

  selectedContact = (!isSearching) ? activeContacts[contactIndex] : queryResult[contactIndex];

  manageChatAreaFor(selectedContact);
  manageTopRightBarFor(selectedContact);

}

function getContactsFrom(database, searchParameter) {

  var result = [];
  if (searchParameter != null) {

    var lowercasedSearch = searchParameter.toLowerCase();
    var lowerCasedName;
    for (var i = 0; i < database.length; i++) {
      lowerCasedName = database[i].fullName.toLowerCase();
      if (lowerCasedName.includes(lowercasedSearch)) {
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
    //Clone Template Element
    var contact = contactTemplate.clone();
    //Get element's tags
    var contactName = contact.find('.contact_name');
    var latestMessage = contact.find('.last_message');
    var latestMessageDate = contact.find('.last_received_time');
    var contactPicture = contact.find('.contact_pic')
    //change their content
    contactName.text(contactGroup[i].fullName);
    latestMessage.text(contactGroup[i].conversation[0].message);
    latestMessageDate.text(contactGroup[i].conversation[0].date);
    var picSource = 'assets/' + contactGroup[i].picture;
    contactPicture.attr('src', picSource);
    //manage classes
    contact.removeClass('template').addClass('real').removeClass('selected');
    if (i == 0) {
      contact.addClass('selected');
    }
    //add to parent element
    tagToAppend.append(contact);
  }

}

function removeAllContactsFromList() {
  $('.contact.real').each(function () {
    $(this).remove();
  });
}

function removeAllDisplayedMessages() {
  $('.message.real').each(function () {
    $(this).remove();
  });
}

function manageChatAreaFor(selectedContact) {

  console.log(selectedContact.fullName);
  var conversationMessages = selectedContact.conversation;

  for (var i = 0; i < conversationMessages.length; i++) {

    var template = (conversationMessages[i].isContactMessage) ? contactMessageTemplate.clone() : userMessageTemplate.clone();
    template.children('.message_text').text(conversationMessages[i].message);
    template.addClass('real');
    template.removeClass('template');
    messagesArea.append(template);
  }

}
