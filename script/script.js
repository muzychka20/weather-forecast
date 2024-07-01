function timeConvert(t) {
  let hours = Math.floor(t / 3600) % 24;
  let minutes = Math.floor((t % 3600) / 60);
  let ampm = hours >= 12 ? " PM" : " AM";
  hours = hours % 12;
  hours = hours ? hours : 12;
  minutes = minutes < 10 ? "0" + minutes : minutes;
  return hours + ":" + minutes + ampm;
}

function getCurrentDate() {
  let today = new Date();
  let dd = String(today.getDate()).padStart(2, "0");
  let mm = String(today.getMonth() + 1).padStart(2, "0");
  let yyyy = today.getFullYear();
  return dd + "." + mm + "." + yyyy;
}

function setDate() {
  $("#current_date").html(getCurrentDate());
}

function activateMenu() {
  $(".menu_list_item").click(function () {
    index = $(this).index();
    $(".menu_list_item").removeClass("active");
    $(this).addClass("active");
    $(".tab_content_box").hide();
    $(".tab_content_box").eq(index).show();
    makeRequest(index);
  });
}

function setData(data) {
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
  $("#weather_sys_sunrise").text(timeConvert(data.sys.sunrise));
  $("#weather_sys_sunset").text(timeConvert(data.sys.sunset));
}

function getCity() {
  return $(".input-field").val();
}

function getCurrentWeather() {
  let city = getCity();
  $.ajax({
    url: "https://api.openweathermap.org/data/2.5/weather",
    data: {
      q: city,
      appid: "****************************",
    },
    method: "GET",
  })
    .done((data) => {
      setData(data);
    })
    .fail((error) => {
      console.error(error);
    });
}

function getFiveDayWeather() {
  let city = getCity();
  $.ajax({
    url: "https://api.openweathermap.org/data/2.5/forecast",
    data: {
      q: city,
      appid: "****************************",
    },
    method: "GET",
  })
    .done((data) => {
      setData(data);
    })
    .fail((error) => {
      console.error(error);
    });
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

$(document).ready(function () {
  activateMenu();
  setDate();
  makeRequest();
});

// Kamianske
