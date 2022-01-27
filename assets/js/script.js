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
        // variable for city name
        const weatherCityName = cityName;
        //   TO DO: weather icon

        // temp
        const currentTemp = data.current.temp;
        // wind speed
        const currentWindSpeed = data.current.wind_speed;
        // humidity
        const currentHumidity = data.current.humidity;
        // uv index
        const currentUVI = data.current.uvi;

        displayCurrentResults(weatherCityName, currentTemp, currentWindSpeed, currentHumidity, currentUVI);
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
function displayCurrentResults(weatherCityName, currentTemp, currentWindSpeed, currentHumidity, currentUVI) {
  console.log(weatherCityName);
  console.log(currentTemp);
  console.log(currentWindSpeed);
  console.log(currentHumidity);
  console.log(currentUVI);
}

//event listeners

//on page load, show any past cities searched from local storage

//search for city button click
searchBtn.addEventListener("click", cityNameToLatLon);

//click on recent city searches to show weather
