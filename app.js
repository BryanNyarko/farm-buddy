// welcome screen & auth logic
import { auth, db } from './firebase-config.js';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  updateProfile
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import {
  doc,
  setDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// get elements
const welcomeContainer = document.querySelector('.welcome-container');
const signinScreen = document.getElementById('signin-screen');
const signupScreen = document.getElementById('signup-screen');

const goSignin = document.getElementById('go-signin');
const goSignup = document.getElementById('go-signup');

// redirect if already logged in
onAuthStateChanged(auth, (user) => {
  if (user) {
    window.location.href = 'dashboard.html';
  }
});

// show signIn
goSignin?.addEventListener('click', () => {
  welcomeContainer.style.display = 'none';
  signupScreen.style.display = 'none';
  signinScreen.style.display = 'block';
});

// show signUp
goSignup?.addEventListener('click', () => {
  welcomeContainer.style.display = 'none';
  signupScreen.style.display = 'block';
  signinScreen.style.display = 'none';
});

// signup
const signupForm = document.getElementById('signup-form');
signupForm?.addEventListener('submit', async (e) => {
  e.preventDefault();

  const name = document.getElementById('signup-name').value.trim();
  const email = document.getElementById('signup-email').value.trim();
  const password = document.getElementById('signup-password').value;
  const confirmPassword = document.getElementById('signup-cpassword').value;

  if (password !== confirmPassword) {
    alert("Passwords do not match!");
    return;
  }

  try {
    const cred = await createUserWithEmailAndPassword(auth, email, password);

    // save name on auth profile
    await updateProfile(cred.user, { displayName: name });

    // save extra data in Firestore
    await setDoc(doc(db, 'users', cred.user.uid), {
      name,
      email,
      createdAt: serverTimestamp()
    });

    // go to dashboard
    window.location.href = 'dashboard.html';
  } catch (error) {
    alert("Signup error: " + error.message);
  }
});

// signin
const signinForm = document.getElementById('signin-form');
signinForm?.addEventListener('submit', async (e) => {
  e.preventDefault();

  const email = document.getElementById('signin-email').value.trim();
  const password = document.getElementById('signin-password').value;

  try {
    await signInWithEmailAndPassword(auth, email, password);
    // go to dashboard
    window.location.href = 'dashboard.html';
  } catch (error) {
    alert("Failed to sign in: " + error.message);
  }
});

// return to welcome page
window.goBack = function () {
  signinScreen.style.display = 'none';
  signupScreen.style.display = 'none';
  welcomeContainer.style.display = 'block';
};
