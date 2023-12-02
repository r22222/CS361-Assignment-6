"use strict";

console.log("random.js loaded");

// Function to fetch image stats from the microservice
function fetchStats(imageUrl) {
    console.log("fetchStats called");
    // existing fetchStats code
}

document.addEventListener('DOMContentLoaded', () => {
    const apodUrl = '/nasa-apod'; // URL for fetching NASA's Astronomy Picture of the Day
    const datePicker = document.getElementById('datePicker');
    const imageElement = document.getElementById('nasaPic');
    const imageTitle = document.getElementById('imageTitle');
    const imageExplanation = document.getElementById('imageExplanation');

    // Function to fetch Astronomy Picture of the Day (APOD) data
    function fetchApod(date = undefined) {
        let url = new URL(apodUrl, window.location.origin); // Creates a URL pointing to your server
        let params = { date: date };

        url.search = new URLSearchParams(params).toString();

        fetch(url)
            .then(response => {
                if (!response.ok) throw new Error('Network response was not ok.');
                return response.json();
            })
            .then(data => {
                // Update the HTML elements with APOD data
                imageElement.src = data.url;
                imageTitle.textContent = data.title;
                imageExplanation.textContent = data.explanation;
                if (datePicker.value !== date) {
                    datePicker.value = date;
                }
            })
            .catch(error => {
                console.error('There has been a problem with your fetch operation:', error);
            });
    }

    // Function to change the date for fetching APOD
    function changeDate(change) {
        let currentDateString = datePicker.value;

        if (currentDateString) {
            let currentDate = new Date(currentDateString);
            console.log("Current Date:", currentDate.toISOString());
            currentDate.setDate(currentDate.getDate() + change);
            console.log("New Date:", currentDate.toISOString());
            let newDateString = currentDate.toISOString().split('T')[0];
            console.log("New Date String:", newDateString);
            datePicker.value = newDateString;
            fetchApod(newDateString);
        } else {
            console.log("No date selected");
        }
    }

    // Function to set the date to today and fetch APOD
    function setToday() {
        const today = new Date().toISOString().split('T')[0];
        datePicker.value = today;
        fetchApod(today);
    }

    // Function to fetch image stats from the microservice
    function fetchStats(imageUrl) {
        fetch(`http://localhost:4000/analyze-image?url=${encodeURIComponent(imageUrl)}`, {
            method: 'GET',
            mode: 'cors', // Enable Cross-Origin Resource Sharing (CORS)
        })
        .then(response => response.json())
        .then(data => {
            console.log('Received data:', data);

            // Update the stat elements with data
            updateStat('statFormat', data.fileType);
            updateStat('statDimensions', data.dimensions);
            updateStat('statFileSize', `${data.fileSize} bytes`);
            // Add more stats and update functions for other data

        })
        .catch(error => console.error('Error:', error));
    }

    // Function to update a specific stat element with a value
    function updateStat(statId, value) {
        const statElement = document.getElementById(statId);
        if (statElement) {
            statElement.textContent = value;
        }
    }

    // Attach event listeners
    document.getElementById('prevDay').addEventListener('click', () => changeDate(-1));
    document.getElementById('nextDay').addEventListener('click', () => changeDate(1));
    document.getElementById('today').addEventListener('click', setToday);

    // Modified event listener for fetchNasaPic
  document.getElementById('fetchNasaPic').addEventListener('click', () => {
    const selectedDate = datePicker.value;
    fetchApod(selectedDate);
  });


    document.getElementById('fetchImageStats').addEventListener('click', () => {
        const imageUrl = imageElement.src;
        fetchStats(imageUrl);
    });

    // Fetch APOD for today when the page loads
    fetchApod();
});

document.getElementById('image-upload-form').addEventListener('submit', function(e) {
    e.preventDefault();

    const formData = new FormData(this);
    axios.post('https://ai-image-generation-405112.uk.r.appspot.com/api/caption', formData)
        .then(response => {
            document.getElementById('captions').textContent = response.data.caption;
        })
        .catch(error => {
            console.error('Error:', error);
        });
});
