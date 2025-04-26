const api_key = '412ed85fbca88ae4d73cb4b563b1bd93';
const city = document.getElementById('city');

const weatherBtn = document.getElementById('weather');

weatherBtn.addEventListener('click', async () => {
  const cityValue = city.value;
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${cityValue}&appid=${api_key}`;
  console.log(cityValue);

  const response = await fetch(url);
  const data = await response.json();
  //   console.log(data.main.temp);
  const div = document.createElement('div');
  div.innerText = ` ${cityValue} temp is ${Math.floor(
    data.main.temp - 273.15
  )}  °C`;
  document.body.appendChild(div);
});
