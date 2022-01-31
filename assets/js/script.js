// global variables
const searchBtn = document.getElementById("searchButton");

// initial state

// clear error response
document.getElementById("errorDiv").innerHTML = "";

// functions

// cityNameToLatLong
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
    // create fecth url
    const fetchUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${cityInput}&appid=517f19dc586407c39701b016a6edf914`;

    // fetch
    fetch(fetchUrl)
      .then(function (response) {
        console.log();
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
          //call handleResults and send city name, latitude, and longitude
          handleResults(cityName, latitude, longitude);
        }
      });
  }
}

// handleResults
function handleResults(cityName, latitude, longitude) {
  // create fecth url
  const fetchUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&units=imperial&appid=517f19dc586407c39701b016a6edf914`;

  // fetch
  fetch(fetchUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      console.log(data);
      // if received a 404 error message for city not found
      if (data.cod === "404") {
        // call displayError function
        displayError();
      } else {
        // if no error message, call displayCurrentResults and send city name, weather icon, temp, wind speed, humidity, and uv index

        // variable for fetched data
        // variable for city name
        const weatherCityName = cityName;
        // weather icon
        const currentWeatherIconId = data.current.weather[0].icon;
        // weather description for alt tag
        const currentWeatherDescription = data.current.weather[0].description;
        console.log(currentWeatherDescription);
        // temp
        const currentTemp = data.current.temp;
        // wind speed
        const currentWindSpeed = data.current.wind_speed;
        // humidity
        const currentHumidity = data.current.humidity;
        // uv index
        const currentUVI = data.current.uvi;
        // call displayCurrentResults and send it variables
        displayCurrentResults(weatherCityName, currentWeatherIconId, currentWeatherDescription, currentTemp, currentWindSpeed, currentHumidity, currentUVI);
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
function displayCurrentResults(weatherCityName, currentWeatherIconId, currentWeatherDescription, currentTemp, currentWindSpeed, currentHumidity, currentUVI) {
  // clear existing strings
  clearCurrentWeatherCard();
  // display city name
  document.getElementById("citySpan").innerHTML = weatherCityName;
  // display weather icon
  document.getElementById("currentWeatherIconDisplay").src = "http://openweathermap.org/img/wn/10d@2x.png";
  console.log(currentWeatherIconId);
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

//event listeners

//on page load, show any past cities searched from local storage

//search for city button click
searchBtn.addEventListener("click", cityNameToLatLon);

//click on recent city searches to show weather
