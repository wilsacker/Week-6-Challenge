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

