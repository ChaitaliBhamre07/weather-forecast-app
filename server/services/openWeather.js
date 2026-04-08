const OPENWEATHER_BASE_URL = "https://api.openweathermap.org/data/2.5";

function getApiKey() {
  const apiKey = process.env.OPENWEATHER_API_KEY;

  if (!apiKey) {
    const error = new Error(
      "OpenWeatherMap API key is missing. Add OPENWEATHER_API_KEY to your .env file."
    );
    error.statusCode = 500;
    throw error;
  }

  return apiKey;
}

function normalizeUnits(units = "metric") {
  return units === "imperial" ? "imperial" : "metric";
}

function buildQueryString({ city, lat, lon, units }) {
  const params = new URLSearchParams({
    appid: getApiKey(),
    units: normalizeUnits(units),
  });

  if (city) {
    params.set("q", city);
  } else {
    params.set("lat", lat);
    params.set("lon", lon);
  }

  return params.toString();
}

async function fetchFromOpenWeather(endpoint, options) {
  // The backend handles API integration so the frontend never exposes the API key.
  const response = await fetch(
    `${OPENWEATHER_BASE_URL}/${endpoint}?${buildQueryString(options)}`
  );

  const data = await response.json();

  if (!response.ok) {
    const error = new Error(
      data.message
        ? data.message.charAt(0).toUpperCase() + data.message.slice(1)
        : "OpenWeatherMap request failed."
    );
    error.statusCode = response.status;
    throw error;
  }

  return data;
}

function mapWeatherPayload(data, units) {
  const selectedUnits = normalizeUnits(units);

  return {
    city: data.name,
    country: data.sys.country,
    coordinates: {
      lat: data.coord.lat,
      lon: data.coord.lon,
    },
    temperature: Math.round(data.main.temp),
    feelsLike: Math.round(data.main.feels_like),
    minTemperature: Math.round(data.main.temp_min),
    maxTemperature: Math.round(data.main.temp_max),
    humidity: data.main.humidity,
    pressure: data.main.pressure,
    windSpeed: data.wind.speed,
    windUnit: selectedUnits === "imperial" ? "mph" : "m/s",
    condition: data.weather[0].main,
    description: data.weather[0].description,
    icon: data.weather[0].icon,
    visibility: data.visibility,
    sunrise: data.sys.sunrise,
    sunset: data.sys.sunset,
    timezoneOffset: data.timezone,
    units: selectedUnits,
    updatedAt: data.dt,
  };
}

function groupForecastByDay(list) {
  const grouped = new Map();

  list.forEach((entry) => {
    const dayKey = entry.dt_txt.split(" ")[0];

    if (!grouped.has(dayKey)) {
      grouped.set(dayKey, []);
    }

    grouped.get(dayKey).push(entry);
  });

  return Array.from(grouped.values())
    .slice(0, 5)
    .map((dayEntries) => {
      const middayEntry =
        dayEntries.find((entry) => entry.dt_txt.includes("12:00:00")) ||
        dayEntries[Math.floor(dayEntries.length / 2)];

      return {
        date: dayEntries[0].dt_txt.split(" ")[0],
        temperature: Math.round(middayEntry.main.temp),
        minTemperature: Math.round(
          Math.min(...dayEntries.map((entry) => entry.main.temp_min))
        ),
        maxTemperature: Math.round(
          Math.max(...dayEntries.map((entry) => entry.main.temp_max))
        ),
        humidity: middayEntry.main.humidity,
        windSpeed: middayEntry.wind.speed,
        description: middayEntry.weather[0].description,
        condition: middayEntry.weather[0].main,
        icon: middayEntry.weather[0].icon,
      };
    });
}

async function fetchCurrentWeather({ city, lat, lon, units }) {
  const data = await fetchFromOpenWeather("weather", { city, lat, lon, units });
  return mapWeatherPayload(data, units);
}

async function fetchForecast({ city, lat, lon, units }) {
  const selectedUnits = normalizeUnits(units);
  const data = await fetchFromOpenWeather("forecast", {
    city,
    lat,
    lon,
    units: selectedUnits,
  });

  return {
    city: data.city.name,
    country: data.city.country,
    units: selectedUnits,
    forecast: groupForecastByDay(data.list),
  };
}

module.exports = {
  fetchCurrentWeather,
  fetchForecast,
};
