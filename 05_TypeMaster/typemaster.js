const inputArea = document.getElementById('inputArea');
let data;
let timerStarted = false;

const apiCall = async () => {
  const api = await fetch('https://jsonplaceholder.typicode.com/posts/1');
  data = await api.json();
  console.log(data.body);
  const div = document.createElement('div');
  div.innerText = data.body;
  document.body.appendChild(div);
};
apiCall();

inputArea.addEventListener('input', () => {
  if (!timerStarted) {
    timerStarted = true;

    setTimeout(() => {
      const clean = (str) => str.trim().replace(/\s+/g, ' ');
      console.log('completed 10s');
      const inputValue = inputArea.value;
      if (clean(inputValue) === clean(data.body)) {
        console.log('Good');
      }
      const words = inputValue.trim().split(/\s+/).length;
      const wpm = `${Math.round(words * 6)}`; // <-- fixed here
      const result = document.createElement('p');
      result.innerText = `Your WPM: ${wpm}`;
      document.body.innerHTML = '';
      document.body.appendChild(result);

      document.body.removeChild(inputArea);
    }, 5000);
  }
});
