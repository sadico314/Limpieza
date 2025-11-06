// ===================================
// FIREBASE CONFIGURATION
// Limpieza Hilaria - Sistema Completo
// ===================================

// Import Firebase SDKs
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-storage.js";

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
let app, auth, db, storage;

try {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
  storage = getStorage(app);
  console.log('🔥 Firebase inicializado correctamente');
} catch (error) {
  console.error('Error inicializando Firebase:', error);
}

// Export for use in other files
export { auth, db, storage };
