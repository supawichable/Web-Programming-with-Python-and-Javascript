document.addEventListener('DOMContentLoaded', function() {

  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', compose_email);

  // By default, load the inbox
  load_mailbox('inbox');
});

function compose_email(is_reply=false, replied_email={}) {

  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';
  if (document.querySelector('#email-view')){
    document.querySelectorAll('#email-view').forEach(prev_email => {
      prev_email.style.display = 'none';
    });
  }
  console.log('Composing');
  console.log(is_reply);
  // Initialize composition fields
  if (is_reply === true) {
    document.querySelector('#compose-recipients').value = replied_email.sender;
    document.querySelector('#compose-subject').value = "Re: " + replied_email.subject;
    document.querySelector('#compose-body').value = "On " 
                                                    + replied_email.timestamp + " "
                                                    + replied_email.sender + " wrote: \n"
                                                    + replied_email.body;
  } else {
    document.querySelector('#compose-recipients').value = '';
    document.querySelector('#compose-subject').value = '';
    document.querySelector('#compose-body').value = '';
  }

  document.querySelector('#compose-form').onsubmit = () => {
    const new_recipients = document.querySelector('#compose-recipients').value;
    const new_subject = document.querySelector('#compose-subject').value;
    const new_body = document.querySelector('#compose-body').value;

    fetch('/emails', {
      method: 'POST',
      body: JSON.stringify({
        recipients: new_recipients,
        subject: new_subject,
        body: new_body
      })
    })
    .then(response => response.json())
    .then(result => {
      console.log(result);
      // set a 100ms delay so that the SQLite finishes updating before view redirect
      setTimeout(function(){ load_mailbox('sent'); }, 100);
    });
    return false;
  };
}

function load_mailbox(mailbox) {
  
  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';
  if (document.querySelector('#email-view')){
    document.querySelectorAll('#email-view').forEach(prev_email => {
      prev_email.style.display = 'none';
    });
  }

  // Show the mailbox name
  document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;

  fetch(`/emails/${mailbox}`)
  .then(response => response.json())
  .then(emails => {
    emails.forEach(function(email) {
      console.log(email);

      var element = document.createElement('div_email');
      // check whether the email has been read (different background colors)
      if(email.read === false) {
        element.className = 'not_read';
      } else {
        element.className = 'read';
      }

      // email's subject (bold)
      const span_subject = document.createElement("div");
      span_subject.className = "span_subject";
      span_subject.innerHTML = email.subject;
      span_subject.append(document.createElement("br"));

      // sender's and time stamp
      const span_details = document.createElement("div");
      span_details.className = "span_details";
      const newSender = document.createTextNode("from: " + email.sender);
      const newRecipients = document.createTextNode("to: " + email.recipients); 
      const newTimestamp = document.createTextNode(email.timestamp);

      // not showing sender in sent page
      if (mailbox != 'sent') {
        span_details.append(newSender);
        span_details.append(document.createElement("br"));
      }
      span_details.append(newRecipients);
      span_details.append(document.createElement("br"));
      span_details.append(newTimestamp);
      span_details.append(document.createElement("br"));

      element.append(span_subject);
      element.append(span_details);
      element.onclick = function() {
        load_email(email.id, mailbox);
      }

      document.querySelector("#emails-view").append(element);
    })
  });

  return false;
}

function load_email(id, mailbox){

  // hide mailbox and compose views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'none';
  // hide every other email-view that exists
  if (document.querySelector('#email-view')){
    document.querySelectorAll('#email-view').forEach(prev_email => {
      prev_email.style.display = 'none';
    });
  }

  // GET email and display
  fetch(`/emails/${id}`)
  .then(response => response.json())
  .then(email => {
    // print email
    console.log(email);
    // create a new element for email-view
    let email_view = document.createElement("div");
    email_view.id = "email-view";
    // email's subject
    const subject = document.createElement("div");
    subject.className = "span_subject";
    subject.innerHTML = email.subject;
    subject.append(document.createElement("br"));
    subject.append(document.createElement("hr"));

    // email's details (sender, recipients, timestamp)
    let details = document.createElement("div");
    details.className = "span_details";
    details.append(document.createTextNode("from: "+ email.sender));
    details.append(document.createElement("br"));
    details.append(document.createTextNode("to: "+ email.recipients));
    details.append(document.createElement("br"));
    details.append(document.createTextNode(email.timestamp));

    // "mark as" button
    let mark_as_button = document.createElement("button");
    mark_as_button.className = "btn btn-sm btn-outline-primary float-right";
    mark_as_button.id = "mark_as";
    mark_as_button.innerHTML = "Mark as unread";
    details.append(mark_as_button);
    // PUT read status to the email being opened
    mark_as_read(email.id);
    // mark as read/mark as unread
    mark_as_button.addEventListener('click', () => {
      if (mark_as_button.innerHTML === 'Mark as read') {
        mark_as_read(email.id);
        console.log('marked as read');
        mark_as_button.innerHTML = "Mark as unread";
      } else {
        mark_as_unread(email.id);
        console.log('marked as unread');
        mark_as_button.innerHTML = "Mark as read";
      }
    });

    // "archive" button
    if (mailbox != 'sent') {
      let archive_button = document.createElement("button");
      archive_button.className = "btn btn-sm btn-outline-primary float-right";
      archive_button.id = "archive";
      if (email.archived === true) { 
        archive_button.innerHTML = "Unarchive";
      } else {
        archive_button.innerHTML = "Archive";
      }
      details.append(archive_button);
      // archive/unarchive
      archive_button.addEventListener('click', () => {
        if (archive_button.innerHTML === 'Archive') {
          archive(email.id);
          console.log('archived');
          archive_button.innerHTML = "Unarchive";
        } else {
          unarchive(email.id);
          console.log('unarchived');
          archive_button.innerHTML = "Archive";
        }
        // set a 100ms delay so that the SQLite finishes updating before view redirect
        setTimeout(function(){ load_mailbox('inbox'); }, 100);
      });
    }

    // "reply" button
    let reply_button = document.createElement("reply");
    reply_button.className = "btn btn-sm btn-outline-primary float-right";
    reply_button.id = "reply";
    reply_button.innerHTML = "Reply";
    details.append(reply_button);
    details.append(document.createElement("br"));
    details.append(document.createElement("hr"));
    // reply
    reply_button.addEventListener('click', () => compose_email(is_reply = true, replied_email = email));

    // email's body
    const span_body = document.createElement("div");
    span_body.className = "span_body";
    body = email.body.replace(/(\r\n|\n|\r)/gm, "<br>");
    span_body.innerHTML = body;
    span_body.append(document.createElement("br"));

    email_view.append(subject);
    email_view.append(details);
    email_view.append(span_body);
    document.body.append(email_view);

  });
  
  return false;
}

function mark_as_read(id){
  fetch(`/emails/${id}`, {
    method: 'PUT',
    body: JSON.stringify({
      read: true
    })
  })
}

function mark_as_unread(id){
  fetch(`/emails/${id}`, {
    method: 'PUT',
    body: JSON.stringify({
      read: false
    })
  })
}

function archive(id){
  fetch(`/emails/${id}`, {
    method: 'PUT',
    body: JSON.stringify({
      archived: true
    })
  })
}

function unarchive(id){
  fetch(`/emails/${id}`, {
    method: 'PUT',
    body: JSON.stringify({
      archived: false
    })
  })
}