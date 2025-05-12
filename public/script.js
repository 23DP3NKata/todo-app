const signupForm = document.getElementById("signupForm");
const loginForm = document.getElementById("loginForm");
const logoutButton = document.getElementById("logoutButton");
const taskForm = document.getElementById("taskForm");
const tasksDiv = document.getElementById("tasks");

const API_URL = "http://localhost:5000";

// Registration
signupForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const username = document.getElementById("signupUsername").value;
  const password = document.getElementById("signupPassword").value;

  const res = await fetch(`${API_URL}/auth/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });

  if (res.ok) {
    alert("Registration successful! Please log in.");
    signupForm.reset();
  } else {
    const data = await res.json();
    alert(data.message || "Registration failed.");
  }
});

// Login
loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const username = document.getElementById("loginUsername").value;
  const password = document.getElementById("loginPassword").value;

  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });

  if (res.ok) {
    const data = await res.json();
    localStorage.setItem("token", data.token);
    alert("Login successful!");
    loginForm.style.display = "none";
    signupForm.style.display = "none";
    logoutButton.style.display = "block";
    taskForm.style.display = "block";
    loadTasks();
  } else {
    const data = await res.json();
    alert(data.message || "Login failed.");
  }
});

// Logout
logoutButton.addEventListener("click", () => {
  localStorage.removeItem("token");
  alert("Logged out!");
  loginForm.style.display = "block";
  signupForm.style.display = "block";
  logoutButton.style.display = "none";
  taskForm.style.display = "none";
  tasksDiv.innerHTML = "";
});

// Load tasks
async function loadTasks() {
  const token = localStorage.getItem("token");
  const res = await fetch(`${API_URL}/tasks`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (res.ok) {
    const tasks = await res.json();
    tasksDiv.innerHTML = "";
    tasks.forEach((task) => {
      const div = document.createElement("div");
      div.innerHTML = `
        <h3>${task.title}</h3>
        <p>${task.description}</p>
        <p>Status: ${task.status}</p>
        <button onclick="deleteTask('${task._id}')">Delete</button>
      `;
      tasksDiv.appendChild(div);
    });
  } else {
    alert("Failed to load tasks.");
  }
}

// Add a task
taskForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const title = document.getElementById("title").value;
  const description = document.getElementById("description").value;
  const token = localStorage.getItem("token");

  const res = await fetch(`${API_URL}/tasks`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ title, description }),
  });

  if (res.ok) {
    taskForm.reset();
    loadTasks();
  } else {
    alert("Failed to add task.");
  }
});

// Delete a task
async function deleteTask(id) {
  const token = localStorage.getItem("token");

  const res = await fetch(`${API_URL}/tasks/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });

  if (res.ok) {
    loadTasks();
  } else {
    alert("Failed to delete task.");
  }
}
