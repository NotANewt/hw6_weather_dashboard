// global variables
const searchBtn = document.getElementById("searchButton");
const formCityInput = document.getElementById("formCityNameInput");
const uvLowMax = 3;
const uvModMax = 6;
let prevSearchedCityButton = document.getElementsByName("cityButton");
let listOfPreviouslySearchedCities = [];

// initial state
init();

// functions

/*
 Initialization
  sets what the user sees upon opening the app
    * calls clearErrorMessage to remove string from error response div
    * calls geoLocation function to load page with current location's weather
    * calls makeButtonsFromLocalStorage function to make a button for each previously searched city
*/
function init() {
  clearErrorMessage();
  geoLocation();
  makeButtonsFromLocalStorage();
}

/*
 handleSearchButtonClick
  handles when the search button is clicked
    * prevents default
    * calls clearErrorMessage to remove string from error response div
    * grabs city name from search input
    * if the input box was blank, calls displayError function and returns
    * if the input box text, calls searchForWeather function and sends the text as cityInput    
*/
function handleSearchButtonClick(event) {
  event.preventDefault();
  clearErrorMessage();
  cityInput = formCityInput.value.toLowerCase();
  if (cityInput === "") {
    displayError();
    return;
  } else {
    searchForWeather(cityInput);
  }
}

/*
 makeButtonsFromLocalStorage
  gets array of previously searched cities from local storage and prepares the data so that 
  a button can be generated for each city 
    * clears out the list of previous cities
    * parses the array of previously searched cities from local storage
    * forEach to loop through array of previously searched cities and send each city name to the makeTheButton function
*/
function makeButtonsFromLocalStorage() {
  document.getElementById("previousCities").innerHTML = "";
  listOfPreviouslySearchedCities = JSON.parse(localStorage.getItem("savedLocalCitySearches")) || [];
  listOfPreviouslySearchedCities.forEach(makeTheButton);
}

/*
 geoLocation
  gets the user's current latitude and longitude coordinates
    * if user shares location information, gets latitude and longitude coordinates and sends to cityNameFromLatLon function
    * if user blocks location information, return
    * getCurrentLocation method for geolocation
*/
function geoLocation() {
  const options = {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0,
  };

  function success(pos) {
    const coordinates = pos.coords;
    const currentLat = coordinates.latitude;
    const currentLon = coordinates.longitude;
    cityNameFromLatLon(currentLat, currentLon);
  }

  function error() {
    return;
  }

  navigator.geolocation.getCurrentPosition(success, error, options);
}

/*
 cityNameFromLatLon
  fetches city name from geolocation latitude and longitude
    * creates fetchUrl
    * fetch data from openweathermap geolocation api
    * data validation: if there is a 404 error for city not found, call displayError function
    * if there are no errors, create variables and assign data for city name, latitude, and longitude
    * calls currentWeatherResults and sends cityName, latitude, and longitude
*/
function cityNameFromLatLon(currentLat, currentLon) {
  const fetchUrl = `https://api.openweathermap.org/geo/1.0/reverse?lat=${currentLat}&lon=${currentLon}&appid=517f19dc586407c39701b016a6edf914`;

  fetch(fetchUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      if (data.cod === "404") {
        displayError();
      } else {
        const cityName = data[0].name;
        const latitude = data[0].lat;
        const longitude = data[0].lon;

        handleCurrentWeatherResults(cityName, latitude, longitude);
      }
    });
}

/*
 searchForWeather
  fetches weather data for cityInput
    * creates fetchUrl
    * fetch data from openweathermap geolocation api
    * data validation: if returns an empty array, the city name does not exist, so call displayError function and return
    * if the array is not empty, create variables and assign data for city name, latitude, and longitude
    * calls handleCurrentWeatherResults and sends city name, latitude, and longitude
    * checks to see if the city name is already in the array
    * if the city name is not already in the listOfPreviouslySearchedCities array, add it to the start of the array
    * if the array is longer than eight cities, remove last city
    * save array to local storage
    * call makeButtonsFromLocalStorage function
*/

function searchForWeather(cityInput) {
  const fetchUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${cityInput}&appid=517f19dc586407c39701b016a6edf914`;

  fetch(fetchUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      if (data.length === 0) {
        displayError();
        return;
      } else {
        cityName = data[0].name;
        latitude = data[0].lat;
        longitude = data[0].lon;
        handleCurrentWeatherResults(cityName, latitude, longitude);

        if (!listOfPreviouslySearchedCities.includes(cityName)) {
          listOfPreviouslySearchedCities.unshift(cityName);
          if (listOfPreviouslySearchedCities.length > 8) listOfPreviouslySearchedCities.length = 8;
          localStorage.setItem("savedLocalCitySearches", JSON.stringify(listOfPreviouslySearchedCities));
          makeButtonsFromLocalStorage();
        }
      }
    });
}

/*
 makeTheButton
  creates button for each searched city
    * creates the button element
    * adds style, text, and an id to the button
    * names the button "cityButton"
    * adds event listener to call handleSearchedButtonClick
    * appends button to previousCities div
*/
function makeTheButton(cityName) {
  const pastCitySearchButton = document.createElement("button");
  pastCitySearchButton.classList.add("btn", "background-color-medium-purple", "d-block", "mb-2", "text-white");
  pastCitySearchButton.innerHTML = cityName;
  pastCitySearchButton.setAttribute("id", cityName);
  pastCitySearchButton.setAttribute("name", "cityButton");
  pastCitySearchButton.addEventListener("click", handleSearchedCityButtonClick);
  document.getElementById("previousCities").appendChild(pastCitySearchButton);
}

/*
 handleSearchedCityButtonClick
  handles the click event of a previously searched city button
    * gets the city name from the id of the button clicked
    * calls searchForWeather function and sends it the city name (cityInput)
*/
function handleSearchedCityButtonClick() {
  cityInput = this.getAttribute("id");
  searchForWeather(cityInput);
}

/*
 handleCurrentWeatherResults 
  fetches current weather results using city name, latitude and longitude
    * fetches weather data from openweathermap api using latitude and longitude
    * data validation: if there is a 404 error for city not found, call displayError function
    * if no error message, call displayCurrentResults and send city name, weather icon, temp, wind speed, humidity, and uv index

*/
function handleCurrentWeatherResults(cityName, latitude, longitude) {
  const fetchUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&units=imperial&appid=517f19dc586407c39701b016a6edf914`;

  fetch(fetchUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      if (data.cod === "404") {
        displayError();
      } else {
        const weatherCityName = cityName;
        const currentWeatherIconId = data.current.weather[0].icon;
        const currentWeatherDescription = data.current.weather[0].description;
        const currentTemp = data.current.temp;
        const currentWindSpeed = data.current.wind_speed;
        const currentHumidity = data.current.humidity;
        const currentUVI = data.current.uvi;

        displayCurrentResults(weatherCityName, currentWeatherIconId, currentWeatherDescription, currentTemp, currentWindSpeed, currentHumidity, currentUVI, latitude, longitude);
      }
    });
}

/*
 displayError
  displays message "Please enter a city." if there is an error
    * calls clearErrorMessage function to clear string from error div
    * displays error message to error div
    * clears previously searched city name from the input box
    * returns
*/
function displayError() {
  clearErrorMessage();
  document.getElementById("errorDiv").innerHTML = "Please enter a city.";
  document.getElementById("formCityNameInput").value = "";
  return;
}

/*
 displayCurrentResults
  displays current weather information to CurrentWeaterCard
    * calls clearCurrentWeatherCard function to remove existing strings
    * calls removeUVIBackgroundColor function to remove background color from UVI span
    * calls clearErrorMessage function to clear string from error div
    * displays current date using moment
    * displays city name, the weather icon (adding appropriate alt property), temperature, wind speed, hummidity, and UV index
    * updates the background color of the UVI span to indicate whether the conditions are favorable (green), moderate (yellow), or severe (red).
    * calls handleForecastWeatherResults and sends latitude and longitude
*/
function displayCurrentResults(weatherCityName, currentWeatherIconId, currentWeatherDescription, currentTemp, currentWindSpeed, currentHumidity, currentUVI, latitude, longitude) {
  clearCurrentWeatherCard();
  removeUVIBackgroundColor();
  clearErrorMessage();
  document.getElementById("citySpan").innerHTML = weatherCityName;
  const currentDate = moment().format("L");
  document.getElementById("dateSpan").innerHTML = currentDate;
  document.getElementById("currentWeatherIconDisplay").src = `https://openweathermap.org/img/wn/${currentWeatherIconId}.png`;
  document.getElementById("currentWeatherIconDisplay").alt = currentWeatherDescription;
  document.getElementById("currentTempDisplay").innerHTML = `Temp: ${currentTemp}°F`;
  document.getElementById("currentWindDisplay").innerHTML = `Wind: ${currentWindSpeed} MPH`;
  document.getElementById("currentHumidityDisplay").innerHTML = `Humidity: ${currentHumidity} %`;
  document.getElementById("currentUVIndexDisplay").innerHTML = `${currentUVI}`;

  if (currentUVI < uvLowMax) {
    document.getElementById("currentUVIndexDisplay").classList.add("bg-success");
  } else if (currentUVI < uvModMax) {
    document.getElementById("currentUVIndexDisplay").classList.add("bg-warning");
  } else {
    document.getElementById("currentUVIndexDisplay").classList.add("bg-danger");
  }

  handleForecastWeatherResults(latitude, longitude);
}

/*
 handleForecastWeatherResults
  fetches forecast weather and loops through data to send specific forecast data to display
    * fetches forecast weather data from openweathermap api using latitude and longitude
    * data validation: if there is a 404 error for city not found, call displayError function
    * if no error message, loop through the next five days and send x (forecast day), the weather icon id, 
      weather description,temperature, wind, and humidity to displayForecastResults function
*/
function handleForecastWeatherResults(latitude, longitude) {
  const fetchUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&units=imperial&appid=517f19dc586407c39701b016a6edf914`;

  fetch(fetchUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      if (data.cod === "404") {
        displayError();
      } else {
        let x = 1;
        while (x <= 5) {
          const forecastWeatherIconId = data.daily[x].weather[0].icon;
          const forecastWeatherDescription = data.daily[x].weather[0].description;
          const forecastTemp = data.daily[x].temp.day;
          const forecastWind = data.daily[x].wind_speed;
          const forecastHumidity = data.daily[x].humidity;

          displayForecastResults(x, forecastWeatherIconId, forecastWeatherDescription, forecastTemp, forecastWind, forecastHumidity);

          x++;
        }
      }
    });
}

/*
 displayForecastWeatherResults
  displays weather forcast data for the next five days
    * calls clearErrorMessage function to clear string from error div
    * for each forecast day card, displays current date using moment, along with the 
      weather icon (with appropriate alt property for icon image), temperature, wind speed, and humidity
    * clears previously searched city name from city input box
    * calls showContainerById to show the currentWeatherCard and fiveDayForecast divs
*/
function displayForecastResults(x, forecastWeatherIconId, forecastWeatherDescription, forecastTemp, forecastWind, forecastHumidity) {
  clearErrorMessage();

  const forecastDate = moment().add(x, "d").format("L");
  document.getElementById("forecastDay" + x + "Date").innerHTML = forecastDate;
  document.getElementById("forecastDay" + x + "WeatherIconDisplay").src = `https://openweathermap.org/img/wn/${forecastWeatherIconId}@2x.png`;
  document.getElementById("forecastDay" + x + "WeatherIconDisplay").alt = forecastWeatherDescription;
  document.getElementById("forecastDay" + x + "Temp").innerHTML = `Temp: ${forecastTemp}°F`;
  document.getElementById("forecastDay" + x + "WindSpeed").innerHTML = `Wind: ${forecastWind} MPH`;
  document.getElementById("forecastDay" + x + "Humidity").innerHTML = `Humidity: ${forecastHumidity} %`;

  document.getElementById("formCityNameInput").value = "";

  showContainerById("currentWeatherCard");
  showContainerById("fiveDayForecast");
}

/*
 clearCurrentWeatherCard 
  clears out all strings in Current Weather Card div
    * sets all innerHTML of elements in the CurrentWeatherCard div to ""
*/
function clearCurrentWeatherCard() {
  document.getElementById("citySpan").innerHTML = "";
  document.getElementById("dateSpan").innerHTML = "";
  document.getElementById("currentWeatherIconDisplay").innerHTML = "";
  document.getElementById("currentTempDisplay").innerHTML = "";
  document.getElementById("currentWindDisplay").innerHTML = "";
  document.getElementById("currentHumidityDisplay").innerHTML = "";
  document.getElementById("currentUVIndexDisplay").innerHTML = "";
}

/*
 clearErrorMessage
  clears error message "Please enter a city"
    * sets innerHTML of errorDiv to ""
*/
function clearErrorMessage() {
  document.getElementById("errorDiv").innerHTML = "";
}

/*
 removeUVIBackgroundColor
  removes color class from currentUVIndexDisplay span
    * removes all possible color classes added to the currentUVIndexDisplay span
*/
function removeUVIBackgroundColor() {
  document.getElementById("currentUVIndexDisplay").classList.remove("bg-success");
  document.getElementById("currentUVIndexDisplay").classList.remove("bg-warning");
  document.getElementById("currentUVIndexDisplay").classList.remove("bg-danger");
}

/*
 showContainerById
  utility function to show container by id
    * removes hidden class from container
*/
function showContainerById(container) {
  document.getElementById(container).classList.remove("hidden");
}

//event listeners

//search for city button click
searchBtn.addEventListener("click", handleSearchButtonClick);
