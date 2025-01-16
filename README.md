# WeatherAPI

## Description
This project is a web application that combines real-time weather data with music recommendations. It leverages:
- **OpenWeather API** for live weather updates.
- **Spotify API** for recommending songs based on the current weather condition.

## Features
- Get weather updates for a specific city or your current location.
- Display an interactive map showing the city’s location.
- Suggest a random song matching the weather condition.
- Integrated Spotify player for direct music playback.

## Project Structure
```
WeatherApi/
├── public/
│   ├── index.html       # HTML structure of the application
│   ├── script.js        # Frontend JavaScript for UI updates
│   ├── style.css        # CSS for styling
├── src/
│   ├── server.js        # Backend server setup and routes
│   ├── services/
│       ├── weatherAPI.js # Functions for interacting with OpenWeather API
│       ├── spotifyAPI.js # Functions for interacting with Spotify API
└── .env                 # Environment variables (API keys)
```

## Setup Instructions

### Prerequisites
- Node.js installed on your machine.
- Spotify Developer account for API credentials.
- OpenWeather API key.

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/Dari4ok/WeatherApi
   cd WeatherAPI
   ```

2. Install required dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory and add your API keys:
   ```plaintext
   WEATHER_API_KEY=your_openweather_api_key
   SPOTIFY_CLIENT_ID=your_spotify_client_id
   SPOTIFY_CLIENT_SECRET=your_spotify_client_secret
   ```

4. Start the server:
   ```bash
   node src/server.js
   ```

5. Open the application in your browser at:
   ```
   http://localhost:3000
   ```

## How to Use
- **Weather Search:**
  - Enter the name of a city and click "Get Weather" to retrieve its weather conditions along with a music recommendation.
- **Current Location Weather:**
  - Allow location access to view weather updates and songs for your current location.

## API References
- [OpenWeather API](https://openweathermap.org/api)
- [Spotify API](https://developer.spotify.com/documentation/web-api/)

## Contributing
Contributions are welcome! Fork the repository, make your changes, and submit a pull request.

## License
This project is licensed under the MIT License. See the LICENSE file for more details.
```