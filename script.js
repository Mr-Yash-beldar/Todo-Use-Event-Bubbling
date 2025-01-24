const todoList = document.getElementById("todo-list");
const todoForm = document.getElementById("todo-form");
const todoTitle = document.getElementById("todo-title");
const todoDesc = document.getElementById("todo-desc");
const todoDate = document.getElementById("todo-date");

const welcomeTodo = {
  id: 0,
  title: "Welcome to Todo App",
  description: "This with ❤️ by Yashodip Beldar .",
  date: "2021-09-01",
  status: "pending",
};
let todos = JSON.parse(localStorage.getItem("todos")) || [];
if (todos.length === 0) {
  todos.push(welcomeTodo);
  saveTodos();
}
let editingId = null;

function getTodos(filteredTodos = todos) {
  todoList.innerHTML = "";
  filteredTodos.forEach((todo) => {
    const todoCard = document.createElement("div");
    todoCard.className = "todo-card";
    if (todo.status == "done") {
      todoCard.classList.add("done");
    }
    todoCard.dataset.id = todo.id;
    todoCard.innerHTML = `
        <div class="todo-card-header">
          <span class="todo-card-title">${todo.title}</span>
          <div class="todo-card-buttons">
            <button class="edit">Edit</button>
            <button class="delete">Delete</button>
            <button class="check">Done</button>
          </div>
        </div>
        <div class="todo-card-desc">${todo.description}</div>
        <div class="todo-card-meta">
          <span>Date: ${todo.date}</span>
        </div>
      `;
    todoList.appendChild(todoCard);
  });
}

function saveTodos() {
  localStorage.setItem("todos", JSON.stringify(todos));
}

todoForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const title = todoTitle.value.trim();
  const description = todoDesc.value.trim();
  const date = todoDate.value.trim();

  if (title === "" || description === "" || date === "") return;

  if (editingId !== null) {
    const index = todos.findIndex((todo) => todo.id === editingId);
    todos[index] = { id: editingId, title, description, date };
    editingId = null;
  } else {
    const newTodo = {
      id: todos.length + 1,
      title,
      description,
      date,
      status: "pending",
    };
    todos.push(newTodo);
  }

  saveTodos();
  getTodos();
  todoForm.reset();
});

todoList.addEventListener("click", (e) => {
  const target = e.target;
  console.log(target);
  const todoCard = target.closest(".todo-card");
  const id = parseInt(todoCard.dataset.id);

  if (target.classList.contains("delete")) {
    todos = todos.filter((todo) => todo.id !== id);
    saveTodos();
    getTodos();
  } else if (target.classList.contains("edit")) {
    const todo = todos.find((todo) => todo.id === id);
    editingId = id;
    todoTitle.value = todo.title;
    todoDesc.value = todo.description;
    todoDate.value = todo.date;
    saveTodos();
  } else if (target.classList.contains("check")) {
    const todo = todos.find((todo) => todo.id === id);
    todo.status = todo.status == "done" ? "pending" : "done";
    saveTodos();
    getTodos();
  }
});

getTodos();
