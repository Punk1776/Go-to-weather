const apiKey = "6a4de1bc67dd3d399d3adb7c7d609786";
const apiURL = "https://api.openweathermap.org/data/2.5/weather?units=imperial&q=";
const forecastApiURL = "https://api.openweathermap.org/data/2.5/forecast?units=imperial&q=";
const userSearch = document.querySelector(".search input");
const userSearchBtn = document.querySelector(".search button");

// Initialize an array to store last searched cities
let lastSearchedCities = [];

// Retrieve last searched cities from local storage and populate the array
const storedCities = localStorage.getItem("lastSearchedCities");
if (storedCities) {
    lastSearchedCities = JSON.parse(storedCities);
    updateSelectableList();
}

userSearchBtn.addEventListener("click", () => {
    const city = userSearch.value;
    checkWeather(city);
    getWeather(city);

    // Store the searched city in the array and local storage
    lastSearchedCities.unshift(city); 
    if (lastSearchedCities.length > 3) {
        lastSearchedCities.pop(); // Remove the oldest city if the array size exceeds 3
    }
    localStorage.setItem("lastSearchedCities", JSON.stringify(lastSearchedCities));

    // Update displayed city
    document.querySelector(".city").innerHTML = city;
    userSearch.value = ""; 

    // Update selectable list
    updateSelectableList();
});
//updates info
document.addEventListener("click", function (event) {
    if (event.target.classList.contains("city-item")) {
        const clickedCity = event.target.textContent;
        userSearch.value = clickedCity; 
        checkWeather(clickedCity); 
        getWeather(clickedCity); 
        document.querySelector(".city").innerHTML = clickedCity; 
    }
});

async function checkWeather(city){
    const response = await fetch(apiURL + city +`&appid=${apiKey}`);
    var data = await response.json();

    document.querySelector(".city").innerHTML = data.name;
    document.querySelector(".temp").innerHTML = Math.round(data.main.temp) + "°F";
    document.querySelector(".humidity").innerHTML = data.main.humidity + "%";
    document.querySelector(".wind").innerHTML = data.wind.speed + " mph";
    document.querySelector(".weather").style.display = "block";
}

function getWeather(city) {
    var apiUrl = "https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&units=imperial&appid=" + apiKey;

    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Network response was not ok: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            var forecast = data.list;
            var forecastHtml = "";

            for (var i = 0; i < forecast.length; i += 8) {
                var date = new Date(forecast[i].dt * 1000);
                var day = date.toLocaleDateString("en-US", { weekday: 'long' });
                var temp = forecast[i].main.temp_max;

                forecastHtml += "<p>" + day + ": " + temp + "°F</p>";
            }

            document.getElementById("forecast").innerHTML = forecastHtml;
        })
        .catch(error => {
            console.error("Error fetching forecast:", error);
        });
}
function updateSelectableList() {
    const selectableList = document.getElementById("selectable1");
    selectableList.innerHTML = ""; // Clear the list

    lastSearchedCities.forEach(city => {
        const selectableItem = document.createElement("li");
        selectableItem.classList.add("ui-widget-content", "city-item");
        selectableItem.textContent = city;
        selectableList.appendChild(selectableItem);
    });
}
        
