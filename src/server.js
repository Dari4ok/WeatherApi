const express = require('express');
const path = require('path');
const { getWeatherByCity, getWeatherByCoordinates } = require('./services/weatherAPI');

const axios = require('axios');
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

async function getSpotifyToken() {
    const response = await axios.post(
        'https://accounts.spotify.com/api/token',
        'grant_type=client_credentials',
        {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                Authorization: `Basic ${Buffer.from(
                    `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
                ).toString('base64')}`,
            },
        }
    );
    return response.data.access_token;
}

async function searchTrack(query) {
    
    const token = await getSpotifyToken();
    const response = await axios.get(
        `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track&limit=5`,
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );

    console.log('Spotify API Response:', response.data.tracks.items); 


    const track = response.data.tracks.items.find(item => item.preview_url);
    if (!track) {
        console.error('No track with preview_url found.');
        return null; 
    }
    return track;
}



app.get('/api/song', async (req, res) => {
    try {
        const { weather } = req.query;
        const token = await getSpotifyToken();
        const response = await axios.get(
            `https://api.spotify.com/v1/search?q=${encodeURIComponent(weather)}&type=track&limit=1`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        const track = response.data.tracks.items[0];
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