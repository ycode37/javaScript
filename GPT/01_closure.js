// function createCounter() {
//   // your code here
//   let count = 1;
//   return function () {
//     return count++;
//   };
// }

// const counter1 = createCounter();
// console.log(counter1()); // 1
// console.log(counter1()); // 2
// const counter2 = createCounter();
// console.log(counter2()); // 1

// function secretHolder(secret) {
//   let mySecret = secret;
//   return {
//     getSecret: function () {
//       return mySecret;
//     },
//     setSecret: function (para) {
//       mySecret = para;
//     },
//   };
// }

// const obj = secretHolder('JS Rocks');
// console.log(obj.getSecret()); // "JS Rocks"
// obj.setSecret('Closures are 🔥');
// console.log(obj.getSecret()); // "Closures are 🔥"

// closure mai kya ho rha hian ki ek outer variable ko hum andar access and manioualte kr sakte hain

// Debounce

function debounce(fn, delay) {
  let timer;

  return function (...args) {
    clearTimeout(timer);

    timer = setTimeout(() => {
      fn(this, args);
    }, delay);
  };
}
let counter = 0;

const debounced = debounce(() => {
  counter++;
  console.log('Debounced count:', counter);
}, 1000);

debounced();
debounced();
debounced();
debounced();
setTimeout(debounced, 6000);
