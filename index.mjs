'use strict';

import express from 'express';
import asyncHandler from 'express-async-handler';
import products from './products.js';
import { config } from 'dotenv';
import nodemailer from 'nodemailer';
import { createTestAccount } from 'nodemailer';

config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

//Define global variables for the top and bottom html 
let htmlTop = `
    <!doctype html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta http-equiv="X-UA-Compatible" content="ie=edge">
        <title>Order Form Submission</title>
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
            <a href="order.html">Order</a>
        </nav>
        <main>
`;

let htmlTopContact = `
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
            <a href="order.html">Order</a>
        </nav>
        <main>
            <section>
                <h2>Contact Form Submission</h2>
                <p>Thank you for reaching out to us! Here are your message details:</p>
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
  app.post('/contact', (req, res) => {
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
  res.send(`${htmlTopContact}
  <h1>Thank You</h1>
  <p>Dear ${name}, thank you for reaching out to us. 
  We appreciate your interest and we will do our best to get back to you as soon as possible.</p>
  <p>Here is a copy of the message you sent:</p>
  <ul>
    <li><strong>Name:</strong> ${name}</li>
    <li><strong>Email:</strong> ${email}</li>
    <li><strong>Subject:</strong> ${subject}</li>
    <li><strong>Message:</strong> ${message}</li>
  </ul>
  <p>We'll be in touch soon!</p>
  ${htmlBottom}`);
});


// This function takes a product name as an argument
function getSelectedProduct(productName) {
  // Loop through the `products` array to find a product with a matching name
  for (let product of products) {
    // Compare the lowercase version of the product name to the lowercase version of the `productName` argument
    if (product.product.toLowerCase() === productName.toLowerCase()) {
      // If a match is found, return the matching product object
      return product;
    }
  }
  // If no match is found, return null
  return null;
}


app.post('/submit-order', (req, res) => {
  // extract data from the order form
  const name = req.body.name;
  const address = req.body.address;
  const productName = req.body.product;
  const quantity = parseInt(req.body.quantity);
  const deliveryInstructions = req.body['delivery-instructions'];
  
  // find the selected product object
  const selectedProduct = getSelectedProduct(productName);
  if (!selectedProduct) {
    // if the selected product is invalid, send an error message and return from the function
    res.send('Invalid product selected');
    return;
  }
  
  // calculate the total price of the order and format it as US currency
  const totalPrice = selectedProduct.price * quantity;
  const formattedPrice = totalPrice.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
  
  // construct the order details HTML
  const orderDetails = `
    <h2>Order Details</h2>
    <ul>
      <li><strong>Name:</strong> ${name}</li>
      <li><strong>Address:</strong> ${address}</li>
      <li><strong>Product:</strong> ${selectedProduct.product}</li>
      <li><strong>Total Price:</strong> ${formattedPrice}</li>
      <li><strong>Quantity:</strong> ${quantity}</li>
      <li><strong>Delivery Instructions:</strong> ${deliveryInstructions}</li>
    </ul>
  `;
  
  // construct the success message HTML
  const successMessage = `
    <h1>Thank You!</h1>
    <p>Dear ${name}, thank you for placing your order. Your order has been received and will be processed shortly. Here are the details of your order:</p>
    ${orderDetails}
  `;

  // send the success message and the HTML top and bottom to the client
  res.send(`${htmlTop}
            <section>
              ${successMessage}
            </section>
            ${htmlBottom}`);
});

// Define a variable to count every 10 calls to the API
let callCount = 0;

// Define a variable to initialize the API call at 0
let apiCalls = 0;

// Middleware to increment API call count and output a sentence every 10 calls
app.use((req, res, next) => {
  // Increment API call count by 1
  apiCalls++;

  // Check if the call count is a multiple of 10
  if (apiCalls % 10 === 0) {
    // Output a complete sentence in the console
    console.log(`API call count is ${apiCalls}.`);
  }

  next(); // Call the next middleware or route handler
});


// Route for the 'from Express' button click
app.use('/from-express', (req, res) => {
  // Increment API call count by 1
  apiCalls++;

  res.send('Button clicked!'); // Send response to the client
});


app.get('/random-person', asyncHandler(async (req, res) => {
  const url = 'https://randomuser.me/api/';
  const response = await fetch(url);
  const data = await response.json();
  res.json(data);
}));

app.use('/random-person', (req, res, next) => {
  res.status(500).send(`
    <!doctype html>
    <html>
    <head>
      <title>API Server Unavailable</title>
    </head>
    <body>
      <h1>API Server Unavailable</h1>
      <p>The API server is currently not available. Please try again later.</p>
    </body>
    </html>
  `);
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});