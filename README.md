# Weather Forecast Web Application

A full-stack weather forecast application built with Node.js, Express, HTML, CSS, and JavaScript. It fetches real-time weather and 5-day forecast data from the OpenWeatherMap API and presents it in a modern, responsive dashboard.

## Folder Structure

```text
weather-forecast-app/
├── client/
│   ├── app.js
│   ├── index.html
│   └── styles.css
├── server/
│   ├── index.js
│   └── services/
│       └── openWeather.js
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

## Features

- Search weather by city name
- Real-time temperature, feels like, humidity, wind speed, pressure, sunrise, and sunset
- 5-day forecast cards
- Geolocation-based weather lookup
- Loading spinner and clear error messages
- Responsive mobile and desktop layout
- Dark and light mode toggle
- Celsius and Fahrenheit unit toggle
- Saved recent cities using `localStorage`
- Dynamic backgrounds and weather icons based on current conditions

## Backend API

### `GET /weather?city=London`

Returns cleaned current weather data for a city.

You can also pass coordinates:

### `GET /weather?lat=19.07&lon=72.87`

### `GET /forecast?city=London`

Returns a cleaned 5-day forecast response.

You can also pass coordinates:

### `GET /forecast?lat=19.07&lon=72.87`

Optional query parameter for both routes:

- `units=metric`
- `units=imperial`

## OpenWeatherMap Integration

- The frontend never calls OpenWeatherMap directly.
- The backend reads the API key from `.env`.
- The backend fetches data from OpenWeatherMap and sends only the fields needed by the UI.
- This keeps the API key hidden and makes frontend code cleaner.

## Setup Steps

1. Open a terminal in the project folder.
2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file in the project root and copy the example values:

```env
OPENWEATHER_API_KEY=your_openweathermap_api_key
PORT=5000
```

4. Start the development server:

```bash
npm run dev
```

5. Open your browser and visit:

```text
http://localhost:5000
```

## Important Notes

- Use Node.js 18 or later because the project uses the built-in `fetch` API on the server.
- You need a valid OpenWeatherMap API key from [OpenWeatherMap](https://openweathermap.org/api).
- If the API key is missing or the city name is invalid, the app shows a friendly error message.

## Why This Is Good for a Portfolio

- Demonstrates frontend and backend integration
- Uses environment variables securely
- Shows async API handling and error management
- Includes practical browser APIs like geolocation and local storage
- Has a polished, responsive UI with interaction states
