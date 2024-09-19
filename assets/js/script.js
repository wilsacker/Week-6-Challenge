// Api
const weatherApiRootUrl = "https://api.openweathermap.org";
const weatherApiKey = "0aebe984c0fcc010def3e570e2cb9146";

// search history
let searchHistory = [];
const searchInput = document.getElementById("search-input");
const searchHistoryContainer = document.getElementById("history");
console.log(searchHistoryContainer); // Make sure this isn't null

// Forecast containers
const todayContainer = document.getElementById("today");
const forecastContainer = document.getElementById("forecast");

// Add timezone plugins to day.js
dayjs.extend(window.dayjs_plugin_utc);
dayjs.extend(window.dayjs_plugin_timezone);

// function to handle search history using local storage
function appendToHistory(search) {
  if (searchHistory.indexOf(search) !== -1) {
    return;
  }

  // Add to search history array and update localStorage
  searchHistory.push(search);
  localStorage.setItem("search-history", JSON.stringify(searchHistory));

  // Render updated search history
  renderSearchHistory();
}

function initSearchHistory() {
  const storedHistory = localStorage.getItem("search-history");
  if (storedHistory) {
    searchHistory = JSON.parse(storedHistory);
    console.log("Stored history:", searchHistory); // Check if the history is retrieved properly
  }
  renderSearchHistory();
}

function renderSearchHistory() {
  console.log("Rendering search history..."); // Check if this prints
  searchHistoryContainer.innerHTML = "";

  for (let i = searchHistory.length - 1; i >= 0; i--) {
    const btn = document.createElement("button");
    btn.setAttribute("type", "button");
    btn.setAttribute("aria-controls", "today forecast");
    btn.classList.add(
      "btn",
      "btn-secondary",
      "btn-block",
      "mb-2",
      "btn-history"
    );
    btn.setAttribute("data-search", searchHistory[i]);
    btn.textContent = searchHistory[i];
    searchHistoryContainer.append(btn);
  }
}

// fetch weather for location based on coordinates
function fetchWeather(location) {
  let { lat, lon } = location;
  const cityName = location.name;

  const apiUrl = `${weatherApiRootUrl}/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${weatherApiKey}`;

  fetch(apiUrl)
    .then(function (res) {
      return res.json();
    })
    .then(function (data) {
      renderItems(cityName, data);
    })
    .catch(function (err) {
      console.error(err);
    });
}

// get coordinates for location
function fetchCoords(search) {
  const apiUrl = `${weatherApiRootUrl}/geo/1.0/direct?q=${search}&limit=5&appid=${weatherApiKey}`;

  fetch(apiUrl)
    .then(function (res) {
      return res.json();
    })
    .then(function (data) {
      if (!data[0]) {
        alert("Location not found");
      } else {
        // Append to search history and fetch weather for the location
        appendToHistory(search);
        fetchWeather(data[0]);
      }
    })
    .catch(function (err) {
      console.error(err);
    });
}

// handle search form submit button
function handleSearchFormSubmit(e) {
  e.preventDefault();

  // Get the search term from the input
  const search = searchInput.value.trim();

  // If there's no input, don't proceed
  if (!search) {
    alert("Please enter a valid city name.");
    return;
  }

  // Fetch coordinates and weather data
  fetchCoords(search);

  // Clear the input field
  searchInput.value = "";
}

function renderItems(city, data) {
    console.log('Rendering weather items for city:', city); // Add this log
    console.log(data); // Add this to see if the correct data is being passed
  // Render current weather
  renderCurrentWeather(city, data.list[0]);

  // Render 5-day forecast
  renderForecast(data.list);
}

function renderCurrentWeather(city, weather) {
  const date = dayjs().format("M/D/YYYY");
  const tempF = weather.main.temp;
  const windMph = weather.wind.speed;
  const humidity = weather.main.humidity;
  const iconUrl = `https://openweathermap.org/img/w/${weather.weather[0].icon}.png`;
  const iconDescription = weather.weather[0].description;

  const card = document.createElement("div");
  const cardBody = document.createElement("div");
  const heading = document.createElement("h2");
  const weatherIcon = document.createElement("img");
  const tempEl = document.createElement("p");
  const windEl = document.createElement("p");
  const humidityEl = document.createElement("p");

  card.setAttribute("class", "card");
  cardBody.setAttribute("class", "card-body");
  card.append(cardBody);

  heading.setAttribute("class", "h3 card-title");
  tempEl.setAttribute("class", "card-text");
  windEl.setAttribute("class", "card-text");
  humidityEl.setAttribute("class", "card-text");

  heading.textContent = `${city} (${date})`;
  weatherIcon.setAttribute("src", iconUrl);
  weatherIcon.setAttribute("alt", iconDescription);
  heading.append(weatherIcon);
  tempEl.textContent = `Temp: ${tempF}°F`;
  windEl.textContent = `Wind: ${windMph} MPH`;
  humidityEl.textContent = `Humidity: ${humidity}%`;
  cardBody.append(heading, tempEl, windEl, humidityEl);

  todayContainer.innerHTML = "";
  todayContainer.append(card);
}

function renderForecast(forecastData) {
  forecastContainer.innerHTML = "";
  for (let i = 0; i < forecastData.length; i += 8) {
    renderForecastCard(forecastData[i]);
  }
}

function renderForecastCard(forecast) {
  const iconUrl = `https://openweathermap.org/img/w/${forecast.weather[0].icon}.png`;
  const iconDescription = forecast.weather[0].description;
  const tempF = forecast.main.temp;
  const humidity = forecast.main.humidity;
  const windMph = forecast.wind.speed;

  const col = document.createElement("div");
  const card = document.createElement("div");
  const cardBody = document.createElement("div");
  const cardTitle = document.createElement("h5");
  const weatherIcon = document.createElement("img");
  const tempEl = document.createElement("p");
  const windEl = document.createElement("p");
  const humidityEl = document.createElement("p");

  col.setAttribute("class", "col-md");
  col.classList.add("five-day-card");
  card.setAttribute("class", "card bg-primary h-100 text-white");
  cardBody.setAttribute("class", "card-body p-2");
  cardTitle.setAttribute("class", "card-title");
  tempEl.setAttribute("class", "card-text");
  windEl.setAttribute("class", "card-text");
  humidityEl.setAttribute("class", "card-text");

  cardTitle.textContent = dayjs(forecast.dt_txt).format("M/D/YYYY");
  weatherIcon.setAttribute("src", iconUrl);
  weatherIcon.setAttribute("alt", iconDescription);
  tempEl.textContent = `Temp: ${tempF} °F`;
  windEl.textContent = `Wind: ${windMph} MPH`;
  humidityEl.textContent = `Humidity: ${humidity}%`;

  cardBody.append(cardTitle, weatherIcon, tempEl, windEl, humidityEl);
  card.append(cardBody);
  col.append(card);
  forecastContainer.append(col);
}

// Initialize search history and attach event listeners
document.addEventListener("DOMContentLoaded", function () {
  initSearchHistory();
  document
    .getElementById("search-form")
    .addEventListener("submit", handleSearchFormSubmit);
});
