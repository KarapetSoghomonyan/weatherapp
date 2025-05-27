// components/CurrentWeatherCard.jsx
import React from "react";

// Map weathercode → description & icon
const weatherCodeMap = {
  0: { description: "Clear sky", icon: "☀️" },
  1: { description: "Mainly clear", icon: "🌤️" },
  2: { description: "Partly cloudy", icon: "⛅" },
  3: { description: "Overcast", icon: "☁️" },
  45: { description: "Fog", icon: "🌫️" },
  48: { description: "Rime fog", icon: "🌫️" },
  51: { description: "Light drizzle", icon: "🌦️" },
  53: { description: "Moderate drizzle", icon: "🌦️" },
  55: { description: "Dense drizzle", icon: "🌧️" },
  61: { description: "Slight rain", icon: "🌧️" },
  63: { description: "Moderate rain", icon: "🌧️" },
  65: { description: "Heavy rain", icon: "🌧️" },
  80: { description: "Slight rain showers", icon: "🌦️" },
  81: { description: "Moderate rain showers", icon: "🌦️" },
  82: { description: "Violent rain showers", icon: "⛈️" },
  95: { description: "Thunderstorm", icon: "⛈️" },
};

export function CurrentWeatherCard({ weatherData, hourly, daily }) {
  if (!weatherData) return null;

  const c = weatherData.temperature;
  const f = (c * 9/5 + 32).toFixed(1);
  const code = weatherData.weathercode;
  const { description, icon } = weatherCodeMap[code] || { description: "Unknown", icon: "❓" };
  const updatedAt = new Date(weatherData.time);

  return (
    <div className="max-w-lg mx-auto mt-6 bg-white dark:bg-gray-800 shadow-lg rounded-xl">
      {/* Current */}
      <div className="p-6 bg-blue-500 dark:bg-blue-700 text-center text-white rounded-t-xl">
        <div className="text-6xl">{icon}</div>
        <h2 className="text-2xl font-semibold mt-2">{description}</h2>
        <p className="mt-1">
          {updatedAt.toLocaleDateString()} {updatedAt.toLocaleTimeString()}
        </p>
        <p className="text-4xl font-bold mt-2">{c}°C ({f}°F)</p>
      </div>
      {/* Hourly */}
      {hourly && (
        <div className="p-4 overflow-x-auto">
          <h3 className="font-semibold mb-2 text-gray-800 dark:text-gray-200">Hourly Forecast</h3>
          <div className="flex space-x-4">
            {hourly.time.slice(0, 12).map((t, i) => {
              const hr = new Date(t).getHours();
              const tmp = hourly.temperature_2m[i];
              return (
                <div key={t} className="flex-shrink-0 w-20 text-center">
                  <p className="font-medium text-gray-800 dark:text-gray-200">{hr}:00</p>
                  <p className="text-gray-600 dark:text-gray-300">{tmp}°C</p>
                </div>
              );
            })}
          </div>
        </div>
      )}
      {/* Daily */}
      {daily && (
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <h3 className="font-semibold mb-2 text-gray-800 dark:text-gray-200">7-Day Forecast</h3>
          <div className="grid grid-cols-4 gap-2">
            {daily.time.slice(0, 7).map((d, i) => {
              const day = new Date(d).toLocaleDateString(undefined, { weekday: "short" });
              const max = daily.temperature_2m_max[i];
              const min = daily.temperature_2m_min[i];
              const dayIcon = weatherCodeMap[daily.weathercode[i]]?.icon || "❓";
              return (
                <div key={d} className="bg-gray-100 dark:bg-gray-700 rounded-lg p-2 text-center">
                  <p className="text-gray-800 dark:text-gray-200">{day}</p>
                  <div className="text-2xl">{dayIcon}</div>
                  <p className="text-gray-600 dark:text-gray-300">{max}°/{min}°</p>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}