function myNew(constructor, ...args) {
  const obj = {};

  Object.setPrototypeOf(obj, constructor.prototype);

  const result = constructor.apply(obj, args);

  return result instanceof Object ? result : obj;
}

function Person(name) {
  this.name = name;
}


const p = myNew(Person, 'Yash');
console.log(p.name);
console.log(p instanceof Person);
