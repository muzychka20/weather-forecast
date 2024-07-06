export class Forecast {
  #url;
  #appid;
  #data;

  constructor(url, appid) {
    this.#url = url;
    this.#appid = appid;
  }

  async getData() {
    return this.#data;
  }

  async getCurrentWeather(city) {
    return new Promise((resolve, reject) => {
      $.ajax({
        url: this.#url,
        data: {
          q: city,
          appid: this.#appid,
        },
        method: "GET",
      })
        .done((data) => {
          this.#data = data;
          resolve(data);
        })
        .fail((error) => {
          reject(error);
        });
    });
  }

  async getFiveDayWeather(city) {
    return new Promise((resolve, reject) => {
      $.ajax({
        url: this.#url,
        data: {
          q: city,
          appid: this.#appid,
        },
        method: "GET",
      })
        .done((data) => {
          resolve(data);
        })
        .fail((error) => {
          reject(error);
        });
    });
  }

  getWeatherWithDate(data) {
    let weatherAtAfternoon = [];
    let dateArray = [];
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
    return {
      dateArray: dateArray,
      weatherAtAfternoon: weatherAtAfternoon,
    };
  }
}
