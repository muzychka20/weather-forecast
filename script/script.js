import { GeoPosition } from "./GeoLocation.js";
import { DateTime } from "./DateTime.js";

let dateTime = new DateTime();

async function getCityByCoordinates() {
  try {
    const geoPosition = new GeoPosition(
      "https://maps.googleapis.com/maps/api/geocode/json",
      "**********************************"
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

function activateMenu() {
  $(".menu_list_item").click(function () {
    let index = $(this).index();
    $(".menu_list_item").removeClass("active");
    $(this).addClass("active");
    $(".tab_content_box").hide();
    $(".tab_content_box").eq(index).show();
    makeRequest(index);
  });
}

function showError() {
  let city = getCity();
  $(".menu_list_item").removeClass("active");
  $(".tab_content_box").hide();
  $(".tab_content_box").eq(2).show();
  $("#error_name").text(city);
}

function getCity() {
  return $(".input-field").val();
}

function setCurrentWeather(data) {
  $(".weather_main_icon img").attr(
    "src",
    "https://openweathermap.org/img/wn/" + data.weather[0].icon + ".png"
  );
  $(".weather_main_label span").text(data.weather[0].main);
  $("#weather_temerature_real_number").text(
    Math.floor(data.main.temp - 273.16)
  );
  $("#weather_temerature_feal_number").text(
    Math.floor(data.main.feels_like - 273.16)
  );
  $("#weather_sys_sunrise").text(
    dateTime.convertSecondsToAMPM(data.sys.sunrise + data.timezone)
  );
  $("#weather_sys_sunset").text(
    dateTime.convertSecondsToAMPM(data.sys.sunset + data.timezone)
  );

  let duration = dateTime.getDuration(data.sys.sunrise, data.sys.sunset);
  $("#weather_sys_duration").text(
    duration.hours + ":" + duration.minutes + " hr"
  );
}

function makeRequest(index) {
  switch (index) {
    case 0:
      getCurrentWeather();
      break;
    case 1:
      getFiveDayWeather();
      break;
  }
}

function getCurrentWeather() {
  let city = getCity();
  $.ajax({
    url: "https://api.openweathermap.org/data/2.5/weather",
    data: {
      q: city,
      appid: "**************",
    },
    method: "GET",
  })
    .done((data) => {
      setCurrentWeather(data);
    })
    .fail((error) => {
      showError();
    });
}

function getFiveDayWeather() {
  let city = getCity();
  $.ajax({
    url: "https://api.openweathermap.org/data/2.5/forecast",
    data: {
      q: city,
      appid: "**************",
    },
    method: "GET",
  })
    .done((data) => {
      console.log(data);
    })
    .fail((error) => {
      showError();
    });
}

$(document).ready(async function () {
  activateMenu();
  setDate();
  makeRequest();
});
