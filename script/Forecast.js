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
}
