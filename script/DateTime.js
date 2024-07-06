export class DateTime {
  constructor() {}

  static convertSecondesToHoursMinutes(t) {
    return {
      hours: Math.floor(t / 3600) % 24,
      minutes: Math.floor((t % 3600) / 60),
    };
  }
  
  static convertSecondsToAMPM(t) {
    let time = this.convertSecondesToHoursMinutes(t);
    let ampm = time.hours >= 12 ? " PM" : " AM";
    let hours = time.hours % 12;
    hours = hours ? hours : 12;
    let minutes = time.minutes < 10 ? "0" + time.minutes : time.minutes;
    return hours + ":" + minutes + ampm;
  }
  
  static getCurrentDate() {
    let today = new Date();
    let dd = String(today.getDate()).padStart(2, "0");
    let mm = String(today.getMonth() + 1).padStart(2, "0");
    let yyyy = today.getFullYear();
    return dd + "." + mm + "." + yyyy;
  }

  static getDuration(t1, t2) {
    let duration = this.convertSecondesToHoursMinutes(t2 - t1);
    duration.hours = duration.hours < 10 ? "0" + duration.hours : duration.hours;
    duration.minutes = duration.minutes < 10 ? "0" + duration.minutes : duration.minutes;
    return duration;
  }

  static getDateObject(dateStr, locale) {
    var date = new Date(dateStr);
    const month = date.toLocaleString(locale, { month: "short" });
    const dayShort = date.toLocaleDateString(locale, { weekday: "short" });
    const dayLong = date.toLocaleDateString(locale, { weekday: "long" });
    const dateNumber = date.toLocaleDateString(locale, { day: "numeric" });
    return { month: month, dayLong: dayLong, dayShort: dayShort, dateNumber: dateNumber };
  }

  static toHours(date) {
    let ampm = date.hours >= 12 ? "pm" : "am";
    let hours = date.split(" ")[1].split(":")[0] % 12;
    hours = hours ? hours : 12;
    return hours + ampm;
  }
}