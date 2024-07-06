import { GeoPosition } from "./GeoLocation.js";
import { DateTime } from "./DateTime.js";
import { Forecast } from "./Forecast.js";
import { Interface } from "./Interface.js";
import { degToCompass } from "./CompassDirection.js";

let page = new Interface();

async function getCityByCoordinates() {
  try {
    const geoPosition = new GeoPosition(
      "https://maps.googleapis.com/maps/api/geocode/json",
      "*"
    );
    return await geoPosition.getCity();
  } catch (error) {
    console.error(error);
  }
}

async function setCurrentWeather() {
  try {
    let forecast = new Forecast(
      "https://api.openweathermap.org/data/2.5/weather",
      "*"
    );
    let data = await forecast.getCurrentWeather(page.getCity());
    page.setCurrentWeatherInterface(data);
  } catch (error) {
    console.log(error);
    page.showError();
  }
}

async function setFiveDayWeather() {
  try {
    let forecast = new Forecast(
      "https://api.openweathermap.org/data/2.5/forecast",
      "*"
    );
    let data = await forecast.getFiveDayWeather(page.getCity());
    let weatherWithDate = forecast.getWeatherWithDate(data);
    page.setFiveDayWeatherInterface(weatherWithDate, data);
  } catch (error) {
    console.log(error);
    page.showError();
  }
}

function makeRequest(index) {
  switch (index) {
    case 0:
      setCurrentWeather();
      break;
    case 1:
      setFiveDayWeather();
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
  page.setDate(await getCityByCoordinates());
  makeRequest(0);
});
