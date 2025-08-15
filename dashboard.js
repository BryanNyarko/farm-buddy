// dashboard logic
import { auth } from './firebase-config.js';
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

const greetingEl = document.getElementById('greeting');

onAuthStateChanged(auth, (user) => {
  if (!user) {
    // not logged in -> return to welcome
    window.location.href = 'welcomepage.html';
  } else {
    const name = user.displayName || 'Farmer';
    greetingEl.textContent = `Welcome, ${name}`;
  }
});
