const axios = require('axios');
require('dotenv').config();



const API_KEY = process.env.WEATHER_API_KEY;


async function getWeatherByCity(city) {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`;
    const response = await axios.get(url);
    return formatWeatherData(response.data);
}


async function getWeatherByCoordinates(lat, lon) {
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;
    const response = await axios.get(url);
    return formatWeatherData(response.data);
}

function formatWeatherData(data) {
    return {
        city: data.name,
        country: data.sys.country,
        temperature: data.main.temp,
        feelsLike: data.main.feels_like,
        description: data.weather[0].description,
        icon: data.weather[0].icon,
        humidity: data.main.humidity,
        pressure: data.main.pressure,
        windSpeed: data.wind.speed,
        coordinates: {
            lat: data.coord.lat,
            lon: data.coord.lon,
        },
        rain: data.rain ? data.rain['3h'] || 0 : 0,
    };
}


module.exports = { getWeatherByCity, getWeatherByCoordinates };
