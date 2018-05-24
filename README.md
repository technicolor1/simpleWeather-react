# Simple Weather React app
With either the use of geolocation or search, display the weather conditions for the area. 

Adapted from simpleWeather repo

# Demo
v1 is demoed [here](https://my-project-1521742058003.firebaseapp.com/)

# Note
This app uses Dark Sky API to fetch weather conditions. 
This app uses Google Places API to lookup place and coordinates of that place.

# Main Features
- The user can search for desired location with Google Places. Autocomplete speeds up finding
- The user can view weather alerts in the area
- The user can further view detailed alerts (description)
- The user can view the current weather
- The user can view the weather for the next hour (Some locations do not have data for weather for the next hour)
- The user can view a chart summarizing weather for next hour. 
- The user can view the weather for the next 24-48 hours
- The user can view the weather for the next week. 
- The user can expand weekly to view more detailed weather info (such as air pressure)
- The app is mobile-friendly as possible
- When user returns to app, the last fetched weather will load automatically. 
- The user can refresh the most recent location 
- The user can refresh when user returns

# Build Steps
This app is built with create-react-app https://github.com/facebook/create-react-app

Just ```npm start``` to start dev environment 

However, note that API keys are not provided. See Notes section (assume keys are located in ```config``` folder)