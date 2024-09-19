const weatherApiRootUrl = 'https://api.openweathermap.org';
const weatherApiKey = "0aebe984c0fcc010def3e570e2cb9146"

function fetchWeather() {
    let { lat } = location;
    let { lon } = location;
    const cityName = location.name;

    const apiUrl = `${weatherApiRootUrl}/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${weatherApiKey}`

    fetch(apiUrl)
    .then(function (res) {
      return res.json();
    })
    .then(function (data) {
      renderItems(city, data);
    })
    .catch(function (err) {
      console.error(err);
    });
}

// todo: create handleFormSubmit function
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('search-form').addEventListener('submit', function(event) {
      event.preventDefault();
  
      const city = document.getElementById('search-form').value.trim();
  
      if (!city) {
        alert('Please enter a city name');
        return;
      }
  
      // Call the searchCity function or perform any search logic
      searchCity(city);
    });
  });

// todo: searchApi function
function searchApi(city) {
    // Construct the API URL using the city name
    const apiUrl = `${weatherApiRootUrl}/data/2.5/weather?q=${city}&appid=${weatherApiKey}&units=metric`; // 'metric' for Celsius
  
    fetch(apiUrl)
      .then(function (response) {
          if (!response.ok) {
              throw new Error('City not found');
          }
          return response.json();
      })
      .then(function (data) {
          // Pass the data to the render function
          renderItems(city, data);
      })
      .catch(function (err) {
          console.error('Error:', err);
          document.getElementById('current-weather-content').textContent = 'City not found. Please try again.';
      });
}

// todo: render function
function renderItems(city, data) {
    // Clear any previous content
    const weatherDetailsEl = document.getElementById('current-weather-content');
    weatherDetailsEl.innerHTML = '';

    // Create a container div for the weather details
    const resultCard = document.createElement('div');
    resultCard.classList.add('card', 'bg-light', 'text-dark', 'mb-3', 'p-3');

    // Create a header for the city name
    const titleEl = document.createElement('h3');
    titleEl.textContent = `Weather in ${city}`;
    resultCard.appendChild(titleEl);

    // Create and append a paragraph element for temperature
    const tempEl = document.createElement('p');
    tempEl.innerHTML = `<strong>Temperature:</strong> ${data.main.temp} °C`;
    resultCard.appendChild(tempEl);

    // Create and append a paragraph element for humidity
    const humidityEl = document.createElement('p');
    humidityEl.innerHTML = `<strong>Humidity:</strong> ${data.main.humidity}%`;
    resultCard.appendChild(humidityEl);

    // Create and append a paragraph element for wind speed
    const windSpeedEl = document.createElement('p');
    windSpeedEl.innerHTML = `<strong>Wind Speed:</strong> ${data.wind.speed} m/s`;
    resultCard.appendChild(windSpeedEl);

    // Create and append a paragraph element for weather description
    const weatherDescriptionEl = document.createElement('p');
    weatherDescriptionEl.innerHTML = `<strong>Weather:</strong> ${data.weather[0].description}`;
    resultCard.appendChild(weatherDescriptionEl);

    // Append the result card to the weather details container
    weatherDetailsEl.appendChild(resultCard);
}