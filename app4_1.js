document.addEventListener('DOMContentLoaded', function() {
  loadTodos();
  document.getElementById('todo-input').addEventListener('keypress', function(e) {
      if (e.key === 'Enter') {
          addTodo();
      }
  });
});

function loadTodos() {
  const todos = JSON.parse(localStorage.getItem('todos')) || [];
  todos.forEach(todo => {
      addTodoItem(todo.id, todo.value);
  });
}

function saveTodos() {
  const todos = [];
  document.querySelectorAll('#todo-list li').forEach(li => {
      const id = li.getAttribute('data-id');
      const value = li.querySelector('span').textContent;
      todos.push({ id, value });
  });
  localStorage.setItem('todos', JSON.stringify(todos));
}

function addTodo() {
  const todoInput = document.getElementById('todo-input');
  const todoValue = todoInput.value.trim();
  if (todoValue) {
      addTodoItem(Date.now().toString(), todoValue);
      todoInput.value = '';
      saveTodos();
  }
}

function addTodoItem(id, value) {
  const li = document.createElement('li');
  li.setAttribute('data-id', id);

  const textSpan = document.createElement('span');
  textSpan.textContent = value;
  li.appendChild(textSpan);

  const buttonContainer = document.createElement('div');
  buttonContainer.classList.add('button-container');

  const editButton = createEditButton(li, textSpan);
  buttonContainer.appendChild(editButton);

  const deleteButton = createDeleteButton(li);
  buttonContainer.appendChild(deleteButton);

  li.appendChild(buttonContainer);
  document.getElementById('todo-list').appendChild(li);
}

function createEditButton(li, textSpan) {
  const editButton = document.createElement('button');
  editButton.textContent = '수정';
  editButton.addEventListener('click', function() {
      handleEditButtonClick(li, textSpan, editButton);
  });
  return editButton;
}

function handleEditButtonClick(li, textSpan, editButton) {
  const input = document.createElement('input');
  input.type = 'text';
  input.value = textSpan.textContent;
  li.insertBefore(input, textSpan);
  li.removeChild(textSpan);
  editButton.textContent = '저장';

  input.focus();

  input.addEventListener('blur', function() {
      updateTodoItem(input, textSpan, li, editButton);
  });

  input.addEventListener('keypress', function(e) {
      if (e.key === 'Enter') {
          updateTodoItem(input, textSpan, li, editButton);
      }
  });
}

function createDeleteButton(li) {
  const deleteButton = document.createElement('button');
  deleteButton.textContent = '삭제';
  deleteButton.addEventListener('click', function() {
      li.remove();
      saveTodos();
  });
  return deleteButton;
}

function updateTodoItem(input, textSpan, li, editButton) {
  textSpan.textContent = input.value;
  li.insertBefore(textSpan, input);
  li.removeChild(input);
  editButton.textContent = '수정';
  saveTodos();
}

document.getElementById('new-todo').addEventListener('click', function() {
  addEditableTodoItem();
});

function addEditableTodoItem() {
  const li = document.createElement('li');
  const input = document.createElement('input');
  input.type = 'text';
  li.appendChild(input);

  const todoList = document.getElementById('todo-list');
  todoList.insertBefore(li, todoList.firstChild);

  input.focus();

  input.addEventListener('keypress', function(e) {
      if (e.key === 'Enter' && input.value.trim() !== '') {
          addTodoItem(Date.now().toString(), input.value.trim());
          li.remove();
      }
  });
}