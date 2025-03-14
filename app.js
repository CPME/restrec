// Global variables
let map;
let service;
let geocoder;
let userLocation;
let mapsInitialized = false;

// Initialize the Google Maps API
function initMap() {
    try {
        geocoder = new google.maps.Geocoder();
        
        // Create a map centered on a default location (hidden, just for Places API)
        map = new google.maps.Map(document.createElement('div'), {
            center: { lat: 37.7749, lng: -122.4194 }, // Default: San Francisco
            zoom: 15
        });
        
        // Initialize the Places service
        service = new google.maps.places.PlacesService(map);
        
        // Add event listener to the search button
        document.getElementById('search-btn').addEventListener('click', findRestaurants);
        
        // Allow pressing Enter in the input field
        document.getElementById('address-input').addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                findRestaurants();
            }
        });
        
        // Initialize the visible map
        initVisibleMap();
        
        mapsInitialized = true;
    } catch (error) {
        console.error("Error initializing Google Maps:", error);
        showError("Failed to initialize Google Maps. Please check your API key and internet connection.");
    }
}

// Add event listeners even if Maps fails to load
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('search-btn').addEventListener('click', function() {
        if (!mapsInitialized) {
            showError("Google Maps has not initialized. Please check your API key and internet connection.");
            return;
        }
        findRestaurants();
    });
    
    document.getElementById('address-input').addEventListener('keypress', function(e) {
        if (e.key === 'Enter' && mapsInitialized) {
            findRestaurants();
        }
    });
});

// Find restaurants based on the entered address
function findRestaurants() {
    if (!mapsInitialized) {
        showError("Google Maps has not initialized. Please check your API key and internet connection.");
        return;
    }

    const address = document.getElementById('address-input').value.trim();
    
    if (!address) {
        showError('Please enter an address');
        return;
    }
    
    // Show loading indicator
    document.getElementById('loading').classList.remove('hidden');
    document.getElementById('error-message').classList.add('hidden');
    document.getElementById('results-container').classList.add('hidden');
    
    // Geocode the address to get coordinates
    geocoder.geocode({ address: address }, (results, status) => {
        if (status === 'OK' && results[0]) {
            userLocation = results[0].geometry.location;
            
            // Search for restaurants near the location
            const request = {
                location: userLocation,
                radius: 3218.69, // 2 miles in meters
                type: 'restaurant',
                rankBy: google.maps.places.RankBy.PROMINENCE
            };
            
            service.nearbySearch(request, handleRestaurantsResults);
        } else {
            document.getElementById('loading').classList.add('hidden');
            showError('Could not find the address. Please try again.');
        }
    });
}

// Handle the results from the nearby search
function handleRestaurantsResults(results, status) {
    document.getElementById('loading').classList.add('hidden');
    
    if (status === google.maps.places.PlacesServiceStatus.OK && results.length > 0) {
        // Sort restaurants by rating (highest first)
        const sortedResults = results
            .filter(place => place.rating) // Only places with ratings
            .sort((a, b) => b.rating - a.rating);
        
        // Get the top 5 restaurants
        const topRestaurants = sortedResults.slice(0, 5);
        
        if (topRestaurants.length > 0) {
            displayRestaurants(topRestaurants);
        } else {
            showError('No highly rated restaurants found in this area.');
        }
    } else {
        showError('No restaurants found near this location.');
    }
}

// Display the restaurants in the results container
function displayRestaurants(restaurants) {
    const resultsContainer = document.getElementById('results-list');
    resultsContainer.innerHTML = '';
    
    restaurants.forEach((restaurant, index) => {
        // Calculate distance from user location
        const restaurantLocation = restaurant.geometry.location;
        const distance = calculateDistance(
            userLocation.lat(), userLocation.lng(),
            restaurantLocation.lat(), restaurantLocation.lng()
        );
        
        // Create restaurant card
        const card = document.createElement('div');
        card.className = 'restaurant-card';
        
        // Generate star rating display
        const stars = generateStarRating(restaurant.rating);
        
        card.innerHTML = `
            <div class="restaurant-number">#${index + 1}</div>
            <div class="restaurant-name">${restaurant.name}</div>
            <div class="restaurant-rating">
                <span class="stars">${stars}</span>
                <span>${restaurant.rating} (${restaurant.user_ratings_total || 0} reviews)</span>
            </div>
            <div class="restaurant-address">${restaurant.vicinity}</div>
            <div class="restaurant-distance">${distance.toFixed(1)} miles away</div>
        `;
        
        resultsContainer.appendChild(card);
    });
    
    document.getElementById('results-container').classList.remove('hidden');
    
    // Show the map with restaurant pins
    showMapWithRestaurants(restaurants);
}

// Generate star rating HTML
function generateStarRating(rating) {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5;
    let starsHTML = '';
    
    for (let i = 0; i < fullStars; i++) {
        starsHTML += '★';
    }
    
    if (halfStar) {
        starsHTML += '½';
    }
    
    return starsHTML;
}

// Calculate distance between two coordinates in miles
function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 3958.8; // Earth's radius in miles
    const dLat = toRadians(lat2 - lat1);
    const dLon = toRadians(lon2 - lon1);
    
    const a = 
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) * 
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    
    return distance;
}

// Convert degrees to radians
function toRadians(degrees) {
    return degrees * (Math.PI / 180);
}

// Show error message
function showError(message) {
    const errorElement = document.getElementById('error-message');
    errorElement.textContent = message;
    errorElement.classList.remove('hidden');
}
