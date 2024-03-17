const map = L.map('map').setView([0, 0], 13);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);
let marker;

document.getElementById("search-button").addEventListener("click", () => {   
    let d = document.getElementById("location-input").value.trim();
    if (d) {
        let reop = {
            method: 'GET'
        };

        fetch(`https://api.weatherapi.com/v1/current.json?key=5d7a25b2cad54f73bb0112953240203&q=${d}`, reop)
            .then(response => response.json())
            .then(data => {
                alert("Discover Your  Weather Information in " + data.location.name);
                updateWeatherInfo(data);
                updateMap(data.location.lat, data.location.lon);
                fetchFutureForecast(d);
                fetchPastForecast(d);
            })
            .catch(error => {
                console.error("Error fetching current weather:", error);
                alert("Location not found");
            });
    } else {
        alert("Please enter a location");
    }
});

function updateWeatherInfo(data) {
    document.getElementById("area").innerHTML = data.location.name;
    document.getElementById("temp").innerHTML = data.current.temp_c + " °C";
    document.getElementById("temp1").innerHTML = data.current.temp_c;
    document.getElementById("condition1").innerHTML = data.current.condition.text;
    document.getElementById("weatherIcon").src = data.current.condition.icon;
    document.getElementById("local-time").innerHTML = data.location.localtime;
    document.getElementById("region").innerHTML = data.location.region;
    document.getElementById("country").innerHTML = data.location.country;
    document.getElementById("lon").innerHTML = data.location.lon;
    document.getElementById("lat").innerHTML = data.location.lat;
    document.getElementById("condition").innerHTML = data.current.condition.text;
    document.getElementById("humidity").innerHTML = data.current.humidity;
    document.getElementById("wind").innerHTML = data.current.wind_kph;
    document.getElementById("location").innerHTML = data.location.tz_id;
}

function fetchFutureForecast(location) {
    const startDate = new Date();
    let currentDay = new Date(startDate);

    for (let i = 0; i < 7; i++) {
        const formattedDate = currentDay.toISOString().split('T')[0];

        fetch(`https://api.weatherapi.com/v1/forecast.json?key=5d7a25b2cad54f73bb0112953240203&q=${location}&days=7&dt=${formattedDate}&aqi=yes&alerts=yes`)
            .then(response => response.json())
            .then(data => {
                document.getElementById(`date${i + 1}`).innerHTML = data.forecast.forecastday[0].date;
                document.getElementById(`img${i + 1}`).src = data.forecast.forecastday[0].day.condition.icon;
                document.getElementById(`a${i + 1}`).innerHTML = data.forecast.forecastday[0].day.condition.text;
                document.getElementById(`c${i + 1}`).innerHTML = `${data.forecast.forecastday[0].day.avgtemp_c} °C`;
            })
            .catch(error => console.error('Error fetching future forecast:', error));

        currentDay.setDate(currentDay.getDate() + 1);
    }
}

function fetchPastForecast(location) {
    const startDate = new Date();
    let currentDays = new Date(startDate);

    for (let i = 5; i > 0; i--) {
        const formattedDate = currentDays.toISOString().split('T')[0];

        fetch(`https://api.weatherapi.com/v1/history.json?key=5d7a25b2cad54f73bb0112953240203&q=${location}&days=7&dt=${formattedDate}&aqi=yes&alerts=yes`)
            .then(response => response.json())
            .then(data => {
                document.getElementById(`d${i - 1}`).innerHTML = data.forecast.forecastday[0].date;
                document.getElementById(`i${i - 1}`).src = data.forecast.forecastday[0].day.condition.icon;
                document.getElementById(`e${i - 1}`).innerHTML = `${data.forecast.forecastday[0].day.avgtemp_c} °C`;
            })
            .catch(error => console.error('Error fetching past forecast:', error));

        currentDays.setDate(currentDays.getDate() - 1);
    }
}

function updateMap(lat, lon) {
    if (marker) {
        marker.setLatLng([lat, lon]);
    } else {
        marker = L.marker([lat, lon]).addTo(map);
    }
    map.setView([lat, lon], 13);
}

function updateLocalTime() {
    const localTimeElement = document.getElementById("local-time");
    const now = new Date();
    const localTimeString = now.toLocaleTimeString();

    localTimeElement.textContent = localTimeString;
}

function darkMode() {
    let element = document.body;
    element.classList.toggle("dark-mode");
}

updateLocalTime();
setInterval(updateLocalTime, 1000);
