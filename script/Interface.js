import { DateTime } from "./DateTime.js";

export class Interface {
  #dateTime;
  constructor() {
    this.#dateTime = new DateTime();
  }

  setCurrentWeatherInterface(data) {    
    $(".tab_content_box").eq(0).show();
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
      this.#dateTime.convertSecondsToAMPM(data.sys.sunrise + data.timezone)
    );
    $("#weather_sys_sunset").text(
      this.#dateTime.convertSecondsToAMPM(data.sys.sunset + data.timezone)
    );
    let duration = this.#dateTime.getDuration(
      data.sys.sunrise,
      data.sys.sunset
    );
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

  changeTab(tab) {
    let index = tab.index();
    $(".menu_list_item").removeClass("active");
    tab.addClass("active");
    $(".tab_content_box").hide();
    $(".tab_content_box").eq(index).show();
    return index;
  }
}
