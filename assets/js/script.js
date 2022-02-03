// global variables
const searchBtn = document.getElementById("searchButton");
let listOfPreviouslySearchedCities = [];

// initial state
init();

// functions

//initialization
function init() {
  // clear error response
  document.getElementById("errorDiv").innerHTML = "";
  // geolocation to load page with current location's weather
  geoLocation();
}

// geolocation - get user's current lat and lon
function geoLocation() {
  // options object with parameters to use in method getCurrentPosition
  const options = {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0,
  };

  // callback function if geolocation.getCurrentPosition is a success and provides pos object
  function success(pos) {
    // variable for coordinates
    const coordinates = pos.coords;
    // variables for latitude and longitude from coordinates
    const currentLat = coordinates.latitude;
    const currentLon = coordinates.longitude;
    //get city name from lat/lon

    // call cityNameFromLatLon
    cityNamefromLatLon(currentLat, currentLon);
  }

  // if user blocks geolocation, return
  function error() {
    return;
  }
  // getCurrentPosition method
  navigator.geolocation.getCurrentPosition(success, error, options);
}

// cityNameFromLatLon - fetches city name from geolocation latitude and longitude
function cityNamefromLatLon(currentLat, currentLon) {
  // create fecth url
  const fetchUrl = `https://api.openweathermap.org/geo/1.0/reverse?lat=${currentLat}&lon=${currentLon}&appid=517f19dc586407c39701b016a6edf914`;

  // fetch
  fetch(fetchUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      // if received a 404 error message for city not found
      if (data.cod === "404") {
        // call displayError function
        displayError();
      } else {
        // if no error message
        // variable for city name
        const cityName = data[0].name;
        // variable for latitude
        const latitude = data[0].lat;
        // variable for longitude
        const longitude = data[0].lon;
        // call currentWeatherResults and send cityName, latitude, and longitude
        handleCurrentWeatherResults(cityName, latitude, longitude);
      }
    });
}

// cityNameToLatLon
function cityNameToLatLon(event) {
  //prevent default
  event.preventDefault();
  // clear error response
  document.getElementById("errorDiv").innerHTML = "";
  // grab search text from input
  const cityInput = document.getElementById("formCityNameInput").value;
  // if input box is blank, call displayError function
  if (cityInput === "") {
    displayError();
  } else {
    // add city to array of past city searches
    listOfPreviouslySearchedCities.push(cityInput);
    // TO DO: If city is already in the array, do not add the city again

    // add city to list of past searches
    localStorage.setItem("savedLocalCities", JSON.stringify(listOfPreviouslySearchedCities));
    // create search history button
    const pastCitySearchButton = document.createElement("button");
    // style button
    pastCitySearchButton.classList.add("btn", "btn-secondary", "d-block", "mb-2", "text-dark");
    // add text
    pastCitySearchButton.innerHTML = cityInput;
    // add id
    pastCitySearchButton.setAttribute("id", cityInput);
    //append button to previousCities div
    document.getElementById("previousCities").appendChild(pastCitySearchButton);
    console.log(listOfPreviouslySearchedCities);

    // create fecth url
    const fetchUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${cityInput}&appid=517f19dc586407c39701b016a6edf914`;
    // fetch
    fetch(fetchUrl)
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        // if received a 404 error message for city not found
        if (data.cod === "404") {
          // call displayError function
          displayError();
        } else {
          // if no error message
          // variable for city name
          const cityName = data[0].name;
          // variable for latitude
          const latitude = data[0].lat;
          // variable for longitude
          const longitude = data[0].lon;
          //call handleCurrentWeatherResults and send city name, latitude, and longitude
          handleCurrentWeatherResults(cityName, latitude, longitude);
        }
      });
  }
}

// handleCurrentWeatherResults - takes city name, latitude, and longitude from cityNameFromLatLon (geolocation) or cityNameToLatLon
function handleCurrentWeatherResults(cityName, latitude, longitude) {
  // create fecth url
  const fetchUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&units=imperial&appid=517f19dc586407c39701b016a6edf914`;
  // fetch
  fetch(fetchUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      // if received a 404 error message for city not found
      if (data.cod === "404") {
        // call displayError function
        displayError();
      } else {
        // if no error message, call displayCurrentResults and send city name, weather icon, temp, wind speed, humidity, and uv index
        // variable for city name
        const weatherCityName = cityName;
        // variable for weather icon
        const currentWeatherIconId = data.current.weather[0].icon;
        // variable for weather description for alt tag
        const currentWeatherDescription = data.current.weather[0].description;
        // variable for temp
        const currentTemp = data.current.temp;
        // variable for wind speed
        const currentWindSpeed = data.current.wind_speed;
        // variable for humidity
        const currentHumidity = data.current.humidity;
        // variable for uv index
        const currentUVI = data.current.uvi;
        // call displayCurrentResults and send it variables
        displayCurrentResults(weatherCityName, currentWeatherIconId, currentWeatherDescription, currentTemp, currentWindSpeed, currentHumidity, currentUVI, latitude, longitude);
      }
    });
}

// displayError
function displayError() {
  // clear existing string
  document.getElementById("errorDiv").innerHTML = "";
  // display error response
  document.getElementById("errorDiv").innerHTML = "Please enter a city.";
}

// displayCurrentResults
function displayCurrentResults(weatherCityName, currentWeatherIconId, currentWeatherDescription, currentTemp, currentWindSpeed, currentHumidity, currentUVI, latitude, longitude) {
  // clear existing strings
  clearCurrentWeatherCard();
  // clear existing error
  document.getElementById("errorDiv").innerHTML = "";
  // display city name
  document.getElementById("citySpan").innerHTML = weatherCityName;
  // display current date
  const currentDate = moment().format("L");
  document.getElementById("dateSpan").innerHTML = currentDate;
  // display weather icon
  document.getElementById("currentWeatherIconDisplay").src = `https://openweathermap.org/img/wn/${currentWeatherIconId}.png`;
  // add appropriate alt property to icon image
  document.getElementById("currentWeatherIconDisplay").alt = currentWeatherDescription;
  // display current temperature
  document.getElementById("currentTempDisplay").innerHTML = `Temp: ${currentTemp}°F`;
  // display current wind speed
  document.getElementById("currentWindDisplay").innerHTML = `Wind: ${currentWindSpeed} MPH`;
  // display current humidity
  document.getElementById("currentHumidityDisplay").innerHTML = `Humidity: ${currentHumidity} %`;
  // display current UV Index
  document.getElementById("currentUVIndexDisplay").innerHTML = `UV Index: ${currentUVI}`;
  //call handleForecastWeatherResults and send latitude and longitude
  handleForecastWeatherResults(latitude, longitude);
}

//handleForecastWeatherResults
function handleForecastWeatherResults(latitude, longitude) {
  // create fecth url
  const fetchUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&units=imperial&appid=517f19dc586407c39701b016a6edf914`;

  // fetch
  fetch(fetchUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      // if received a 404 error message for city not found
      if (data.cod === "404") {
        // call displayError function
        displayError();
      } else {
        // if no error message, call displayForeCastResults and send date, weather icon, temp, wind speed, humidity, and uv index
        let x = 1;
        while (x <= 5) {
          // variable for weather icon id
          const forecastWeatherIconId = data.daily[x].weather[0].icon;
          // variable for weather description
          const forecastWeatherDescription = data.daily[x].weather[0].description;
          //variable for temp
          const forecastTemp = data.daily[x].temp.day;
          //variable for Wind
          const forecastWind = data.daily[x].wind_speed;
          //variable for Humidity
          const forecastHumidity = data.daily[x].humidity;
          displayForecastResults(x, forecastWeatherIconId, forecastWeatherDescription, forecastTemp, forecastWind, forecastHumidity);

          x++;
        }

        // call displayForecastResults for each forecast day and send it weather information for that day
      }
    });
}

//
function displayForecastResults(x, forecastWeatherIconId, forecastWeatherDescription, forecastTemp, forecastWind, forecastHumidity) {
  // clear existing error
  document.getElementById("errorDiv").innerHTML = "";

  // Day 1 Forecast
  // display current date
  const forecastDate = moment().add(x, "d").format("L");
  document.getElementById("forecastDay" + x + "Date").innerHTML = forecastDate;
  // display weather icon
  document.getElementById("forecastDay" + x + "WeatherIconDisplay").src = `https://openweathermap.org/img/wn/${forecastWeatherIconId}.png`;
  // add appropriate alt property to icon image
  document.getElementById("forecastDay" + x + "WeatherIconDisplay").alt = forecastWeatherDescription;
  // display current temperature
  document.getElementById("forecastDay" + x + "Temp").innerHTML = `Temp: ${forecastTemp}°F`;
  // display current wind speed
  document.getElementById("forecastDay" + x + "WindSpeed").innerHTML = `Wind: ${forecastWind} MPH`;
  // display current humidity
  document.getElementById("forecastDay" + x + "Humidity").innerHTML = `Humidity: ${forecastHumidity} %`;

  // clear previously searched city name
  document.getElementById("formCityNameInput").value = "";

  //show currentWeatherCard and fiveDayForecast
  showContainerById("currentWeatherCard");
  showContainerById("fiveDayForecast");
}

// clearCurrentWeatherCard to clear out all strings in Current Weather Card div
function clearCurrentWeatherCard() {
  document.getElementById("citySpan").innerHTML = "";
  document.getElementById("dateSpan").innerHTML = "";
  document.getElementById("currentWeatherIconDisplay").innerHTML = "";
  document.getElementById("currentTempDisplay").innerHTML = "";
  document.getElementById("currentWindDisplay").innerHTML = "";
  document.getElementById("currentHumidityDisplay").innerHTML = "";
  document.getElementById("currentUVIndexDisplay").innerHTML = "";
}

//utility function to show container by id
function showContainerById(container) {
  document.getElementById(container).classList.remove("hidden");
}

//event listeners

//on page load, show any past cities searched from local storage

//search for city button click
searchBtn.addEventListener("click", cityNameToLatLon);

//click on recent city searches to show weather
