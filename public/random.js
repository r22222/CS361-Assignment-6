"use strict";

document.addEventListener('DOMContentLoaded', () => {
  const apodUrl = 'https://api.nasa.gov/planetary/apod';
  const apiKey = '99tvcUE5PU8vRNVPugbUOUXB8UHXn2qkfOpqNfQL'; // Your actual API key

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

  document.getElementById('fetchNasaPic').addEventListener('click', () => {
    const selectedDate = datePicker.value;
    if (selectedDate) {
      fetchApod(selectedDate);
    } else {
      alert('Please select a date.');
    }
  });

  const today = new Date().toISOString().split('T')[0];
  datePicker.setAttribute('max', today);

  // Fetch APOD for today when the page loads
  fetchApod();
});

function changeDate(change) {
  // Get the current value from the datePicker input
  let currentDateString = document.getElementById('datePicker').value;

  // Make sure there is a current date selected
  if (currentDateString) {
      // Convert the current date string to a Date object
      let currentDate = new Date(currentDateString);

      // Add the day change (+1 for next, -1 for previous)
      currentDate.setDate(currentDate.getDate() + change);

      // Convert the new Date object back to a string in YYYY-MM-DD format
      let newDateString = currentDate.toISOString().split('T')[0];

      // Set the new date string as the value of the datePicker input
      document.getElementById('datePicker').value = newDateString;

      // Fetch the new APOD
      fetchApod(newDateString);
  }
}

function setToday() {
  const today = new Date().toISOString().split('T')[0];
  document.getElementById('datePicker').value = today;
}
