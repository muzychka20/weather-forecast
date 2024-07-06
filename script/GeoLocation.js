export class GeoPosition {
  #city;
  #url;
  #key;
  #towns = [];

  constructor(url, key) {
    this.#url = url;
    this.#key = key;
    this.#city = null;
  }

  async getNearbyTowns() {
    try {
      if (this.#towns.length === 0) {
        await this.fetchNearbyTowns();
      }
      return this.#towns;
    } catch (error) {
      console.error("Error fetching nearby towns:", error);
      throw error;
    }
  }

  async getCity() {
    try {
      if (!this.#city) {
        await this.fetchCityByPosition();
      }
      return this.#city;
    } catch (error) {
      console.error("Error fetching city:", error);
      throw error;
    }
  }

  async fetchCityByPosition() {
    try {
      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      });
      const lat = position.coords.latitude;
      const lng = position.coords.longitude;
      this.#city = await this.getTownByLatLng(lat, lng);
    } catch (error) {
      console.error("Error getting current position:", error);
      throw error;
    }
  }

  async getTownByLatLng(lat, lng) {
    try {
      const data = await $.ajax({
        url: this.#url,
        data: {
          latlng: `${lat},${lng}`,
          key: this.#key,
        },
        method: "GET",
      });
      const city = data.results[0].address_components.find((component) =>
        component.types.includes("locality")
      ).long_name;
      return city;
    } catch (error) {
      console.error(`Error fetching city for ${lat},${lng}:`, error);
      throw error;
    }
  }

  async fetchNearbyTowns() {
    try {
      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      });
      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;
      for (let i = -0.5; i <= 0.5; i += 0.5) {
        for (let j = -0.5; j <= 0.5; j += 0.5) {
          const lat = latitude + i;
          const lng = longitude + j;
          const city = await this.getTownByLatLng(lat, lng);
          this.#towns.push(city);
        }
      }
    } catch (error) {
      console.error("Error fetching nearby towns:", error);
      throw error;
    }
  }
}
