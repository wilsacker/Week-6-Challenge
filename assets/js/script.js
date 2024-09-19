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
    // Update the current weather content
    const weatherDetailsEl = document.getElementById('current-weather-content');
    weatherDetailsEl.innerHTML = `
      <h3>Weather in ${city}</h3>
      <p>Temperature: ${data.main.temp} °C</p>
      <p>Humidity: ${data.main.humidity}%</p>
      <p>Wind Speed: ${data.wind.speed} m/s</p>
      <p>Weather: ${data.weather[0].description}</p>
    `;
}