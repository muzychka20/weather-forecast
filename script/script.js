import { GeoPosition } from "./GeoLocation.js";
import { DateTime } from "./DateTime.js";
import { Forecast } from "./Forecast.js";
import { Interface } from "./Interface.js";

let dateTime = new DateTime();
let page = new Interface();

function convertKelvinToCelcium(value) {
  return parseInt(value - 272.15);
}

function degToCompass(num) {  
  let val = parseInt(num / 22.5 + 0.5);
  let arr = [
    "N",
    "NNE",
    "NE",
    "ENE",
    "E",
    "ESE",
    "SE",
    "SSE",
    "S",
    "SSW",
    "SW",
    "WSW",
    "W",
    "WNW",
    "NW",
    "NNW",
  ];
  return arr[val % 16];
}

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
  console.log(data);
  console.log(dateCurrent);

  $("#date").empty();
  $("#forecast").empty();
  $("#temp").empty();
  $("#realFeel").empty();
  $("#wind").empty();

  $("#date").append($("<td></td>").text(dateTime.getDateObject(dateCurrent, "en").dayLong));
  $("#forecast").append($("<td></td>").text("Forecast"));
  $("#temp").append($("<td></td>").html("Temp (&#8451;)"));
  $("#realFeel").append($("<td></td>").text("RealFeel"));
  $("#wind").append($("<td></td>").text("Wind (km/h)"));

  data.list.forEach((element) => {
    let weather_main = $("<td></td>");
    let cell = $(`<div class="cell"></div>`)
    let weather_icon = $("<img>", {
      src:
        "https://openweathermap.org/img/wn/" + element.weather[0].icon + ".png",
    });
    let waether_title = $("<span></span>").text(element.weather[0].main);    
    let date = $("<td></td>").text(dateTime.toHours(element.dt_txt));
    let temp = $("<td></td>").html(convertKelvinToCelcium(element.main["temp"]) + "&deg");
    let feels_like = $("<td></td>").html(convertKelvinToCelcium(element.main["feels_like"]) + "&deg");
    let wind = $("<td></td>").text(parseInt(element.wind["speed"]) + " " + degToCompass(element.wind["deg"]));

    if (element.dt_txt.split(" ")[0] == dateCurrent) {
      cell.append(weather_icon);
      cell.append(waether_title);
      weather_main.append(cell);
      $("#date").append(date);
      $("#forecast").append(weather_main);
      $("#temp").append(temp);
      $("#realFeel").append(feels_like);
      $("#wind").append(wind);
    }
  });
  $("table").find("tr").slice(1, 4).addClass("underline");
}

function createDayBlock(data) {  
  let daysBlock = $("<div>").addClass("days_block");
  let dateBlock = $("<div>").addClass("days_block_date");
  $("<h2>").attr("id", "day_of_week").text(data.date.dayShort).appendTo(dateBlock);
  $("<span>")
    .attr("id", "month")
    .text(data.date.month + " ")
    .appendTo(dateBlock);
  $("<span>")
    .attr("id", "day_numeric")
    .text(data.date.dateNumber)
    .appendTo(dateBlock);
  dateBlock.appendTo(daysBlock);
  let weatherBlock = $("<div>").addClass("days_block_weather");
  $("<img>")
    .attr("id", "days_block_weather_img")
    .attr(
      "src",
      "https://openweathermap.org/img/wn/" + data.weather.icon + ".png"
    )
    .appendTo(weatherBlock);
  $("<div>")
    .addClass("weather_temerature_real")
    .appendTo(weatherBlock)
    .append($("<span>").attr("id", "weather_temerature_real_number"))
    .append($("<span>").html(convertKelvinToCelcium(data.main.temp) + "&#8451;"));
  $("<span>")
    .attr("id", "weather_main_day")
    .text(data.weather.main)
    .appendTo(weatherBlock);
  weatherBlock.appendTo(daysBlock);
  return daysBlock;
}

async function getFiveDayWeather() {
  let forecast = new Forecast(
    "https://api.openweathermap.org/data/2.5/forecast",
    "*"
  );
  let data = await forecast.getFiveDayWeather(page.getCity());
  $('#days').empty();
  if (data) {
    
    let dateArray = [];
    let weatherAtAfternoon = [];

    data.list.forEach((element) => {
      let date = element.dt_txt.split(" ")[0];
      if (!dateArray.includes(date)) {
        dateArray.push(date);
      }
      let hours = element.dt_txt.split(" ")[1].split(":")[0];
      if (hours == 12) {
        weatherAtAfternoon.push(element);
      }
    });

    for (let i = 0; i < weatherAtAfternoon.length; i++) {
      let weather = weatherAtAfternoon[i].weather;
      let main = weatherAtAfternoon[i].main;
      let dateDO = dateTime.getDateObject(dateArray[i], "en");
      let block = createDayBlock({
        date: dateDO,
        weather: weather[0],
        main: main,
      })
        .click(function(event)  {
          $('#days .days_block').removeClass("active_day");
          $(this).addClass("active_day");
          showWeatherForDay(data, dateArray[i]);
        })        
      $("#days").append(block);
    }
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
