const locationInput = document.getElementById('locationInput');
const suggestionsDiv = document.getElementById('autocomplete-suggestions');

locationInput.addEventListener('input', function () {
    const query = locationInput.value;

    // Realizar una solicitud a la API de OpenCage Data
    fetch(`https://api.opencagedata.com/geocode/v1/json?q=${query}&key=d55b86b23dea4fe7b677707da699cffa`)
        .then(response => response.json())
        .then(data => {
            suggestionsDiv.innerHTML = ''; // Limpiar sugerencias anteriores

            data.results.forEach(result => {
                const suggestion = document.createElement('div');
                suggestion.textContent = result.formatted;
                suggestion.addEventListener('click', function () {
                    locationInput.value = result.formatted;
                    suggestionsDiv.innerHTML = ''; // Limpiar sugerencias después de la selección
                });
                suggestionsDiv.appendChild(suggestion);
            });
        })
        .catch(error => {
            console.log(error);
        });
});


function geocodeLocation() {
    const location = document.getElementById('locationInput').value;
    const nominatimEndpoint = 'https://nominatim.openstreetmap.org/search';
    const format = 'json';
    const limit = 1; // Limit the results to 1

    const apiUrl = `${nominatimEndpoint}?q=${location}&format=${format}&limit=${limit}`;

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            if (data.length > 0) {
                const latitude = data[0].lat;
                const longitude = data[0].lon;
                getWeather(latitude, longitude);
            } else {
                console.log('La geocodificación no fue exitosa. Por favor, ingresa una ubicación válida.');
            }
        })
        .catch(error => {
            console.log(error);
        });
}

// El resto del código para obtener el pronóstico del tiempo y mostrarlo sigue siendo el mismo que se mencionó anteriormente.

function getWeather(latitude, longitude) {
    const apiKey = 'ecee476a8c0ea406a61cfcc69223a116';

    // Realizar una solicitud a la API de OpenWeatherMap con unidades métricas
    fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&cnt=40&units=metric&appid=${apiKey}`)
        .then(response => response.json())
        .then(data => {
            //Llama para obtener los datos del clima
            const ciudad = data.city.name;
            const temperatura = data.list[0].main.temp;
            const tempMin = data.list[0].main.temp_min;
            const tempMax = data.list[0].main.temp_max;
            const humidity = data.list[0].main.humidity;

            let temp_min = document.getElementById('min-temp');
            temp_min.innerHTML = tempMin + " °C";
            let temp_max = document.getElementById('max-temp');
            temp_max.innerHTML = tempMax + " °C";
            let temp_actual = document.getElementById('temp');
            temp_actual.innerHTML = temperatura + " °C";
            let humedad = document.getElementById('humidity');
            humedad.innerHTML = humidity + "%";
            let estado = document.getElementById('state');
            estado.innerHTML = ciudad;


            displayWeather(data.list);
        })
        .catch(error => {
            console.log(error);
        });
}

function displayWeather(dataList) {
    const weatherInfo = document.getElementById('weatherInfo');
    weatherInfo.innerHTML = ''; // Limpiar cualquier información anterior

    // Procesar los datos y mostrar el pronóstico del tiempo para 5 días con datos cada 3 horas
    let currentDate = null;
    let dayCount = 0;
    let cajaDia = null;
    for (const item of dataList) {
        const date = new Date(item.dt * 1000);
        const temperature = item.main.temp;
        const description = item.weather[0].description;

        // Verificar si es un nuevo día
        if (currentDate === null || date.getDate() !== currentDate.getDate()) {
            currentDate = date;
            dayCount++;

            if (dayCount >= 6) {

                break; // Mostramos solo 5 días
            }

            //div que contiene el dia y la temperatura cada 3hs

            cajaDia = document.createElement('div');
            cajaDia.id = 'contenedor-clima-dia';
            cajaDia.className = 'col';
            weatherInfo.appendChild(cajaDia);

            const dayInfo = document.createElement('div');
            dayInfo.classList = 'col h5';
            dayInfo.innerHTML = `${date.toDateString()}`;
            cajaDia.appendChild(dayInfo);
        }

        const timeInfo = document.createElement('div');
        timeInfo.id = 'contenedor-hora';
        timeInfo.innerHTML = `${date.toLocaleTimeString()} - ${description}, ${temperature}°C`;
        cajaDia.appendChild(timeInfo);
    }
/*
    // Mostrar el icono basado en la condición climática
    const weatherIcon = document.getElementById('icon-temp-act');
    if (descrip.includes('rain')) {
        weatherIcon.className = 'bi bi-cloud-rain'; // Clase CSS de Bootstrap para el icono de lluvia
    } else if (descrip.includes('clouds')) {
        weatherIcon.className = 'bi bi-cloud'; // Clase CSS de Bootstrap para el icono de nube
    } else {
        // En caso de cualquier otra condición, puedes proporcionar una clase predeterminada de Bootstrap
        weatherIcon.className = 'bi bi-question'; // Clase predeterminada de Bootstrap
    }
    */
}



