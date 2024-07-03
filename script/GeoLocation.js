export class GeoPosition {
  #city;
  #url;
  #key;

  constructor(url, key) {
    this.#url = url;
    this.#key = key;
    this.#city = null;    
  }

  async getCity() {
    if (!this.#city) {
      await this.getCityByLatLng();
    }
    return this.#city;
  }

  async getCityByLatLng() {
    return new Promise((resolve, reject) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;
          $.ajax({
            url: this.#url,
            data: {
              latlng: `${latitude},${longitude}`,
              key: this.#key,
            },
            method: "GET",
          })
            .done((data) => {
              const city = data.results[0].address_components.find(
                (component) => component.types.includes("locality")
              ).long_name;
              this.#city = city;
              resolve(city);
            })
            .fail((error) => {
              reject(error);
            });
        });
      } else {
        reject(new Error("Geolocation is not supported by this browser."));
      }
    });
  }
}
