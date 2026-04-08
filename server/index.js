const express = require("express");
const path = require("path");
const dotenv = require("dotenv");
const {
  fetchCurrentWeather,
  fetchForecast,
} = require("./services/openWeather");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const clientPath = path.join(__dirname, "..", "client");

app.use(express.json());
app.use(express.static(clientPath));

app.get("/weather", async (req, res) => {
  const { city, lat, lon, units } = req.query;

  if (!city && (!lat || !lon)) {
    return res.status(400).json({
      error: "Please provide a city name or latitude/longitude coordinates.",
    });
  }

  try {
    const data = await fetchCurrentWeather({ city, lat, lon, units });
    return res.json(data);
  } catch (error) {
    const statusCode = error.statusCode || 500;
    return res.status(statusCode).json({
      error: error.message || "Unable to fetch current weather.",
    });
  }
});

app.get("/forecast", async (req, res) => {
  const { city, lat, lon, units } = req.query;

  if (!city && (!lat || !lon)) {
    return res.status(400).json({
      error: "Please provide a city name or latitude/longitude coordinates.",
    });
  }

  try {
    const data = await fetchForecast({ city, lat, lon, units });
    return res.json(data);
  } catch (error) {
    const statusCode = error.statusCode || 500;
    return res.status(statusCode).json({
      error: error.message || "Unable to fetch forecast data.",
    });
  }
});

app.get("*", (req, res) => {
  res.sendFile(path.join(clientPath, "index.html"));
});

app.listen(PORT, () => {
  console.log(`Weather app server is running on http://localhost:${PORT}`);
});
