# SkyCast Weather Forecast App

A full-stack weather forecast web application built with `Node.js`, `Express`, `HTML`, `CSS`, and `JavaScript`. The app uses the `OpenWeatherMap API` to fetch real-time weather data and a 5-day forecast, then displays it in a clean, responsive portfolio-ready interface.

## Overview

This project was built to demonstrate:

- Frontend and backend integration
- Real-time API consumption
- Secure API key handling with environment variables
- Responsive UI design
- Error handling and loading states
- Browser features like geolocation and local storage

## Features

### Core Features

- Search weather by city name
- Display temperature, weather condition, humidity, and wind speed
- Show loading spinner while data is being fetched
- Handle invalid city names and API failures gracefully
- Responsive layout for desktop and mobile

### Advanced Features

- 5-day weather forecast
- Detect current location using Geolocation API
- Save recently searched cities using `localStorage`
- Dark and light mode toggle
- Celsius and Fahrenheit unit toggle
- Weather icons from OpenWeatherMap
- Dynamic background based on current weather
- Extra details like feels like temperature, sunrise, sunset, pressure, and visibility

## Tech Stack

### Frontend

- HTML5
- CSS3
- JavaScript

### Backend

- Node.js
- Express.js

### API

- OpenWeatherMap API

## Folder Structure

```text
weather-forecast-app/
|-- client/
|   |-- app.js
|   |-- index.html
|   `-- styles.css
|-- server/
|   |-- index.js
|   `-- services/
|       `-- openWeather.js
|-- .env.example
|-- .gitignore
|-- package-lock.json
|-- package.json
`-- README.md
```

## API Routes

### `GET /weather`

Fetch current weather data.

Query parameters:

- `city=London`
- or `lat=19.07&lon=72.87`
- optional `units=metric`
- optional `units=imperial`

Example:

```http
GET /weather?city=Mumbai&units=metric
```

### `GET /forecast`

Fetch 5-day forecast data.

Query parameters:

- `city=London`
- or `lat=19.07&lon=72.87`
- optional `units=metric`
- optional `units=imperial`

Example:

```http
GET /forecast?city=Delhi&units=metric
```

## How API Integration Works

- The frontend sends requests to the Express backend.
- The backend calls the OpenWeatherMap API.
- The API key stays hidden in the `.env` file.
- The backend returns cleaned JSON responses to the frontend.
- This structure is safer and easier to maintain than calling the weather API directly from the browser.

## Installation and Setup

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd weather-forecast-app
```

### 2. Install dependencies

```bash
npm install
```

### 3. Create environment variables

Create a `.env` file in the root folder and add:

```env
OPENWEATHER_API_KEY=your_openweathermap_api_key
PORT=5000
```

You can copy values from `.env.example`.

### 4. Start the project

For development:

```bash
npm run dev
```

For normal start:

```bash
npm start
```

### 5. Open in browser

```text
http://localhost:5000
```

## Requirements

- Node.js `18+`
- npm
- OpenWeatherMap API key

Get your API key from [OpenWeatherMap](https://openweathermap.org/api).

## Screens and Functionality

- Search bar at the top for city-based weather search
- Main weather card for current conditions
- Highlights card for extra weather details
- Forecast section for 5-day outlook
- Theme switcher and unit switcher
- Saved cities for quick access

## Error Handling

The application handles:

- Invalid city names
- Missing API key
- Weather API request failures
- Geolocation permission denial

## Why This Project Is Good for Placement Portfolio

- Shows strong understanding of REST API integration
- Demonstrates frontend and backend separation
- Uses environment variables securely
- Includes user-friendly design and interaction features
- Covers practical browser APIs and asynchronous JavaScript
- Has a beginner-friendly and readable code structure

## Future Improvements

- Add hourly forecast
- Add search suggestions
- Store saved cities in a database
- Add weather charts
- Deploy to Render, Railway, or Vercel

## Author

Built as a portfolio project to showcase full-stack web development and API integration skills.
