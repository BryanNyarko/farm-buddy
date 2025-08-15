//firebase libraries
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyCylrCrfJpzXb8hue7jMuJAny70kzWo59s",
  authDomain: "farm-buddy-c7a84.firebaseapp.com",
  projectId: "farm-buddy-c7a84",
  storageBucket: "farm-buddy-c7a84.firebasestorage.app",
  messagingSenderId: "296944944243",
  appId: "1:296944944243:web:6e19eca42a74d332a99606",
  measurementId: "G-4RJWQML082"
};

// initialize firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// export
export { auth, db };
