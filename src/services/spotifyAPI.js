const axios = require('axios');
require('dotenv').config();

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
        `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track&limit=10`,
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );


    const tracks = response.data.tracks.items;
    if (!tracks || tracks.length === 0) {
        console.error('No tracks found.');
        return null;
    }

    const randomIndex = Math.floor(Math.random() * tracks.length);
    const randomTrack = tracks[randomIndex];

    return randomTrack;
}



module.exports = {searchTrack };
