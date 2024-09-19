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
    document.getElementById('cityForm').addEventListener('submit', function(event) {
      event.preventDefault(); // Prevents the default form submission behavior
  
      const city = document.getElementById('cityInput').value.trim();
  
      if (!city) {
        alert('Please enter a city name');
        return;
      }
  
      // Call the searchCity function or perform any search logic
      searchCity(city);
    });
  
    function searchCity(city) {
      // Example: Displaying the searched city in a div
      document.getElementById('searchResults').textContent = `You searched for: ${city}`;
    }
  });

// todo: searchApi function

// todo: render function