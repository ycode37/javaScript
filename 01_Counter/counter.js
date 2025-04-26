const inc = document.getElementById('increment');
const dec = document.getElementById('decrement');
const display = document.getElementById('memo');
let num = 0;

//My code
// display.innerText = num;
// inc.addEventListener('click', () => {
//   num++;
//   display.innerText = num;
// });
// dec.addEventListener('click', () => {
//   num--;
//   display.innerText = num;
// });

// optimized

const updateDisplay = () => {
  display.textContent = num;
};

updateDisplay();

function handleClick(e) {
  if (e.currentTarget === inc) {
    num++;
  } else if (e.currentTarget === dec) {
    num--;
  }
  updateDisplay();
}

// Add event listeners
inc.addEventListener('click', handleClick);
dec.addEventListener('click', handleClick);
