// App.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { CurrentWeatherCard } from "./components/CurrentWeatherCard";

function App() {
  const [city, setCity] = useState("");
  const [currentData, setCurrentData] = useState(null);
  const [hourlyData, setHourlyData] = useState(null);
  const [dailyData, setDailyData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // --- Theme toggle ---
  const [theme, setTheme] = useState(
    () => localStorage.getItem("theme") || (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light")
  );
  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("theme", theme);
  }, [theme]);
  const toggleTheme = () => setTheme(curr => curr === "light" ? "dark" : "light");

  // --- Fetch weather ---
  async function handleLocationSearch(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const geo = await axios.get("https://geocoding-api.open-meteo.com/v1/search", {
        params: { name: city, count: 1 }
      });
      if (!geo.data.results?.length) throw new Error("City not found");
      const { latitude, longitude } = geo.data.results[0];

      const weather = await axios.get("https://api.open-meteo.com/v1/forecast", {
        params: {
          latitude,
          longitude,
          current_weather: true,
          hourly: "temperature_2m,relativehumidity_2m",
          daily: "temperature_2m_max,temperature_2m_min,weathercode",
          timezone: "auto",
        }
      });

      setCurrentData(weather.data.current_weather);
      setHourlyData(weather.data.hourly);
      setDailyData(weather.data.daily);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-screen min-h-screen flex flex-col
                    bg-gradient-to-b from-blue-300 to-white
                    dark:from-gray-900 dark:to-black overflow-y-auto">
      <header className="mx-auto p-6 bg-white dark:bg-gray-800
                         shadow rounded-lg w-full max-w-md
                         flex items-center space-x-4">
        <form onSubmit={handleLocationSearch} className="flex-1 space-y-4">
          <input
            type="text"
            placeholder="Enter city name"
            value={city}
            onChange={e => setCity(e.target.value)}
            required
            className="w-full p-3 border border-gray-300 rounded
                       focus:outline-none focus:ring-2 focus:ring-blue-400
                       dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
          />
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-3 rounded hover:bg-blue-600"
          >
            Search
          </button>
        </form>
        <button
          onClick={toggleTheme}
          aria-label="Toggle dark mode"
          className="p-2 bg-gray-200 dark:bg-gray-700 rounded"
        >
          {theme === "light" ? "🌙" : "☀️"}
        </button>
      </header>

      {loading && <p className="mt-6 text-center">Loading weather data…</p>}
      {!loading && error && (
        <p className="mt-6 text-center text-red-600">{error}</p>
      )}
      {!loading && currentData && (
        <CurrentWeatherCard
          weatherData={currentData}
          hourly={hourlyData}
          daily={dailyData}
        />
      )}
    </div>
  );
}

export default App;