import { GeoPosition } from "./GeoLocation.js";
import { DateTime } from "./DateTime.js";
import { Forecast } from "./Forecast.js";
import { Interface } from "./Interface.js";

let dateTime = new DateTime();
let page = new Interface();

async function getCityByCoordinates() {
  try {
    const geoPosition = new GeoPosition(
      "https://maps.googleapis.com/maps/api/geocode/json",
      "*"
    );
    return await geoPosition.getCity();
  } catch (error) {
    console.error("Error:", error);
  }
}

async function setDate() {
  $(".input-field").val(await getCityByCoordinates());
  $("#current_date").html(dateTime.getCurrentDate());
}

async function setCurrentWeather() {
  let forecast = new Forecast(
    "https://api.openweathermap.org/data/2.5/weather",
    "*"
  );
  let data = await forecast.getCurrentWeather(page.getCity());
  if (data) {
    page.setCurrentWeatherInterface(data);
  } else {
    page.showError();
  }
}

function showWeatherForDay(data, dateCurrent) {
  $("#date").empty();
  $("#forecast").empty();
  $("#temp").empty();
  $("#realFeel").empty();
  $("#wind").empty();

  $("#date").append($("<td></td>").text("day"));
  $("#forecast").append($("<td></td>").text("Forecast"));
  $("#temp").append($("<td></td>").html("Temp (&#8451;)"));
  $("#realFeel").append($("<td></td>").text("RealFeel"));
  $("#wind").append($("<td></td>").text("Wind (km/h)"));  

  data.list.forEach((element) => {

    let weather_main = $("<td></td>");
    let weather_icon = $("<img>", {
      src:
        "https://openweathermap.org/img/wn/" +
        element.weather[0].icon +
        ".png",
    });
    let waether_title = $("<span></span>").text(element.weather[0].main);
    let date = $("<td></td>").text(element.dt_txt);
    let temp = $("<td></td>").text(element.main["temp"]);
    let feels_like = $("<td></td>").text(element.main["feels_like"]);
    let wind = $("<td></td>").text(element.wind["speed"]);
    
    if (element.dt_txt.split(" ")[0] == dateCurrent) {
      weather_main.append(weather_icon);
      weather_main.append(waether_title);
      $("#date").append(date);
      $("#forecast").append(weather_main);
      $("#temp").append(temp);
      $("#realFeel").append(feels_like);
      $("#wind").append(wind);
    }
  });
} 

async function getFiveDayWeather() {
  let forecast = new Forecast(
    "https://api.openweathermap.org/data/2.5/forecast",
    "*"
  );
  let data = await forecast.getFiveDayWeather(page.getCity());
  if (data) {
    console.log(data);

    let dateArray = [];
    data.list.forEach((element) => {
      let date = element.dt_txt.split(" ")[0];
      if (!dateArray.includes(date)) {
        dateArray.push(date);
      }
    });

    dateArray.forEach((element) => {
      let block = $("<div></div>").text(element).click((event) => {showWeatherForDay(data, element)});
      $("#days").append(block);
    });

    console.log(dateArray);

   
  } else {
    page.showError();
  }
}

function makeRequest(index) {
  switch (index) {
    case 0:
      setCurrentWeather();
      break;
    case 1:
      getFiveDayWeather();
      break;
  }
}

function activateMenu() {
  $(".menu_list_item").click(function () {
    let index = page.changeTab($(this));
    makeRequest(index);
  });
}

$(document).ready(async function () {
  activateMenu();
  await setDate();
  makeRequest(0);
});
