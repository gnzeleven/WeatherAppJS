const api = {
    key: 'your_key',
    baseurl: "https://api.openweathermap.org/data/2.5/"
}

window.addEventListener("load", getResults('chicago'));

const searchBox = document.getElementById("search-box");
searchBox.addEventListener("keypress", (e) => {
    if (e.keyCode == 13) {
        getResults(searchBox.value);
    }
});

function getResults (query) {
    fetch(`${api.baseurl}weather?q=${query}&units=metric&APPID=${api.key}`)
        .then(response => {
            return response.json();
        }).then(displayResults);
}

function displayResults (weather) {
    console.log(weather);
    const city = document.getElementById('location-h1');
    city.innerText = `${weather.name}, ${weather.sys.country}`;

    const offset = weather.timezone;
    console.log(offset);
    const updateDate = updateDateTime(offset);

    const date = document.getElementById('date-p');
    date.innerText = dateBuilder(updateDate);

    const time = document.getElementById('time-p');
    time.innerText = timeBuilder(updateDate);

    const temperature = document.getElementById('temperature-degree');
    let celsius = Math.round(weather.main.temp);
    temperature.innerText = celsius + '°';

    let farenheit = Math.round((celsius * (9/5)) + 32);

    const desc = document.getElementById('temperature-desc');
    desc.innerText = weather.weather[0].description;

    const icon = document.getElementById('icon');
    icon.src = 'http://openweathermap.org/img/wn/' + weather.weather[0].icon + '.png';

    const celsiusOrFarenheit = document.querySelector('.degree-section span')
    celsiusOrFarenheit.addEventListener('click', () => {
        if (celsiusOrFarenheit.innerText === 'C') {
            celsiusOrFarenheit.innerText = 'F';
            temperature.innerText = farenheit + '°';
        } else {
            celsiusOrFarenheit.innerText = 'C';
            temperature.innerText = celsius + '°';
        }
    })
}

function updateDateTime(offset) {
    const d = new Date();
    const utc = d.getTime() + (d.getTimezoneOffset() * 60000);
    const nd = new Date(utc + (1000 * offset));
    return nd;
}

function dateBuilder(d) {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    const day = days[d.getDay()];
    const date = d.getDate();
    const month = months[d.getMonth()];
    const year = d.getFullYear();

    return `${day} - ${month} ${date}, ${year}`;
}

function timeBuilder(dateObj) {
    const d = dateObj.toLocaleTimeString().split(':');
    const hours = d[0];
    const minutes = d[1];
    const ampm = d[2].slice(-2);
    return `${hours}:${minutes} ${ampm}`;
}
