# Restaurant Recommender

A web application that helps users find top-rated restaurants near a specified location.

## Features

- Search for restaurants by address
- View top-rated restaurants sorted by rating
- See restaurant details including ratings, price level, and distance
- View restaurants on an interactive map

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/CPME/restrec.git
   cd restrec
   ```

2. Set up your Google Maps API key:
   - Create a project in the [Google Cloud Console](https://console.cloud.google.com/)
   - Enable the Maps JavaScript API and Places API
   - Create an API key with appropriate restrictions
   - Add your API key to the project

3. Deploy to Firebase (optional):
   ```bash
   npm install -g firebase-tools
   firebase login
   firebase init
   firebase deploy
   ```

## Usage

1. Enter an address in the search box
2. Click "Find Restaurants" to see top-rated restaurants near that location
3. View restaurant details and their locations on the map
4. Click on restaurant markers for more information

## Technologies Used

- JavaScript
- Google Maps API
- Google Places API
- Firebase Hosting

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
