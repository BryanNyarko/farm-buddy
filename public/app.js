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
  document.getElementById("welcome-header").innerHTML="Sign In";
});

// show signUp
goSignup?.addEventListener('click', () => {
  document.getElementById("welcome-header").innerHTML="Sign Up";
  welcomeContainer.style.display = 'none';
  signupScreen.style.display = 'block';
  signinScreen.style.display = 'none';
  
});

// signup

const signupForm = document.getElementById("signup-form");

signupForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = document.getElementById("signup-name").value;
  const email = document.getElementById("signup-email").value;
  const password = document.getElementById("signup-password").value;
  const cpassword = document.getElementById("signup-cpassword").value;
  const location = document.getElementById("signup-location").value;

  if (password !== cpassword) {
    alert("Passwords do not match!");
    return;
  }

  try {
    const userCred = await createUserWithEmailAndPassword(auth, email, password);

    // Set display name
    await updateProfile(userCred.user, { displayName: name });

    // Save extra info to Firestore
    await setDoc(doc(db, "users", userCred.user.uid), {
      name: name,
      email: email,
      location: location
    });

    alert("Signup successful!");
    window.location.href = "dashboard.html";
  } catch (err) {
    console.error(err);
    alert(err.message);
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

// return to signin
window.goToSignInPage = function () {
  signinScreen.style.display = 'block';
  signupScreen.style.display = 'none';
  welcomeContainer.style.display = 'none';
};

window.goToSignUpPage = function () {
  signinScreen.style.display = 'none';
  signupScreen.style.display = 'block';
  welcomeContainer.style.display = 'none';
};



