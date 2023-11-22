"use strict";

console.log("random.js loaded");

function fetchStats(imageUrl) {
    console.log("fetchStats called");
    // existing fetchStats code
}

document.addEventListener('DOMContentLoaded', () => {
  const apodUrl = '/nasa-apod';
  const datePicker = document.getElementById('datePicker');
  const imageElement = document.getElementById('nasaPic');
  const imageTitle = document.getElementById('imageTitle');
  const imageExplanation = document.getElementById('imageExplanation');

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

  function setToday() {
    const today = new Date().toISOString().split('T')[0];
    datePicker.value = today;
    fetchApod(today);
  }

  function fetchStats(imageUrl) {
    fetch(`http://localhost:4000/analyze-image?url=${encodeURIComponent(imageUrl)}`, {
      method: 'GET',
      // credentials: 'include', // Only include this if you're sure you need to send cookies with the request
      mode: 'cors', // Enable CORS
    })
    .then(response => response.json())
    .then(data => {
      console.log('Received data:', data); // Log the data received from the microservice
      document.getElementById('statFormat').textContent = `Format: ${data.fileType}`;
      document.getElementById('statDimensions').textContent = `Size: ${data.fileSize} bytes`;
      // Update other elements similarly
    })
    .catch(error => console.error('Error:', error));
  }

  // Attach event listeners
  document.getElementById('prevDay').addEventListener('click', () => changeDate(-1));
  document.getElementById('nextDay').addEventListener('click', () => changeDate(1));
  document.getElementById('today').addEventListener('click', setToday);
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

// Fetch APOD for today when the page loads
setToday();