'use strict';
require('dotenv').config();
const cors = require('cors'); // Import the cors module
const express = require('express');
const nodemailer = require('nodemailer');
const app = express();
const PORT = process.env.PORT || 3000;

const corsOptions = {
    origin: 'http://localhost:3000', // Replace with your frontend domain
};

app.use(cors(corsOptions));

app.use(express.urlencoded({
    extended: true
}));

app.use(express.static('public'));

// Define global variables for the top and bottom HTML
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

const nasaApiKey = "99tvcUE5PU8vRNVPugbUOUXB8UHXn2qkfOpqNfQL"; // Define the NASA API key here

(async () => {
    const fetch = (await import('node-fetch')).default;

    // Define the /nasa-apod route
    app.get('/nasa-apod', async (req, res) => {
        const date = req.query.date;
        const apodUrl = `https://api.nasa.gov/planetary/apod?api_key=${nasaApiKey}&date=${date}`;
        console.log('Request URL:', apodUrl); // Add this line for debugging
        try {
            const response = await fetch(apodUrl);
            console.log('Response Status:', response.status); // Add this line for debugging
            if (!response.ok) {
                console.error(`NASA APOD request failed: ${response.status} ${response.statusText}`);
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            res.json(data);
        } catch (error) {
            console.error('Error fetching NASA APOD:', error.message);
            res.status(500).send('Error fetching NASA APOD');
        }
    });

    app.listen(PORT, () => {
        console.log(`Server listening on port ${PORT}...`);
    });
})();
