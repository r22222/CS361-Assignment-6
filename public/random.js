"use strict";

// APOD related code
const nasaApiKey = "99tvcUE5PU8vRNVPugbUOUXB8UHXn2qkfOpqNfQL";

console.log("random.js loaded");

document.addEventListener('DOMContentLoaded', () => {
    // APOD related code
    const apodUrl = `https://api.nasa.gov/planetary/apod?api_key=${nasaApiKey}`;
    const datePicker = document.getElementById('datePicker');
    const imageElement = document.getElementById('nasaPic');
    const imageTitle = document.getElementById('imageTitle');
    const imageExplanation = document.getElementById('imageExplanation');
    const captionsElement = document.getElementById('captions'); // Added this line
    const imageStatsElement = document.getElementById('imageStats'); // Added this line

    // Fetch APOD data
    function fetchApod(date = undefined) {
        if (!date) {
            date = new Date().toISOString().split('T')[0]; // Default to today's date
        }
        let url = new URL(apodUrl);
        url.searchParams.set('date', date);

        fetch(url)
            .then(response => response.ok ? response.json() : Promise.reject('Failed to load'))
            .then(data => {
                imageElement.src = data.url;
                imageTitle.textContent = data.title;
                imageExplanation.textContent = data.explanation;
                if (datePicker.value !== date) {
                    datePicker.value = date;
                }
            })
            .catch(error => console.error('APOD Fetch Error:', error));
    }

    // Event listeners for date navigation
    document.getElementById('prevDay').addEventListener('click', () => changeDate(-1));
    document.getElementById('nextDay').addEventListener('click', () => changeDate(1));
    document.getElementById('today').addEventListener('click', () => setToday());
    document.getElementById('fetchNasaPic').addEventListener('click', () => fetchApod(datePicker.value));

    function changeDate(change) {
        let currentDate = datePicker.value ? new Date(datePicker.value) : new Date();
        currentDate.setDate(currentDate.getDate() + change);
        datePicker.value = currentDate.toISOString().split('T')[0];
        fetchApod(datePicker.value);
    }

    function setToday() {
        const today = new Date().toISOString().split('T')[0];
        datePicker.value = today;
        fetchApod(today);
    }

    // Image upload and stats
document.getElementById('image-upload-form').addEventListener('submit', function (e) {
    e.preventDefault();
    const formData = new FormData(this);

    // Send image for image statistics
    axios.post('http://localhost:4000/api/process-image', formData) // Replace with your microservice URL
    .then(response => {
        // Call displayImageStats here with the image stats data
        displayImageStats(response.data);
    })
    .catch(error => console.error('Error:', error));

    // Send image for caption
    axios.post('https://ai-image-generation-405112.uk.r.appspot.com/api/caption', formData) // Corrected the endpoint URL
    .then(response => {
        captionsElement.textContent = response.data.caption;
    })
    .catch(error => console.error('Error:', error));
});


    function displayImageStats(data) {
        console.log('Received image stats data:', data);
        imageStatsElement.innerHTML = `
            <p>File Name: ${data.fileName}</p>
            <p>File Type: ${data.fileType}</p>
            <p>File Size: ${data.fileSize} bytes</p>
        `;
    }

    // Fetch APOD for today when the page loads
    fetchApod();
});
