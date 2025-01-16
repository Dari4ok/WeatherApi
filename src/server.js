const express = require('express');
const path = require('path');
const { getWeatherByCity, getWeatherByCoordinates } = require('./services/weatherAPI');
const { searchTrack } = require('./services/spotifyAPI');


const app = express();
const PORT = 3000;

app.use(express.static(path.join(__dirname, '../public')));
app.use(express.json());

app.get('/api/weather', async (req, res) => {
    try {
        const { city } = req.query;
        const data = await getWeatherByCity(city);
        res.json(data);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error fetching weather data by city' });
    }
});

app.get('/api/weather/coordinates', async (req, res) => {
    try {
        const { lat, lon } = req.query;
        const data = await getWeatherByCoordinates(lat, lon);
        res.json(data);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error fetching weather data by coordinates' });
    }
});



app.get('/api/song', async (req, res) => {
    try {
        const { weather } = req.query; 
        if (!weather) {
            return res.status(400).json({ error: 'Weather parameter is required.' });
        }

        const track = await searchTrack(weather); 
        if (!track) {
            return res.status(404).json({ error: 'No track found for the current weather condition.' });
        }

        res.json({
            name: track.name,
            artist: track.artists[0].name,
            url: track.external_urls.spotify,
            uri: track.uri,
        });
    } catch (err) {
        console.error('Error fetching song:', err);
        res.status(500).json({ error: 'Error fetching song.' });
    }
});


app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));