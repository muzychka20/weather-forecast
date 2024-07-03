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
      "***"
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
    "***"
  );
  let data = await forecast.getCurrentWeather(page.getCity());
  if (data) {
    page.setCurrentWeatherInterface(data);
  } else {
    page.showError();
  }
}

async function getFiveDayWeather() {
  let forecast = new Forecast(    
    "https://api.openweathermap.org/data/2.5/forecast",
    "***"
  );
  let data = await forecast.getFiveDayWeather(page.getCity());
  if (data) {
    console.log(data);
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
