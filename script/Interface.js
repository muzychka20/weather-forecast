import { DateTime } from "./DateTime.js";
import { convertKelvinToCelcium } from "./Temp.js";
import { degToCompass } from "./CompassDirection.js";

export class Interface {
  constructor() {}

  setCurrentWeatherInterface(data) {
    $(".tab_content_box").eq(0).show();
    $(".weather_main_icon img").attr(
      "src",
      "https://openweathermap.org/img/wn/" + data.weather[0].icon + ".png"
    );
    $(".weather_main_label span").text(data.weather[0].main);
    $("#weather_temperature_real_number").text(
      Math.floor(data.main.temp - 273.16)
    );
    $("#weather_temerature_feal_number").text(
      Math.floor(data.main.feels_like - 273.16)
    );
    $("#weather_sys_sunrise").text(
      DateTime.convertSecondsToAMPM(data.sys.sunrise + data.timezone)
    );
    $("#weather_sys_sunset").text(
      DateTime.convertSecondsToAMPM(data.sys.sunset + data.timezone)
    );
    let duration = DateTime.getDuration(data.sys.sunrise, data.sys.sunset);
    $("#weather_sys_duration").text(
      duration.hours + ":" + duration.minutes + " hr"
    );
  }

  showError() {
    let city = this.getCity();
    $(".menu_list_item").removeClass("active");
    $(".tab_content_box").hide();
    $(".tab_content_box").eq(2).show();
    $("#error_name").text(city);
  }

  getCity() {
    return $(".input-field").val();
  }

  setCity(city) {
    $(".input-field").val(city);
  }

  changeTab(tab) {
    let index = tab.index();
    $(".menu_list_item").removeClass("active");
    tab.addClass("active");
    $(".tab_content_box").hide();
    $(".tab_content_box").eq(index).show();
    $(".hourly_section").hide();
    return index;
  }

  createDayBlock(data) {
    let daysBlock = $("<div>").addClass("days_block");
    let dateBlock = $("<div>").addClass("days_block_date");
    $("<h2>")
      .attr("id", "day_of_week")
      .text(data.date.dayShort)
      .appendTo(dateBlock);
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
      .append(
        $("<span>").html(convertKelvinToCelcium(data.main.temp) + "&#8451;")
      );
    $("<span>")
      .attr("id", "weather_main_day")
      .text(data.weather.main)
      .appendTo(weatherBlock);
    weatherBlock.appendTo(daysBlock);
    return daysBlock;
  }

  showWeatherForDay(data, dateCurrent) {
    $(".hourly_section").show();

    $("#date").empty();
    $("#forecast").empty();
    $("#temp").empty();
    $("#realFeel").empty();
    $("#wind").empty();

    $("#date").append(
      $("<td></td>").text(DateTime.getDateObject(dateCurrent, "en").dayLong)
    );
    $("#forecast").append($("<td></td>").text("Forecast"));
    $("#temp").append($("<td></td>").html("Temp (&#8451;)"));
    $("#realFeel").append($("<td></td>").text("RealFeel"));
    $("#wind").append($("<td></td>").text("Wind (km/h)"));

    data.list.forEach((element) => {
      let weather_main = $("<td></td>");
      let cell = $(`<div class="cell"></div>`);
      let weather_icon = $("<img>", {
        src:
          "https://openweathermap.org/img/wn/" +
          element.weather[0].icon +
          ".png",
      });
      let waether_title = $("<span></span>").text(element.weather[0].main);
      let date = $("<td></td>").text(DateTime.toHours(element.dt_txt));
      let temp = $("<td></td>").html(
        convertKelvinToCelcium(element.main["temp"]) + "&deg"
      );
      let feels_like = $("<td></td>").html(
        convertKelvinToCelcium(element.main["feels_like"]) + "&deg"
      );
      let wind = $("<td></td>").text(
        parseInt(element.wind["speed"]) +
          " " +
          degToCompass(element.wind["deg"])
      );

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

  async setDate(city) {
    $(".input-field").val(city);
    $("#current_date").html(DateTime.getCurrentDate());
  }

  setFiveDayWeatherInterface(weatherWithDate, data) {    
    $("#days").empty();
    for (let i = 0; i < weatherWithDate.weatherAtAfternoon.length; i++) {
      let weather = weatherWithDate.weatherAtAfternoon[i].weather;
      let main = weatherWithDate.weatherAtAfternoon[i].main;
      let dateDO = DateTime.getDateObject(weatherWithDate.dateArray[i], "en");
      let block = this.createDayBlock({
        date: dateDO,
        weather: weather[0],
        main: main,
      }).click(() => {
        $("#days .days_block").removeClass("active_day");
        $(block).addClass("a  ctive_day");
        this.showWeatherForDay(data, weatherWithDate.dateArray[i]);
      });
      $("#days").append(block);
    }
  }

  setCurrentWeatherForNearbyCitiesInterface(townWeatherData) {
    $("#nearby").empty();
    for (let i = 0; i < townWeatherData.length; i++) {
      let block = $("<div>").addClass("nearby_block").attr("id", "nearby_town");
      let townName = $("<span>").text(townWeatherData[i].name);
      let weatherBlock = $("<div>").addClass("nearby_block_weather");
      let img = $("<img>").attr(
        "src",
        "https://openweathermap.org/img/wn/" +
          townWeatherData[i].weather[0].icon +
          ".png"
      );
      let temperature = $("<span>").html(
        convertKelvinToCelcium(townWeatherData[i].main.temp) + "&#8451;"
      );
      weatherBlock.append(img, temperature);
      block.append(townName, weatherBlock);
      $("#nearby").append(block);
    }
  }
}
