import { auth, db } from './firebase-config.js';
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import {
  doc, setDoc, getDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const backBtn = document.getElementById('back-btn');
const profileForm = document.getElementById('profile-form');
const nameInput = document.getElementById('profile-name');
const locationInput = document.getElementById('profile-location');

let currentUser = null;

onAuthStateChanged(auth, async (user) => {
  if (!user) {
    window.location.href = 'welcomepage.html';
  } else {
    currentUser = user;
    await loadProfile();
  }
});

backBtn?.addEventListener('click', () => {
  window.location.href = 'dashboard.html';
});

// Load profile data if exists
async function loadProfile() {
  const ref = doc(db, 'users', currentUser.uid);
  const snap = await getDoc(ref);
  if (snap.exists()) {
    const data = snap.data();
    nameInput.value = data.name || '';
    locationInput.value = data.location || '';
  }
}

// Save profile
profileForm?.addEventListener('submit', async (e) => {
  e.preventDefault();
  try {
    await setDoc(doc(db, 'users', currentUser.uid), {
      name: nameInput.value.trim(),
      location: locationInput.value.trim()
    }, { merge: true });
    alert("Profile saved!");
  } catch (err) {
    console.error("Error saving profile:", err);
  }
});