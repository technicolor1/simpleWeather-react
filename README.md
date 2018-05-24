# Simple Weather React app
With either the use of geolocation or search, display the weather conditions for the area. 

Adapted from simpleWeather repo

# Note
This app uses Dark Sky API to fetch weather conditions. 
This app uses Google Places API to lookup place and coordinates of that place.

# Main Features
- The user can search for desired location with Google Places. Autocomplete speeds up finding
- The user can view the current weather, weather for the next hour, weather for the next 24-48 hours, and weather for the next week. 
(Some locations do not have data for weather for the next hour)

- The user can view a chart summarizing weather for next hour. 
- The app is mobile-friendly as possible
- When user returns to app, the last fetched weather will load automatically. 

# Build Steps
This app is built with create-react-app https://github.com/facebook/create-react-app

Just ```npm start``` to start dev environment 

However, note that API keys are not provided. See Notes section (assume keys are located in ```config``` folder)