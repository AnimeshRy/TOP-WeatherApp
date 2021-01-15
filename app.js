let form = document.querySelector('form');

const API =
  'http://api.weatherapi.com/v1/forecast.json?key=1986480656ec490d950204923202611&q=';

form.addEventListener('submit', (e) => {
  e.preventDefault();
  fetchformWeather().catch((err) => {
    alert('No Such Location');
    reset();
  });
});

String.prototype.capitalize = function () {
  return this.charAt(0).toUpperCase() + this.slice(1);
};

async function fetchformWeather() {
  let formInput = document.querySelector('input[type="text"]');
  let location = formInput.value;
  if (location === '') return;
  try {
    const response = await fetch(API + location, { mode: 'cors' });
    const weatherData = await response.json();
    const newData = processData(weatherData);
    displayWeather(newData);
  } catch (error) {
    console.log('Something might be wrong with the API ?');
  }
  reset();
}

async function fetchlocationWeather(lat, long) {
  try {
    const response = await fetch(API + lat + ',' + long, { mode: 'cors' });
    const weatherData = await response.json();
    const newData = processData(weatherData);
    displayWeather(newData);
  } catch (error) {
    console.log('Something might be wrong with the API ?');
  }

  // console.log(weatherData);
}

function processData(data) {
  let myData = {
    region: data.location.region.capitalize(),
    country: data.location.country,
    description: data.current.condition.text,
    iconUrl: data.current.condition.icon,
    feelsLike: {
      f: Math.round(data.current.feelslike_f),
      c: Math.round(data.current.feelslike_c),
    },
    currentTemp: {
      f: Math.round(data.current.temp_f),
      c: Math.round(data.current.temp_c),
    },
    humidity: data.current.humidity,
  };
  return myData;
}

function displayWeather(data) {
  let locationInfo = document.querySelector('.location-timezone');
  let description = document.querySelector('.temperature-description');
  let locationDiv = document.querySelector('.location');
  let pIcon = document.querySelector('.icon-p');
  let degreeSection = document.querySelector('.degree-section');
  let temp = degreeSection.querySelector('.temperature-degree');
  if (pIcon) pIcon.remove();
  let img = document.querySelector('img');
  if (!img) {
    let imgIcon = document.createElement('img');
    imgIcon.classList.add('img-icon');
    if (data.iconUrl) {
      imgIcon.src = `https:${data.iconUrl}`;
      locationDiv.append(imgIcon);
    } else {
      imgIcon.src = './img/load.png';
      locationDiv.append(imgIcon);
    }
  } else {
    img.remove();
    let imgIcon = document.createElement('img');
    imgIcon.classList.add('img-icon');
    if (data.iconUrl) {
      imgIcon.src = `https:${data.iconUrl}`;
      locationDiv.append(imgIcon);
    } else {
      imgIcon.src = './img/load.png';
      locationDiv.append(imgIcon);
    }
  }

  temp.innerText = data.currentTemp.c;
  description.innerText = `${data.description}`;
  locationInfo.innerText = data.region + ', ' + data.country;
}

window.addEventListener('load', () => {
  let lat;
  let long;

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((position) => {
      lat = position.coords.latitude;
      long = position.coords.longitude;
      fetchlocationWeather(lat, long).catch((err) => {
        console.log(err);
      });
    });
  }
});

function reset() {
  form.reset();
}
