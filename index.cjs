'use strict';
require('dotenv').config();
const cors = require('cors'); // Import the cors module
const express = require('express');
const nodemailer = require('nodemailer');
const app = express();
const PORT = process.env.PORT || 3001;
const Jimp = require('jimp');

// Enable CORS for all routes
app.use(cors());

// Middleware for handling form data
const multer = require('multer');
const upload = multer();

app.use(express.urlencoded({ extended: true }));

// Serve static files (e.g., HTML, CSS, JS)
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
    </head>
    <body>
        <header>
            <h1>Rocky Cowan</h1>       
        </header>
        <nav>
            <a href="index.html">Home</a>
        </nav>
        <main>
`;

let htmlBottom = `
    </main>
    <footer>
        <p>&#169; Rocky Cowan</p>
    </footer>
</body>
</html>
`;
// Route for processing image and extracting statistics
app.post('/api/process-image', upload.single('image'), async (req, res) => {
    try {
        // Get the uploaded image from req.file (assuming you are using multer)
        const image = req.file;

        // Load the image using Jimp
        const jimpImage = await Jimp.read(image.buffer);

        // Extract image statistics
        const fileName = image.originalname;
        const fileType = image.mimetype;
        const fileSize = image.size;

        // Prepare the response
        const response = {
            fileName,
            fileType,
            fileSize,
            // Other image statistics you want to include
        };

        // Send the response back to the client
        res.json(response);
    } catch (error) {
        console.error('Error processing image:', error);
        res.status(500).send('Error processing image');
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}...`);
});