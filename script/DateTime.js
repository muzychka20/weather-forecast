export class DateTime {
  constructor() {}

  convertSecondesToHoursMinutes(t) {
    return {
      hours: Math.floor(t / 3600) % 24,
      minutes: Math.floor((t % 3600) / 60),
    };
  }
  
  convertSecondsToAMPM(t) {
    let time = this.convertSecondesToHoursMinutes(t);
    let ampm = time.hours >= 12 ? " PM" : " AM";
    let hours = time.hours % 12;
    hours = hours ? hours : 12;
    let minutes = time.minutes < 10 ? "0" + time.minutes : time.minutes;
    return hours + ":" + minutes + ampm;
  }
  
  getCurrentDate() {
    let today = new Date();
    let dd = String(today.getDate()).padStart(2, "0");
    let mm = String(today.getMonth() + 1).padStart(2, "0");
    let yyyy = today.getFullYear();
    return dd + "." + mm + "." + yyyy;
  }

  getDuration(t1, t2) {
    let duration = this.convertSecondesToHoursMinutes(t2 - t1);
    duration.hours = duration.hours < 10 ? "0" + duration.hours : duration.hours;
    duration.minutes = duration.minutes < 10 ? "0" + duration.minutes : duration.minutes;
    return duration;
  }
}