import { auth } from './firebase-config.js';
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

const greetingEl = document.getElementById('greeting');
const logoutBtn  = document.getElementById('logout-btn');

onAuthStateChanged(auth, (user) => {
  if (!user) {
    window.location.href = 'welcomepage.html';
  } else {
    greetingEl.textContent = Welcome, ${user.displayName || 'Farmer'};
  }
});

logoutBtn?.addEventListener('click', async () => {
  try {
    await signOut(auth);       // triggers onAuthStateChanged → redirect happens there
  } catch (err) {
    alert('Logout failed: ' + err.message);
  }
});