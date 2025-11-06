// ===================================
// FIREBASE CONFIGURATION
// Limpieza Hilaria - Sistema Completo
// ===================================

// Import Firebase SDKs
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDtMv3eCq9jptgEeMoDFug6YBxC-OuJHBO",
  authDomain: "limpieza-hilaria-web.firebaseapp.com",
  projectId: "limpieza-hilaria-web",
  storageBucket: "limpieza-hilaria-web.firebasestorage.app",
  messagingSenderId: "203836797314",
  appId: "1:203836797314:web:6d33ac914ccb2f8463df9b"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// Export for use in other files
export { auth, db, storage };

console.log('🔥 Firebase inicializado correctamente');
