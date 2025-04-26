const changeBtn = document.getElementById('change');

const arrcolor = ['red', 'blue', 'yellow', 'green'];

const randomColor = () => {
  const randomIndex = Math.floor(Math.random() * arrcolor.length);
  return arrcolor[randomIndex];
};

changeBtn.addEventListener('click', () => {
  document.body.style.backgroundColor = randomColor();
});
