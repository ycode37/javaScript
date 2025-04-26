const inputArea = document.getElementById('input');
const addBtn = document.getElementById('add');
const list = document.getElementById('list');

const loadData = () => {
  const items = JSON.parse(localStorage.getItem('items')) || [];
  // Add each item from localStorage to the list
  items.forEach((item) => {
    const li = document.createElement('li');
    const deleteBtn = document.createElement('button');
    li.textContent = item;
    deleteBtn.textContent = 'Delete';
    list.appendChild(li);
    li.appendChild(deleteBtn);

    deleteBtn.addEventListener('click', () => {
      li.remove();
      saveData();
    });
  });
};

const saveData = () => {
  const items = [];
  list.querySelectorAll('li').forEach((li) => {
    items.push(li.firstChild.textContent);
  });
  localStorage.setItem('items', JSON.stringify(items));
};

const addItem = () => {
  if (inputArea.value.trim() !== '') {
    const li = document.createElement('li');
    const deleteBtn = document.createElement('button');
    li.textContent = inputArea.value;
    deleteBtn.textContent = 'Delete';
    list.appendChild(li);
    li.appendChild(deleteBtn);
    inputArea.value = '';

    deleteBtn.addEventListener('click', () => {
      li.remove();
    });
    saveData();
  }
  saveData();
};

addBtn.addEventListener('click', addItem);

loadData();
