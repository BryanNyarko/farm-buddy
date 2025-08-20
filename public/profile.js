import { auth } from "./firebase-config.js";
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-auth.js";

// Load user info
onAuthStateChanged(auth, (user) => {
  if (user) {
    document.getElementById("user-name").innerText = user.displayName || "Anonymous";
    document.getElementById("user-email").innerText = user.email;
  } else {
    window.location.href = "index.html"; // redirect if not logged in
  }
});

// Log out
document.getElementById("logout-btn").addEventListener("click", async () => {
  await signOut(auth);
  window.location.href = "index.html";
});