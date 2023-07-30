// Récupération des éléments du DOM
const todoForm = document.querySelector("#todo-form");
const taskInput = document.querySelector("#task");
const todoList = document.querySelector("#todo-list");

// URL de l'API de base
const apiUrl = "http://localhost:5000/todos";

// Fonction fetch des todos de l'API
async function fetchTodos() {
  const response = await fetch(apiUrl);
  const data = await response.json();
  return data;
}

// Function to render the todos
async function renderTodos() {
  todoList.innerHTML = "";

  const todos = await fetchTodos();

  todos.forEach((todo) => {
    const row = document.createElement("tr");

    const taskCell = document.createElement("td");
    taskCell.textContent = todo.task;
    row.appendChild(taskCell);

    const actionsCell = document.createElement("td");

    const editButton = document.createElement("button");
    editButton.textContent = "Modifier";
    editButton.classList.add("btn", "btn-outline-info", "mx-2");
    editButton.addEventListener("click", () => {
      const updatedTask = prompt("Modifier la tâche :", todo.task);
      if (updatedTask !== null && updatedTask.trim() !== "") {
        updateTodo(todo.id, { task: updatedTask });
      }
    });
    actionsCell.appendChild(editButton);

    const completeButton = document.createElement("button");
    completeButton.textContent = "Terminée";
    completeButton.classList.add("btn", "btn-outline-success", "mx-2");
    completeButton.addEventListener("click", () => {
      updateTodo(todo.id, { completed: true });
    });
    actionsCell.appendChild(completeButton);

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Supprimer";
    deleteButton.classList.add("btn", "btn-outline-danger", "mx-2");
    deleteButton.addEventListener("click", () => {
      deleteTodo(todo.id);
    });
    actionsCell.appendChild(deleteButton);

    row.appendChild(actionsCell);
    todoList.appendChild(row);
  });
}

// Function to add a new todo
async function addTodo(task) {
  const response = await fetch(apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ task, completed: false }),
  });

  if (response.ok) {
    renderTodos();
  }
}

// Function to update a todo
async function updateTodo(id, data) {
  const response = await fetch(`${apiUrl}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (response.ok) {
    renderTodos();
  }
}

// Function to delete a todo
async function deleteTodo(id) {
  const response = await fetch(`${apiUrl}/${id}`, {
    method: "DELETE",
  });

  if (response.ok) {
    renderTodos();
  }
  confirm("êtes-vous sûr de vouloir supprimer cette tâtche ?");
}

// Event listener for the form submission
todoForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const task = taskInput.value.trim();
  if (task !== "") {
    addTodo(task);
    taskInput.value = "";
  }
});

// Initial rendering of the todos
renderTodos();
