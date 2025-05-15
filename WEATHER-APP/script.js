const api_key = "790154d59256942b3834474ea214e8f7";

let cityname = document.getElementById("input-city").value;
console.log(cityname);

let searchbtn = document.getElementById("search-btn");

async function fetchdata() {
  let city = document.getElementById("input-city").value.trim();
  console.log(city);

  const apiKey = "790154d59256942b3834474ea214e8f7";
  let url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
    city
  )}&appid=${apiKey}&units=metric`;

  try {
    let requestdata = await fetch(url);
    let data = await requestdata.json();

    // Update city name
    document.getElementById("cityname").innerText = data.name;
    document.getElementById("weather-description").innerText =
      data.weather[0].description;
    document.getElementById("temperature").innerText = `${data.main.temp}°C`;
    console.log(data);

    function convertTime(time) {
      let date = new Date(time * 1000); // Convert from UNIX timestamp to Date object
      let formatted = date.toLocaleTimeString("en-IN", {
        timeZone: "Asia/Kolkata", // Set the timezone to Asia/Kolkata for IST
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
      return formatted;
    }

    // Update sunrise, sunset, and current time
    document.getElementById("sunrise-time").innerText = convertTime(
      data.sys.sunrise
    );
    document.getElementById("sunset-time").innerText = convertTime(
      data.sys.sunset
    );
    document.getElementById("current-time").innerText = convertTime(data.dt);
    let today = new Date();
    let formmateddate =
      today.getDate() +
      "-" +
      (today.getMonth() + 1) +
      "-" +
      today.getFullYear();
    document.getElementById("current-date").innerText = formmateddate;
    // Clear input box
    document.getElementById("input-city").value = "";
    let lon = data.coord.lon;
    let lat = data.coord.lat;
    async function fetchaqi(l, lo) {
      let aqidata = await fetch(
        `https://api.openweathermap.org/data/2.5/air_pollution?lat=${l}&lon=${lo}&appid=${apiKey}`
      );
      let aqidatajson = await aqidata.json();
      let list = aqidatajson.list[0].components;
      console.log(list);
      document.getElementById("co").innerText = `${list.co}μg/m³`;
      document.getElementById("no2").innerText = `${list.no2}μg/m³`;
      document.getElementById("nh3").innerText = `${list.nh3}μg/m³`;
      document.getElementById("no").innerText = `${list.no}μg/m³`;
    }
    document.getElementById("pressure").innerText = `${data.main.pressure} hPa`;
    document.getElementById("humidity").innerText = `${data.main.humidity} %`;
    document.getElementById("windspeed").innerText = `${data.wind.speed} kmph`;
    document.getElementById("sealevel").innerText = `${data.main.sea_level}m `;
    fetchaqi(lat, lon);

    async function getForecast(city) {
      // Replace this with your OpenWeatherMap API key
      const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${api_key}&units=metric`;

      try {
        const response = await fetch(url);
        const data = await response.json();

        if (!data || !data.list) {
          console.error("No forecast data found.");
          return;
        }

        // Track 1 forecast per day (around 12:00 PM is ideal)
        let count = 0;
        const usedDates = new Set();

        for (let i = 0; i < data.list.length && count < 5; i++) {
          const item = data.list[i];
          const date = new Date(item.dt_txt);

          // Use only forecasts around 12 PM and skip duplicate dates
          if (date.getHours() === 12) {
            const dateStr = date.toDateString();
            if (usedDates.has(dateStr)) continue;
            usedDates.add(dateStr);

            const feelsLike = Math.round(item.main.feels_like);
            const dayName = date.toLocaleDateString("en-US", {
              weekday: "long",
            });
            const formattedDate = `${String(date.getDate()).padStart(
              2,
              "0"
            )}-${String(date.getMonth() + 1).padStart(
              2,
              "0"
            )}-${date.getFullYear()}`;

            // Inject into HTML
            document.getElementById(`day${count + 1}`).textContent = dayName;
            document.getElementById(`date${count + 1}`).textContent =
              formattedDate;
            document.getElementById(
              `feel${count + 1}`
            ).textContent = `${feelsLike}°C`;

            count++;
          }
        }
      } catch (error) {
        console.error("Error fetching forecast:", error);
      }
    }
    getForecast(data.name);
    async function getThreeHourForecast(city) {
      const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${api_key}&units=metric`;

      try {
        const response = await fetch(url);
        const data = await response.json();

        if (!data || !data.list || data.list.length === 0) {
          console.error("No 3-hour forecast data found.");
          return;
        }

        for (let i = 0; i < 6; i++) {
          const slot = data.list[i];
          const date = new Date(slot.dt_txt);

          const time = date.toLocaleTimeString("en-IN", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          });

          const feels = Math.round(slot.main.feels_like);

          // Inject time and feels-like temp (NO date)
          document.getElementById(`slot${i + 1}`).innerHTML = `
        <h4>${time}</h4>
        <img src="sun.png"
                        alt=""
                        style="width: 70px;height: 70px;">
        <p>${feels}°C</p>
      `;
        }
      } catch (error) {
        console.error("Error fetching 3-hour forecast:", error);
      }
    }
    getThreeHourForecast(data.name);
  } catch (error) {
    console.error("Failed to fetch data:", error);
    alert("Enter Proper City Name");
  }
}

// Add event listener to search button
let input = document.getElementById("input-city");

input.addEventListener("keypress", function (event) {
  if (event.key === "Enter") {
    event.preventDefault(); // optional: prevents form submit/reload
    fetchdata(); // Call your existing fetch function
  }
});
