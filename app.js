document.addEventListener("DOMContentLoaded", function() {
    const apiKey = "Ax49rnXtVd5ln1g9rC1dzIy5u20rfgGs"; // Replace with your actual API key
    const form = document.getElementById("cityForm");
    const weatherDiv = document.getElementById("weather");

    form.addEventListener("submit", function(event) {
        event.preventDefault();
        const city = document.getElementById("cityInput").value;
        getWeather(city);
    });

    function getWeather(city) {
        const url = `http://dataservice.accuweather.com/locations/v1/cities/search?apikey=${apiKey}&q=${city}`;

        fetch(url)
            .then(response => response.json())
            .then(data => {
                if (data && data.length > 0) {
                    const locationKey = data[0].Key;
                    fetchWeatherData(locationKey);
                } else {
                    weatherDiv.innerHTML = `<p>City not found.</p>`;
                }
            })
            .catch(error => {
                console.error("Error fetching location data:", error);
                weatherDiv.innerHTML = `<p>Error fetching location data.</p>`;
            });
    }

    function fetchWeatherData(locationKey) {
        const url = `http://dataservice.accuweather.com/currentconditions/v1/${locationKey}?apikey=${apiKey}`;

        fetch(url)
            .then(response => response.json())
            .then(data => {
                if (data && data.length > 0) {
                    displayWeather(data[0]);
                    getDay5Weather(locationKey); 
                    get12hours(locationKey);
                } else {
                    weatherDiv.innerHTML = `<p>No weather data available.</p>`;
                }
            })
            .catch(error => {
                console.error("Error fetching weather data:", error);
                weatherDiv.innerHTML = `<p>Error fetching weather data.</p>`;
            });
    }

    function getDay5Weather(locationKey) {
        const url = `http://dataservice.accuweather.com/forecasts/v1/daily/5day/${locationKey}?apikey=${apiKey}&metric=true`;

        fetch(url)
            .then(response => response.json())
            .then(data => {
                if (data && data.DailyForecasts && data.DailyForecasts.length > 0) {
                    display5Weather(data.DailyForecasts); 
                } else {
                    weatherDiv.innerHTML = `<p>No weather data available.</p>`;
                }
            })
            .catch(error => {
                console.error("Error fetching daily forecast data:", error);
                weatherDiv.innerHTML = `<p>Error fetching daily forecast data.</p>`;
            });
    }

    function get12hours(locationKey) {
        const url = `http://dataservice.accuweather.com/forecasts/v1/hourly/12hour/${locationKey}?apikey=${apiKey}&details=true`;
    
        fetch(url)
            .then(response => response.json())
            .then(data => {
                if (data && data.length > 0) {
                    display12hours(data); 
                } else {
                    weatherDiv.innerHTML = `<p>No weather data available.</p>`;
                }
            })
            .catch(error => {
                console.error("Error fetching 12-hour forecast data:", error);
                weatherDiv.innerHTML = `<p>Error fetching 12-hour forecast data.</p>`;
            });
    }


    function displayWeather(currentConditions) {
        const temperature = currentConditions.Temperature.Metric.Value;
        const weather = currentConditions.WeatherText;
        const weatherContent = `
            <h2 class = "current">Current Weather</h2>
            <p>Temperature: ${temperature}°C</p>
            <p>Weather: ${weather}</p>
            
        `;
        weatherDiv.innerHTML = weatherContent;
    }

    function display5Weather(dailyForecasts) {
        let weatherContent = `
            
            <h2 class = "daily"> 5-Day Weather Forecast</h2>`;
        
        dailyForecasts.forEach(forecast => {
            const date = new Date(forecast.Date).toLocaleDateString(); 
            const temperature = forecast.Temperature.Minimum.Value;
            const weather = forecast.Day.IconPhrase;
            weatherContent += `
                    <h3>${date}</h3>
                    <p>Temperature: ${temperature}°C</p>
                    <p>Weather: ${weather}</p>
            `;
        });
        
        weatherDiv.innerHTML += weatherContent;
    }

    function display12hours(hourlyForecasts) {
        let weatherContent = `
            <h2 class = "hourly"> 12-Hour Weather Forecast</h2>`;
        
        hourlyForecasts.forEach(forecast => {
            const time = new Date(forecast.DateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            const temperature = forecast.Temperature.Value;
            const weather = forecast.IconPhrase;
        
            weatherContent += `
                <div>
                    <h3>${time}</h3>
                    <p>Temperature: ${temperature}°C</p>
                    <p>Weather: ${weather}</p>
                </div>
            `;
        });
        
        weatherDiv.innerHTML += weatherContent;
    }


});
