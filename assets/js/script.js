// global variables
const searchBtn = document.getElementById("searchButton");
let listOfPreviouslySearchedCities = [];

// initial state
init();

// clear error response
document.getElementById("errorDiv").innerHTML = "";

// functions

//initialization
function init() {
  // check if there are any city names stored in the listOfPreviouslySearchedcities array
  listOfPreviouslySearchedCities = JSON.parse(localStorage.getItem("savedLocalCities"));
  if (!listOfPreviouslySearchedCities) {
    listOfPreviouslySearchedCities = [];
  }
  // geolocation to load page with current location's weather
  geoLocation();
}

// updateSearchHistoryDisplay - update the search history
//function updateSearchHistoryDisplay() {
//empty leaderboardList innerHTML
//const previousCities = document.getElementById("previousCities");
//previousCities.innerHTML = "";
//if there are items in the leaderboard array
// if (listOfPreviouslySearchedCities.length > 0) {
//add each initials/score to the leaderboard list
//listOfPreviouslySearchedCities.forEach(function (city) {
// create search history button
//const pastCitySearchButton = document.createElement("button");
// style button
// pastCitySearchButton.classList.add("btn", "btn-secondary", "d-block", "mb-2", "text-dark");
// add text
// pastCitySearchButton.innerHTML = listOfPreviouslySearchedCities[city];
// add id
// pastCitySearchButton.setAttribute("id", city);
//append button to previousCities div
// document.getElementById("previousCities").appendChild(pastCitySearchButton);
// });
// }
//}

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
        // day 1
        // variable for weather icon id
        const day1WeatherIconId = data.daily[1].weather[0].icon;
        // variable for weather description
        const day1WeatherDescription = data.daily[1].weather[0].description;
        //variable for temp
        const day1Temp = data.daily[1].temp.day;
        //variable for Wind
        const day1Wind = data.daily[1].wind_speed;
        //variable for Humidity
        const day1Humidity = data.daily[1].humidity;
        //variable for UV Index
        //const day1UVI = day.daily
        //day 2
        // variable for weather icon id
        const day2WeatherIconId = data.daily[2].weather[0].icon;
        // variable for weather description
        const day2WeatherDescription = data.daily[2].weather[0].description;
        //variable for temp
        const day2Temp = data.daily[2].temp.day;
        //variable for Wind
        const day2Wind = data.daily[2].wind_speed;
        //variable for Humidity
        const day2Humidity = data.daily[2].humidity;
        //day 3
        // variable for weather icon id
        const day3WeatherIconId = data.daily[3].weather[0].icon;
        // variable for weather description
        const day3WeatherDescription = data.daily[3].weather[0].description;
        //variable for temp
        const day3Temp = data.daily[3].temp.day;
        //variable for Wind
        const day3Wind = data.daily[3].wind_speed;
        //variable for Humidity
        const day3Humidity = data.daily[3].humidity;
        //day 4
        // variable for weather icon id
        const day4WeatherIconId = data.daily[4].weather[0].icon;
        // variable for weather description
        const day4WeatherDescription = data.daily[4].weather[0].description;
        //variable for temp
        const day4Temp = data.daily[4].temp.day;
        //variable for Wind
        const day4Wind = data.daily[4].wind_speed;
        //variable for Humidity
        const day4Humidity = data.daily[4].humidity;
        //day 5
        // variable for weather icon id
        const day5WeatherIconId = data.daily[5].weather[0].icon;
        // variable for weather description
        const day5WeatherDescription = data.daily[5].weather[0].description;
        //variable for temp
        const day5Temp = data.daily[5].temp.day;
        //variable for ind
        const day5Wind = data.daily[5].wind_speed;
        //variable for Humidity
        const day5Humidity = data.daily[5].humidity;

        // call displayForecastResults for each forecast day and send it weather information for that day
        displayForecastResults(day1WeatherIconId, day1WeatherDescription, day1Temp, day1Wind, day1Humidity, day2WeatherIconId, day2WeatherDescription, day2Temp, day2Wind, day2Humidity, day3WeatherIconId, day3WeatherDescription, day3Temp, day3Wind, day3Humidity, day4WeatherIconId, day4WeatherDescription, day4Temp, day4Wind, day4Humidity, day5WeatherIconId, day5WeatherDescription, day5Temp, day5Wind, day5Humidity);
      }
    });
}

//
function displayForecastResults(day1WeatherIconId, day1WeatherDescription, day1Temp, day1Wind, day1Humidity, day2WeatherIconId, day2WeatherDescription, day2Temp, day2Wind, day2Humidity, day3WeatherIconId, day3WeatherDescription, day3Temp, day3Wind, day3Humidity, day4WeatherIconId, day4WeatherDescription, day4Temp, day4Wind, day4Humidity, day5WeatherIconId, day5WeatherDescription, day5Temp, day5Wind, day5Humidity) {
  // clear existing error
  document.getElementById("errorDiv").innerHTML = "";

  // Day 1 Forecast
  // display current date
  const day1forecastDate = moment().add(1, "d").format("L");
  document.getElementById("forecastDay1Date").innerHTML = day1forecastDate;
  // display weather icon
  document.getElementById("forecastDay1WeatherIconDisplay").src = `https://openweathermap.org/img/wn/${day1WeatherIconId}.png`;
  // add appropriate alt property to icon image
  document.getElementById("forecastDay1WeatherIconDisplay").alt = day1WeatherDescription;
  // display current temperature
  document.getElementById("forecastDay1Temp").innerHTML = `Temp: ${day1Temp}°F`;
  // display current wind speed
  document.getElementById("forecastDay1WindSpeed").innerHTML = `Wind: ${day1Wind} MPH`;
  // display current humidity
  document.getElementById("forecastDay1Humidity").innerHTML = `Humidity: ${day1Humidity} %`;

  // Day 2 Forecast
  // display current date
  const day2forecastDate = moment().add(2, "d").format("L");
  document.getElementById("forecastDay2Date").innerHTML = day2forecastDate;
  // display weather icon
  document.getElementById("forecastDay2WeatherIconDisplay").src = `https://openweathermap.org/img/wn/${day2WeatherIconId}.png`;
  // add appropriate alt property to icon image
  document.getElementById("forecastDay2WeatherIconDisplay").alt = day2WeatherDescription;
  // display current temperature
  document.getElementById("forecastDay2Temp").innerHTML = `Temp: ${day2Temp}°F`;
  // display current wind speed
  document.getElementById("forecastDay2WindSpeed").innerHTML = `Wind: ${day2Wind} MPH`;
  // display current humidity
  document.getElementById("forecastDay2Humidity").innerHTML = `Humidity: ${day2Humidity} %`;

  // Day 3 Forecast
  // display current date
  const day3forecastDate = moment().add(3, "d").format("L");
  document.getElementById("forecastDay3Date").innerHTML = day3forecastDate;
  // display weather icon
  document.getElementById("forecastDay3WeatherIconDisplay").src = `https://openweathermap.org/img/wn/${day3WeatherIconId}.png`;
  // add appropriate alt property to icon image
  document.getElementById("forecastDay3WeatherIconDisplay").alt = day3WeatherDescription;
  // display current temperature
  document.getElementById("forecastDay3Temp").innerHTML = `Temp: ${day3Temp}°F`;
  // display current wind speed
  document.getElementById("forecastDay3WindSpeed").innerHTML = `Wind: ${day3Wind} MPH`;
  // display current humidity
  document.getElementById("forecastDay3Humidity").innerHTML = `Humidity: ${day3Humidity} %`;

  // Day 4 Forecast
  // display current date
  const day4forecastDate = moment().add(4, "d").format("L");
  document.getElementById("forecastDay4Date").innerHTML = day4forecastDate;
  // display weather icon
  document.getElementById("forecastDay4WeatherIconDisplay").src = `https://openweathermap.org/img/wn/${day4WeatherIconId}.png`;
  // add appropriate alt property to icon image
  document.getElementById("forecastDay4WeatherIconDisplay").alt = day4WeatherDescription;
  // display current temperature
  document.getElementById("forecastDay4Temp").innerHTML = `Temp: ${day4Temp}°F`;
  // display current wind speed
  document.getElementById("forecastDay4WindSpeed").innerHTML = `Wind: ${day4Wind} MPH`;
  // display current humidity
  document.getElementById("forecastDay4Humidity").innerHTML = `Humidity: ${day4Humidity} %`;

  // Day 5 Forecast
  // display current date
  const day5forecastDate = moment().add(5, "d").format("L");
  document.getElementById("forecastDay5Date").innerHTML = day5forecastDate;
  // display weather icon
  document.getElementById("forecastDay5WeatherIconDisplay").src = `https://openweathermap.org/img/wn/${day5WeatherIconId}.png`;
  // add appropriate alt property to icon image
  document.getElementById("forecastDay5WeatherIconDisplay").alt = day5WeatherDescription;
  // display current temperature
  document.getElementById("forecastDay5Temp").innerHTML = `Temp: ${day5Temp}°F`;
  // display current wind speed
  document.getElementById("forecastDay5WindSpeed").innerHTML = `Wind: ${day5Wind} MPH`;
  // display current humidity
  document.getElementById("forecastDay5Humidity").innerHTML = `Humidity: ${day5Humidity} %`;

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
