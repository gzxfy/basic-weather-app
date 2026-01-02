
async function fetchWeather() {
    let searchInput = document.getElementById("city").value;
    const weatherDataSection = document.getElementById("weather-data");
    weatherDataSection.style.display = "block";
    const apiKey = "83f9d149a12d9b5f5d96085061028b91";
    
    //if blank then this will display
    if (searchInput == "") {
        weatherDataSection.innerHTML = `
        <div> 
            <h2>Empty Input!</h2>
            <p>Please try again with a valid <u>city name</u>.</p>
        </div>`;
        return;
    }
    
    const geocodeData = await getLonAndLat(searchInput);
    if (geocodeData) {
        await getWeatherData(geocodeData.lon, geocodeData.lat)
    }   

    async function getLonAndLat(query) {
        // const countryCode = 1;
        const geocodeURL = `https://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=1&appid=${apiKey}`; 
        const response = await fetch(geocodeURL);
        if(!response.ok) {
            console.log("Bad response! ", response.status);
            return;
        }

        const data = await response.json();

        if (data.length == 0) {
            console.log("Something went wrong here.");
            weatherDataSection.innerHTML = `
            <div>
                <h2>Invalid Input: "${searchInput}"</h2>
                <p>Please Try again with a valid <u>city name</u>.</p>
            </div>
            `;
            return;
        } else {
            return data[0];
        }
    }

    async function getWeatherData(lon, lat) {
        const weatherURL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}`;
        const response = await fetch(weatherURL);
        if (!response.ok) {
            console.log("Bad response ! ", response.status);
            return;
        }

        const data = await response.json();

        weatherDataSection.style.display = "flex";
        weatherDataSection.innerHTML = `
        <img src="https://openweathermap.org/img/wn/${data.weather[0].icon}.png" alt="${data.weather[0].description}" width="100" />
        <div>
        <h2>${data.name}</h2>
        <p><strong>Temperature:</strong> ${Math.round(data.main.temp - 273.15)}°C</p>
        <p><strong>Description:</strong> ${data.weather[0].description}</p>
        </div>`;
    }
}

