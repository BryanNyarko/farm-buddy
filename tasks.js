import { auth, db } from './firebase-config.js';
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import {
  collection, query, orderBy, onSnapshot,
  updateDoc, deleteDoc, doc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const taskListEl = document.getElementById('all-tasks-list');
const backBtn = document.getElementById('back-btn');

let currentUser = null;

onAuthStateChanged(auth, (user) => {
  if (!user) {
    window.location.href = 'welcomepage.html';
  } else {
    currentUser = user;
    loadAllTasks();
  }
});

backBtn?.addEventListener('click', () => {
  window.location.href = 'dashboard.html';
});

function loadAllTasks() {
  const q = query(
    collection(db, 'users', currentUser.uid, 'tasks'),
    orderBy('dueAt', 'asc')
  );

  onSnapshot(q, (snapshot) => {
    taskListEl.innerHTML = '';
    snapshot.forEach(docSnap => {
      const task = docSnap.data();
      const isDone = task.status === 'done';
      const style = isDone ? 'style="text-decoration: line-through; color: gray;"' : '';

      const li = document.createElement('li');
      li.innerHTML = `
        <span ${style}>${task.title} — ${task.dueAt?.seconds ? new Date(task.dueAt.seconds * 1000).toLocaleString() : ''}</span>
        <button class="toggle-btn">${isDone ? 'Undo' : 'Done'}</button>
        <button class="edit-btn">Edit</button>
        <button class="delete-btn">Delete</button>
      `;

      // Toggle Done/Undo
      li.querySelector('.toggle-btn').addEventListener('click', async () => {
        await updateDoc(doc(db, 'users', currentUser.uid, 'tasks', docSnap.id), {
          status: isDone ? 'open' : 'done'
        });
      });

      // Edit Task
      li.querySelector('.edit-btn').addEventListener('click', async () => {
        const newTitle = prompt("Update task title:", task.title);
        if (newTitle && newTitle.trim()) {
          await updateDoc(doc(db, 'users', currentUser.uid, 'tasks', docSnap.id), {
            title: newTitle.trim()
          });
        }
      });

      // Delete
      li.querySelector('.delete-btn').addEventListener('click', async () => {
        if (confirm('Delete this task?')) {
          await deleteDoc(doc(db, 'users', currentUser.uid, 'tasks', docSnap.id));
        }
      });

      taskListEl.appendChild(li);
    });
  });
}