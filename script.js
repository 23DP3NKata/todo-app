const form = document.getElementById('taskForm');
const tasksDiv = document.getElementById('tasks');

const apiUrl = 'http://localhost:5000/tasks';

async function loadTasks() {
  const res = await fetch(apiUrl);
  const tasks = await res.json();
  tasksDiv.innerHTML = '';
  tasks.forEach(task => {
    const div = document.createElement('div');
    div.className = 'task' + (task.status === 'completed' ? ' completed' : '');
    div.innerHTML = `
      <h3>${task.title}</h3>
      <p>${task.description}</p>
      <p>Status: ${task.status}</p>
      <button onclick="toggleStatus('${task._id}', '${task.status}')">Toggle Status</button>
      <button onclick="deleteTask('${task._id}')">Delete</button>
    `;
    tasksDiv.appendChild(div);
  });
}

async function toggleStatus(id, currentStatus) {
  const newStatus = currentStatus === 'completed' ? 'pending' : 'completed';
  await fetch(`${apiUrl}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status: newStatus })
  });
  loadTasks();
}

async function deleteTask(id) {
  await fetch(`${apiUrl}/${id}`, { method: 'DELETE' });
  loadTasks();
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const title = document.getElementById('title').value;
  const description = document.getElementById('description').value;

  await fetch(apiUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, description })
  });

  form.reset();
  loadTasks();
});

loadTasks();
