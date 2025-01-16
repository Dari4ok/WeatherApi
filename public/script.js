let map;
document.getElementById('map').classList.add('active');

async function fetchWeatherByCoordinates(lat, lon) {
    try {
        const response = await fetch(`/api/weather/coordinates?lat=${lat}&lon=${lon}`);
        const data = await response.json();
        updateWeatherUI(data);
    } catch (error) {
        console.error('Error fetching weather data:', error);
    }
}


async function fetchWeatherByCity(city) {
    try {
        const response = await fetch(`/api/weather?city=${city}`);
        const data = await response.json();
        updateWeatherUI(data);
    } catch (error) {
        console.error('Error fetching weather data:', error);
    }
}


function updateWeatherUI(data) {
    const resultContainer = document.getElementById('result');
    const mapContainer = document.getElementById('map');

    resultContainer.innerHTML = `
        <div class="weather-card">
            <h2>${data.city}, ${data.country}</h2>
            <p><strong>Temperature:</strong> ${data.temperature}°C</p>
            <p><strong>Feels Like:</strong> ${data.feelsLike}°C</p>
            <p><strong>Weather:</strong> ${data.description}</p>
            <img src="http://openweathermap.org/img/wn/${data.icon}.png" alt="${data.description}" />
            <p><strong>Humidity:</strong> ${data.humidity}%</p>
            <p><strong>Pressure:</strong> ${data.pressure} hPa</p>
            <p><strong>Wind Speed:</strong> ${data.windSpeed} m/s</p>
            <p><strong>Coordinates:</strong> Latitude ${data.coordinates.lat}, Longitude ${data.coordinates.lon}</p>
            <p><strong>Rain Volume (last 3 hours):</strong> ${data.rain} mm</p>
        </div>
    `;

    if (!map) {
        map = L.map('map').setView([data.coordinates.lat, data.coordinates.lon], 10);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        }).addTo(map);
    } else {
        map.flyTo([data.coordinates.lat, data.coordinates.lon], 10);
    }

    L.marker([data.coordinates.lat, data.coordinates.lon])
        .addTo(map)
        .bindPopup(`<b>${data.city}</b><br>${data.description}`)
        .openPopup();

    mapContainer.classList.add('active');
    fetchSongByWeather(data.description);

}


window.onload = async () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;
                await fetchWeatherByCoordinates(latitude, longitude);
            },
            (error) => {
                console.error('Error fetching location:', error);
                alert('Unable to fetch your location. Please enter a city manually.');
            }
        );
    } else {
        alert('Geolocation is not supported by your browser.');
    }
};


document.getElementById('weather-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const city = document.getElementById('city').value;
    await fetchWeatherByCity(city);
});


async function fetchSongByWeather(weather) {
    try {
        const response = await fetch(`/api/song?weather=${weather}`);
        const data = await response.json();

        if (data.error) {
            console.error('Error fetching song:', data.error);
            const resultContainer = document.getElementById('result');
            resultContainer.insertAdjacentHTML('beforeend', `
                <div class="song-card">
                    <h3>No song found for the current weather condition.</h3>
                </div>
            `);
            return;
        }

        const resultContainer = document.getElementById('result');
        const songHtml = `
            <div class="song-card">
                <h3>Recommended Song:</h3>
                <p><strong>${data.name}</strong> by ${data.artist}</p>
                <iframe
                    src="https://open.spotify.com/embed/track/${data.uri.split(':')[2]}"
                    width="300"
                    height="80"
                    frameborder="0"
                    allowtransparency="true"
                    allow="encrypted-media">
                </iframe>
            </div>
        `;
        resultContainer.insertAdjacentHTML('beforeend', songHtml);
    } catch (error) {
        console.error('Error fetching song:', error);
    }
}
