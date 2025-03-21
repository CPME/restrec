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

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up your Google Maps API key:
   - Create a project in the [Google Cloud Console](https://console.cloud.google.com/)
   - Enable the Maps JavaScript API and Places API
   - Create an API key with appropriate restrictions
   - Create a `.env` file in the project root (see `.env.example`)
   - Add your API key to the `.env` file: `GCP_MAPS_API=your_api_key_here`

## Development

To run the application locally:

```bash
npm run dev
```

This will serve the files from the current directory.

## Building for Production

To build the application for production:

```bash
npm run build
```

This will:
1. Create a `build` directory
2. Process the HTML to include your API key
3. Copy all necessary files to the build directory

You can test the production build locally:

```bash
npm start
```

## Deployment to Firebase

1. Install Firebase tools (if not already installed):
   ```bash
   npm install -g firebase-tools
   ```

2. Login to Firebase:
   ```bash
   firebase login
   ```

3. Create a Firebase project (if you haven't already):
   - Go to the [Firebase Console](https://console.firebase.google.com/)
   - Click "Add project" and follow the steps to create a new project
   - Note your project ID for the next step

4. Update the .firebaserc file with your project ID:
   - Open the .firebaserc file
   - Replace "your-firebase-project-id" with your actual Firebase project ID

5. Initialize Firebase (if not already done):
   ```bash
   firebase init
   ```
   - Select "Hosting" when prompted
   - Choose your Firebase project
   - Specify "build" as your public directory
   - Configure as a single-page app if prompted
   - Don't overwrite existing files

6. Deploy to Firebase:
   ```bash
   npm run deploy
   ```

If you encounter any issues with deployment, you can try:
```bash
npm run firebase:setup
```
This will prompt you to select your Firebase project and set it as the default for this directory.

## Live Demo

The application is deployed and available at:
[https://restaurant-recommender-a-a4f5b.web.app](https://restaurant-recommender-a-a4f5b.web.app)

## Technologies Used

- JavaScript
- Google Maps API
- Google Places API
- Firebase Hosting
- Node.js (build process)

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
