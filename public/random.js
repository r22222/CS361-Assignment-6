"use strict";

document.addEventListener('DOMContentLoaded', () => {
  const apodUrl = 'https://api.nasa.gov/planetary/apod';
  const apiKey = '99tvcUE5PU8vRNVPugbUOUXB8UHXn2qkfOpqNfQL'; // Replace with your actual API key

  const datePicker = document.getElementById('datePicker');
  const imageElement = document.getElementById('nasaPic');
  const imageTitle = document.getElementById('imageTitle');
  const imageExplanation = document.getElementById('imageExplanation');

  function fetchApod(date) {
    let url = new URL(apodUrl);
    let params = { api_key: apiKey, thumbs: true };

    if (date) {
      params['date'] = date;
    }

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
      })
      .catch(error => {
        console.error('There has been a problem with your fetch operation:', error);
      });
  }

  function changeDate(change) {
    let currentDateString = datePicker.value;

    if (currentDateString) {
      let currentDate = new Date(currentDateString);
      currentDate.setDate(currentDate.getDate() + change);
      let newDateString = currentDate.toISOString().split('T')[0];
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
    fetch(`http://localhost:3000/analyze-image?url=${encodeURIComponent(imageUrl)}`)
      .then(response => response.json())
      .then(data => {
        document.getElementById('statFormat').textContent = `Format: ${data.format}`;
        document.getElementById('statDimensions').textContent = `Dimensions: ${data.width} x ${data.height}`;
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
