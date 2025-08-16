import { auth, db } from './firebase-config.js';
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import {
  collection, addDoc, serverTimestamp,
  query, orderBy, onSnapshot,
  updateDoc, deleteDoc, doc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const greetingEl  = document.getElementById('greeting');
const logoutBtn   = document.getElementById('logout-btn');
const addTaskForm = document.getElementById('add-task-form');
const taskListEl  = document.getElementById('task-list');

let currentUser = null;

// Auth state listener
onAuthStateChanged(auth, (user) => {
  if (!user) {
    window.location.href = 'welcomepage.html';
  } else {
    currentUser = user;
    greetingEl.textContent = `Welcome, ${user.displayName || 'Farmer'} `;
    loadTasks();
  }
});

// Logout
logoutBtn?.addEventListener('click', async () => {
  try {
    await signOut(auth);
  } catch (err) {
    alert('Logout failed: ' + err.message);
  }
});

// Add Task
addTaskForm?.addEventListener('submit', async (e) => {
  e.preventDefault();

  const title = document.getElementById('task-title').value.trim();
  const date  = document.getElementById('task-date').value;
  const time  = document.getElementById('task-time').value || "08:00";

  if (!title || !date) return;

  const [Y, M, D] = date.split('-').map(Number);
  const [h, m]    = time.split(':').map(Number);
  const dueAt     = new Date(Y, M - 1, D, h, m);

  try {
    await addDoc(collection(db, 'users', currentUser.uid, 'tasks'), {
      title,
      dueAt,
      status: 'open',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    addTaskForm.reset();
  } catch (err) {
    console.error("Error adding task:", err);
  }
});

// Load + Render Tasks
function loadTasks() {
  const q = query(
    collection(db, 'users', currentUser.uid, 'tasks'),
    orderBy('dueAt', 'asc')
  );

  onSnapshot(q, (snapshot) => {
    taskListEl.innerHTML = '';
    snapshot.forEach(docSnap => {
      const task = docSnap.data();
      const li = document.createElement('li');

      // Style completed tasks differently
      const isDone = task.status === 'done';
      const style = isDone ? 'style="text-decoration: line-through; color: gray;"' : '';

      li.innerHTML = `
        <span ${style}>${task.title} — ${task.dueAt?.seconds ? new Date(task.dueAt.seconds * 1000).toLocaleString() : ''}</span>
         ${!isDone ? '<button class="done-btn">Done</button>' : ''}
        <button class="delete-btn">Delete</button>
      `;

      // Mark Done
      li.querySelector('.done-btn')?.addEventListener('click', async () => {
        await updateDoc(doc(db, 'users', currentUser.uid, 'tasks', docSnap.id), {
          status: 'done',
          updatedAt: serverTimestamp()
        });
      });

      // Delete
      li.querySelector('.delete-btn')?.addEventListener('click', async () => {
        if (confirm('Delete this task?')) {
          await deleteDoc(doc(db, 'users', currentUser.uid, 'tasks', docSnap.id));
        }
      });

      taskListEl.appendChild(li);
    });
  });
}