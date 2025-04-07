// const obj = {
//   name: 'Ankit',
//   greet: function () {
//     setTimeout(() => {
//       console.log('Hello, ' + this.name); // Fix this
//     }, 1000);
//   },
// };

// obj.greet(); // "Hello, Ankit"

// const master = {
//   name: 'master',
// };

// obj.greet.call(master);

// const boundGreet = obj.greet.bind(master);
// boundGreet(); // Output: "Hi Admin"

////////////

const person = {
  name: 'Ankit',
  greet: function () {
    const regular = () => {
      console.log('Regular:', this.name);
    };
    const arrow = () => {
      console.log('Arrow:', this.name);
    };
    regular();
    arrow();
  },
};

person.greet(); // Understand outputs
