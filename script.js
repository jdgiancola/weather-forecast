document.addEventListener("DOMContentLoaded", function () {
  const apiKey = "e9dd869a3f94b80637b71993806891a8";
  const cityForm = document.getElementById("city-form");
  const cityInput = document.getElementById("city-input");
  const currentWeather = document.getElementById("current-weather");
  const forecast = document.getElementById("forecast");
  const searchHistory = document.getElementById("search-history");

  // Function to fetch weather data from the OpenWeather API
  function fetchWeatherData(city) {
    const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;

    // Use the fetch API to make the API request
    fetch(apiUrl)
      .then((response) => {
        if (!response.ok) {
          throw new Error("City not found");
        }
        return response.json();
      })
      .then((data) => {
        // Handle the weather data
        displayCurrentWeather(data);
        displayForecast(data);
        addToSearchHistory(city);
      })
      .catch((error) => {
        console.error("Error fetching weather data", error);
        alert("City not found. Please check the city name and try again.");
      });
  }

  // Function to display current weather
  function displayCurrentWeather(data) {
    const city = data.city.name;
    const date = new Date(data.list[0].dt * 1000).toLocaleDateString();
    const iconCode = data.list[0].weather[0].icon;
    const iconUrl = `http://openweathermap.org/img/w/${iconCode}.png`;
    const temperature = data.list[0].main.temp;
    const humidity = data.list[0].main.humidity;
    const windSpeed = data.list[0].wind.speed;

    currentWeather.innerHTML = `
            <h2>Current Weather in ${city}</h2>
            <p>Date: ${date}</p>
            <img src="${iconUrl}" alt="Weather Icon">
            <p>Temperature: ${temperature} °C</p>
            <p>Humidity: ${humidity}%</p>
            <p>Wind Speed: ${windSpeed} m/s</p>
        `;
  }

  // Function to display forecast
  function displayForecast(data) {
    const forecastItems = data.list.slice(1, 6); // Get next 5 days

    forecast.innerHTML = `
            <h2>5-Day Forecast</h2>
            <div class="forecast-items">
                ${forecastItems
                  .map((item) => {
                    const date = new Date(item.dt * 1000).toLocaleDateString();
                    const iconCode = item.weather[0].icon;
                    const iconUrl = `http://openweathermap.org/img/w/${iconCode}.png`;
                    const temperature = item.main.temp;
                    const windSpeed = item.wind.speed;
                    const humidity = item.main.humidity;
                    return `
                        <div class="forecast-item">
                            <p>Date: ${date}</p>
                            <img src="${iconUrl}" alt="Weather Icon">
                            <p>Temperature: ${temperature} °C</p>
                            <p>Wind Speed: ${windSpeed} m/s</p>
                            <p>Humidity: ${humidity}%</p>
                        </div>
                    `;
                  })
                  .join("")}
            </div>
        `;
  }

  // Function to add city to search history
  function addToSearchHistory(city) {
    // Prevent adding duplicate entries
    if (searchHistory.querySelector(`button[data-city="${city}"]`)) {
      return;
    }

    const searchHistoryItem = document.createElement("button");
    searchHistoryItem.textContent = city;
    searchHistoryItem.setAttribute("data-city", city);
    searchHistoryItem.addEventListener("click", () => {
      // When a city in the search history is clicked, fetch its weather data
      fetchWeatherData(city);
    });

    searchHistory.appendChild(searchHistoryItem);

    // Store the search history in localStorage for persistence
    const searchHistoryList =
      JSON.parse(localStorage.getItem("searchHistory")) || [];
    searchHistoryList.push(city);
    localStorage.setItem("searchHistory", JSON.stringify(searchHistoryList));
  }

  // Function to load search history from localStorage
  function loadSearchHistory() {
    const searchHistoryList =
      JSON.parse(localStorage.getItem("searchHistory")) || [];
    searchHistory.innerHTML = "";
    searchHistoryList.forEach((city) => {
      addToSearchHistory(city);
    });
  }

  // Load search history on page load
  loadSearchHistory();

  // Function to handle form submission
  function handleFormSubmit(event) {
    event.preventDefault();
    const city = cityInput.value.trim();
    if (city) {
      // Call the fetchWeatherData function with the provided city
      fetchWeatherData(city);
    }
  }

  // Attach the form submission handler
  cityForm.addEventListener("submit", handleFormSubmit);
});
