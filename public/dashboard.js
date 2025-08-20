import { auth, db } from './firebase-config.js';
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import {
  collection, addDoc, serverTimestamp,
  query, orderBy, onSnapshot, limit,  
  updateDoc, deleteDoc, doc, getDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const greetingEl  = document.getElementById('greeting');
const logoutBtn   = document.getElementById('logout-btn');
const addTaskForm = document.getElementById('add-task-form');
const taskListEl  = document.getElementById('task-list');
const weatherInfo = document.getElementById('weather-info');

let currentUser = null;

// Auth state listener
onAuthStateChanged(auth, async (user) => {
  if (!user) {
    window.location.href = 'index.html';
  } else {
    currentUser = user;
    greetingEl.textContent = `Welcome, ${user.displayName || 'Farmer'}`;
    loadTasks();
63
    // Load profile to fetch weather
    const profileRef = doc(db, 'users', user.uid);
    const profileSnap = await getDoc(profileRef);
    if (profileSnap.exists()) {
      const profile = profileSnap.data();
      if (profile.location) {
        loadWeather(profile.location);
      } else {
        weatherInfo.textContent = "Set location in profile.";
      }
    }
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
  orderBy('dueAt', 'asc'),
  limit(3)  
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

// Load Weather
async function loadWeather(location) {
  const apiKey = "5d7bd7d69480c899375bcdbaca67ffba"; 
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(location)}&units=metric&appid=${apiKey}`
    );
    const data = await response.json();

    if (data.cod === 200) {
      const temp = Math.round(data.main.temp);
      const condition = data.weather[0].main;
      weatherInfo.textContent =` ${temp}°C — ${condition};`
    } else {
      weatherInfo.textContent = "Weather not found.";
    }
  } catch (err) {
    weatherInfo.textContent = "Error loading weather.";
    console.error(err);
  }
}