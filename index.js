'use strict';

const express = require('express');
const app = express();
const PORT = 3000;
const nodemailer = require('nodemailer');
const { createTestAccount } = require('nodemailer');

app.use(express.urlencoded({
    extended: true
}));

app.use(express.static('public'));


//Define global variables for the top and bottom html 
let htmlTop = `
    <!doctype html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta http-equiv="X-UA-Compatible" content="ie=edge">
        <title>Contact Form Submission</title>
        <link rel="stylesheet" href="main.css">
        <link rel="icon" href="favicon.ico" type="image/x-icon">
    </head>
    <body>
        <header>
            <h1>Rocky Cowan</h1>       
        </header>
        <nav>
            <a href="index.html">Home</a>
            <a href="contact.html">Contact</a>
            <a href="gallery.html">Gallery</a>
        </nav>
        <main>
            <section>
                <h2>Contact Form Submission</h2>
                <p>Thank you for submitting the form below:</p>
            </section>
`;

let htmlBottom = `
    </main>
    <footer>
        <p>&#169; Rocky Cowan</p>
    </footer>
</body>
</html>
`;

async function generateTestAccount() {
    const testAccount = await createTestAccount();
    return testAccount;
  }

app.post("/", (req, res) => {
    const name = req.body.name;
    const email = req.body.email;
    const subject = req.body.subject;
    const message = req.body.message;
    const topic = req.body.topic;
    const contactMethod = req.body["contact-method"];
    const newsletters = req.body.newsletter;

     // Send email
  sendMail({ name, email, subject, message })
  .then(() => {
    // Send response to client
    res.send(`${htmlTop}
      <h1>Thank You</h1>
      <p>Dear ${name}, thank you for reaching out to us. We appreciate your interest and we will do our best to get back to you as soon as possible.</p>
      <p>We noticed that you were interested in receiving updates about:</p>
      <ul>
        ${newsletters && newsletters.includes('tech') ? '<li><strong>Tech News</strong></li>' : ''}
        ${newsletters && newsletters.includes('food') ? '<li><strong>Food News</strong></li>' : ''}
        ${newsletters && newsletters.includes('travel') ? '<li><strong>Travel News</strong></li>' : ''}
      </ul>
      <p>Thank you for letting us know!</p>
      <p>Here is a copy of the message you sent:</p>
      <ul>
        <li><strong>Name:</strong> ${name}</li>
        <li><strong>Email:</strong> ${email}</li>
        <li><strong>Subject:</strong> ${subject}</li>
        <li><strong>Message:</strong> ${message}</li>
        <li><strong>Topic:</strong> ${topic}</li>
        <li><strong>Contact Method:</strong> ${contactMethod}</li>
      </ul>
      <p>We'll be in touch soon!</p>
      ${htmlBottom}`);
  })
  .catch((err) => {
    console.error(err);
    res.status(500).send('Error sending email');
  });
});

async function sendMail(userInput) {
    // create reusable transporter object using the default SMTP transport
    let testAccount = await nodemailer.createTestAccount();
    let transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: testAccount.user, // generated ethereal user
        pass: testAccount.pass // generated ethereal password
      }
    });
  
    // send mail with defined transport object
    let info = await transporter.sendMail({
      from: `"${userInput.name}" <${userInput.email}>`, // sender address
      to: 'cowanjoh@oregonstate.edu', // list of receivers
      subject: userInput.subject, // Subject line
      text: userInput.message, // plain text body
      html: `<b>${userInput.message}</b>` // html body
    });
  
    // Preview URL for testing purposes
    console.log('Message sent: %s', info.messageId);
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
  }
  
  // Define the POST route for the form submission
  app.post('/', (req, res) => {
    // Extract the form data
    const name = req.body.name;
    const email = req.body.email;
    const subject = req.body.subject;
    const message = req.body.message;
  
    // Send the email
    sendMail({
      name,
      email,
      subject,
      message
    });
  
    // Send the response
    res.send(`${htmlTop}
              <h1>Thank You</h1>
              <p>Dear ${name}, thank you for reaching out to us. 
              We appreciate your interest and we will do our best to get back to you as soon as possible.</p>
              ...
              ${htmlBottom}`);
  });

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}...`);
});

