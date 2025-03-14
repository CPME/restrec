// Map-related functionality
let mapElement;
let markers = [];

// Initialize the visible map
function initVisibleMap() {
    // Create map element if it doesn't exist
    if (!mapElement) {
        mapElement = new google.maps.Map(document.getElementById('map'), {
            zoom: 14,
            mapTypeControl: false,
            streetViewControl: false,
            fullscreenControl: true
        });
    }
}

// Show the map with the user's location and restaurant pins
function showMapWithRestaurants(restaurants) {
    // Make sure map is initialized
    initVisibleMap();
    
    // Center map on user location
    mapElement.setCenter(userLocation);
    
    // Clear any existing markers
    clearMarkers();
    
    // Add a marker for user location
    const userMarker = new google.maps.Marker({
        position: userLocation,
        map: mapElement,
        icon: {
            path: google.maps.SymbolPath.CIRCLE,
            scale: 10,
            fillColor: "#4285F4",
            fillOpacity: 0.8,
            strokeWeight: 2,
            strokeColor: "#FFFFFF"
        },
        title: "Your Location"
    });
    markers.push(userMarker);
    
    // Add markers for each restaurant
    restaurants.forEach((restaurant, index) => {
        const restaurantLocation = restaurant.geometry.location;
        
        const marker = new google.maps.Marker({
            position: restaurantLocation,
            map: mapElement,
            title: restaurant.name,
            label: {
                text: (index + 1).toString(),
                color: 'white'
            },
            animation: google.maps.Animation.DROP
        });
        
        // Add info window with restaurant details
        const infoWindow = new google.maps.InfoWindow({
            content: `
                <div class="info-window">
                    <h3>${restaurant.name}</h3>
                    <div>Rating: ${restaurant.rating} ★ (${restaurant.user_ratings_total || 0} reviews)</div>
                    <div>${restaurant.vicinity}</div>
                </div>
            `
        });
        
        // Add click listener to show info window
        marker.addListener('click', () => {
            infoWindow.open(mapElement, marker);
        });
        
        markers.push(marker);
    });
    
    // Show the map container
    document.getElementById('map-container').classList.remove('hidden');
}

// Clear all markers from the map
function clearMarkers() {
    markers.forEach(marker => marker.setMap(null));
    markers = [];
}
