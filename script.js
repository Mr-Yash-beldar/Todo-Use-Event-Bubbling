const todoList = document.getElementById("todo-list");
const todoForm = document.getElementById("todo-form");
const todoTitle = document.getElementById("todo-title");
const todoDesc = document.getElementById("todo-desc");
const todoDate = document.getElementById("todo-date");

//get todos from local storage
let todos = JSON.parse(localStorage.getItem("todos")) || [];

//save todos to local storage
function saveTodos() {
  localStorage.setItem("todos", JSON.stringify(todos));
}

//create div element
function createTodoCard(todo) {
  // console.log(todo);
  const todoCard = document.createElement("div");
  todoCard.className = "todo-card";
  if (todo.status === "done") {
    todoCard.classList.add("done");
  }
  todoCard.id = todo.id;
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
  return todoCard;
}

//ondocument load get todos
function getTodos() {
  todoList.innerHTML = "";
  todos.forEach((todo) => {
    const todoCard = createTodoCard(todo);
    todoList.appendChild(todoCard);
  });
}
document.addEventListener("DOMContentLoaded", getTodos);

//give welcome message
var welcomeTodo = {
  id: 0,
  title: "Welcome to Todo App",
  description: "This with ❤️ by Yashodip Beldar .",
  date: "2021-09-01",
  status: "pending",
};
if (todos.length === 0) {
  const todoCard = createTodoCard(welcomeTodo);
  todos.push(welcomeTodo);
  todoList.appendChild(todoCard);
  saveTodos();
}

//update data
function updateData(id) {
  const todoCard = document.getElementById(id);
  const todoCardTitle = todoCard.querySelector(".todo-card-title");
  const todoCardDesc = todoCard.querySelector(".todo-card-desc");
  const todoCardMeta = todoCard.querySelector(".todo-card-meta");
  todoCardTitle.textContent = todoTitle.value;
  todoCardDesc.textContent = todoDesc.value;
  todoCardMeta.textContent = todoDate.value;
}


let editingId = null;

//submit form
todoForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const title = todoTitle.value.trim();
  const description = todoDesc.value.trim();
  const date = todoDate.value.trim();

  if (title === "" || description === "" || date === "") return;

  if (editingId !== null) {
    const index = todos.findIndex((todo) => todo.id === editingId);
    todos[index] = { id: editingId, title, description, date };
    updateData(editingId);
    editingId = null;
    saveTodos();
  } else {
    const newTodo = {
      id: todos.length > 0 ? todos[todos.length - 1].id + 1 : 1,
      title,
      description,
      date,
      status: "pending",
    };
    todos.push(newTodo);
    const todoCard = createTodoCard(newTodo);
    todoList.appendChild(todoCard);
  }

  saveTodos();
  todoForm.reset();
});


//event bubbling find the target
todoList.addEventListener("click", (e) => {
  const target = e.target;
  const todoCard = target.closest(".todo-card");
  const id = parseInt(todoCard.id);

  if (target.classList.contains("delete")) {
    todos = todos.filter((todo) => todo.id !== id);
    todoCard.remove();
    saveTodos();
  } else if (target.classList.contains("edit")) {
    const todo = todos.find((todo) => todo.id === id);
    editingId = todo.id;
    todoTitle.value = todo.title;
    todoDesc.value = todo.description;
    todoDate.value = todo.date;
  } else if (target.classList.contains("check")) {
    todoCard.classList.toggle("done");
    const todo = todos.find((todo) => todo.id === id);
    todo.status = todo.status === "done" ? "pending" : "done";
    saveTodos();
  }
});


