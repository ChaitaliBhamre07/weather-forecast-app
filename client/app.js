const searchForm = document.getElementById("searchForm");
const cityInput = document.getElementById("cityInput");
const locationButton = document.getElementById("locationButton");
const themeToggle = document.getElementById("themeToggle");
const unitToggle = document.getElementById("unitToggle");
const loader = document.getElementById("loader");
const errorMessage = document.getElementById("errorMessage");
const savedCitiesContainer = document.getElementById("savedCities");
const forecastGrid = document.getElementById("forecastGrid");

const state = {
  units: localStorage.getItem("weatherUnits") || "metric",
  theme: localStorage.getItem("weatherTheme") || "light",
  savedCities: JSON.parse(localStorage.getItem("savedCities") || "[]"),
  currentQuery: {
    city: "Mumbai",
  },
};

const weatherConditionMap = {
  Thunderstorm: "weather-rain",
  Drizzle: "weather-rain",
  Rain: "weather-rain",
  Snow: "weather-snow",
  Clear: "weather-clear",
  Clouds: "weather-clouds",
  Mist: "weather-clouds",
  Haze: "weather-clouds",
  Fog: "weather-clouds",
};

function formatTemperature(value) {
  const unitSymbol = state.units === "metric" ? "°C" : "°F";
  return `${value}${unitSymbol}`;
}

function formatWind(speed, windUnit) {
  return `${speed} ${windUnit}`;
}

function formatWeatherTime(unixSeconds, timezoneOffset, options) {
  const weatherDate = new Date((unixSeconds + timezoneOffset) * 1000);

  return new Intl.DateTimeFormat("en-US", {
    ...options,
    timeZone: "UTC",
  }).format(weatherDate);
}

function formatVisibility(visibilityInMeters) {
  if (state.units === "imperial") {
    return `${(visibilityInMeters / 1609.34).toFixed(1)} mi`;
  }

  return `${(visibilityInMeters / 1000).toFixed(1)} km`;
}

function setLoading(isLoading) {
  loader.classList.toggle("hidden", !isLoading);
}

function setError(message = "") {
  errorMessage.textContent = message;
  errorMessage.classList.toggle("hidden", !message);
}

function updateTheme() {
  document.body.classList.toggle("theme-dark", state.theme === "dark");
  document.body.classList.toggle("theme-light", state.theme !== "dark");
  themeToggle.textContent =
    state.theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode";
  localStorage.setItem("weatherTheme", state.theme);
}

function updateUnitToggleLabel() {
  unitToggle.textContent =
    state.units === "metric" ? "Switch to °F" : "Switch to °C";
  localStorage.setItem("weatherUnits", state.units);
}

function updateBackground(condition) {
  const backgroundClass = weatherConditionMap[condition] || "weather-clear";

  document.body.classList.remove(
    "weather-rain",
    "weather-snow",
    "weather-clear",
    "weather-clouds"
  );
  document.body.classList.add(backgroundClass);
}

function saveCity(city) {
  if (!city) {
    return;
  }

  const normalizedCity = city.trim();
  const uniqueCities = [
    normalizedCity,
    ...state.savedCities.filter(
      (savedCity) =>
        savedCity.toLowerCase() !== normalizedCity.toLowerCase()
    ),
  ].slice(0, 6);

  state.savedCities = uniqueCities;
  localStorage.setItem("savedCities", JSON.stringify(uniqueCities));
  renderSavedCities();
}

function renderSavedCities() {
  savedCitiesContainer.innerHTML = "";

  if (state.savedCities.length === 0) {
    savedCitiesContainer.innerHTML = "<span>No recent searches yet.</span>";
    return;
  }

  state.savedCities.forEach((city) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "saved-city";
    button.textContent = city;
    button.addEventListener("click", () => {
      cityInput.value = city;
      loadWeather({ city });
    });
    savedCitiesContainer.appendChild(button);
  });
}

function updateCurrentWeatherUI(weather) {
  document.getElementById(
    "locationLabel"
  ).textContent = `${weather.city}, ${weather.country}`;
  document.getElementById("temperatureValue").textContent = formatTemperature(
    weather.temperature
  );
  document.getElementById(
    "conditionLabel"
  ).textContent = `${weather.condition} • ${weather.description}`;
  document.getElementById("feelsLikeValue").textContent = formatTemperature(
    weather.feelsLike
  );
  document.getElementById("humidityValue").textContent = `${weather.humidity}%`;
  document.getElementById("windValue").textContent = formatWind(
    weather.windSpeed,
    weather.windUnit
  );
  document.getElementById("updatedAtValue").textContent = formatWeatherTime(
    weather.updatedAt,
    weather.timezoneOffset,
    { hour: "numeric", minute: "2-digit" }
  );
  document.getElementById(
    "minMaxValue"
  ).textContent = `${formatTemperature(weather.minTemperature)} / ${formatTemperature(
    weather.maxTemperature
  )}`;
  document.getElementById("pressureValue").textContent = `${weather.pressure} hPa`;
  document.getElementById("sunriseValue").textContent = formatWeatherTime(
    weather.sunrise,
    weather.timezoneOffset,
    { hour: "numeric", minute: "2-digit" }
  );
  document.getElementById("sunsetValue").textContent = formatWeatherTime(
    weather.sunset,
    weather.timezoneOffset,
    { hour: "numeric", minute: "2-digit" }
  );
  document.getElementById("visibilityValue").textContent = formatVisibility(
    weather.visibility
  );
  document.getElementById(
    "coordinatesValue"
  ).textContent = `${weather.coordinates.lat.toFixed(2)}, ${weather.coordinates.lon.toFixed(2)}`;

  const weatherIcon = document.getElementById("weatherIcon");
  weatherIcon.src = `https://openweathermap.org/img/wn/${weather.icon}@2x.png`;
  weatherIcon.classList.remove("hidden");

  updateBackground(weather.condition);
}

function renderForecast(forecastItems) {
  forecastGrid.innerHTML = "";

  if (!forecastItems.length) {
    forecastGrid.innerHTML = "<p>Forecast data is not available right now.</p>";
    return;
  }

  forecastItems.forEach((item) => {
    const card = document.createElement("article");
    card.className = "forecast-item";

    card.innerHTML = `
      <p class="forecast-date">${new Intl.DateTimeFormat("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
      }).format(new Date(item.date))}</p>
      <img src="https://openweathermap.org/img/wn/${item.icon}@2x.png" alt="${item.description}" />
      <strong>${formatTemperature(item.temperature)}</strong>
      <p class="forecast-desc">${item.description}</p>
      <p class="forecast-desc">H: ${formatTemperature(
        item.maxTemperature
      )} | L: ${formatTemperature(item.minTemperature)}</p>
    `;

    forecastGrid.appendChild(card);
  });
}

async function fetchJson(url) {
  const response = await fetch(url);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Something went wrong.");
  }

  return data;
}

async function loadWeather(query) {
  setLoading(true);
  setError("");

  const params = new URLSearchParams({
    units: state.units,
  });

  if (query.city) {
    params.set("city", query.city);
  } else {
    params.set("lat", query.lat);
    params.set("lon", query.lon);
  }

  try {
    // The frontend calls our backend routes, and the backend safely talks to OpenWeatherMap.
    const [weather, forecast] = await Promise.all([
      fetchJson(`/weather?${params.toString()}`),
      fetchJson(`/forecast?${params.toString()}`),
    ]);

    updateCurrentWeatherUI(weather);
    renderForecast(forecast.forecast);

    state.currentQuery = query;
    if (weather.city) {
      saveCity(weather.city);
    }
  } catch (error) {
    setError(error.message);
  } finally {
    setLoading(false);
  }
}

function loadByCurrentLocation() {
  if (!navigator.geolocation) {
    setError("Geolocation is not supported by this browser.");
    return;
  }

  setError("");
  setLoading(true);

  navigator.geolocation.getCurrentPosition(
    async (position) => {
      const query = {
        lat: position.coords.latitude.toString(),
        lon: position.coords.longitude.toString(),
      };

      await loadWeather(query);
    },
    (error) => {
      setLoading(false);
      if (error.code === error.PERMISSION_DENIED) {
        setError("Location access was denied. Please search by city instead.");
        return;
      }

      setError("Unable to detect your location right now.");
    }
  );
}

searchForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const city = cityInput.value.trim();

  if (!city) {
    setError("Please enter a city name.");
    return;
  }

  loadWeather({ city });
});

locationButton.addEventListener("click", loadByCurrentLocation);

themeToggle.addEventListener("click", () => {
  state.theme = state.theme === "dark" ? "light" : "dark";
  updateTheme();
});

unitToggle.addEventListener("click", () => {
  state.units = state.units === "metric" ? "imperial" : "metric";
  updateUnitToggleLabel();
  loadWeather(state.currentQuery);
});

updateTheme();
updateUnitToggleLabel();
renderSavedCities();
cityInput.value = state.currentQuery.city;
loadWeather(state.currentQuery);
