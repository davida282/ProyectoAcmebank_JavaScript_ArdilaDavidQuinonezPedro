    import { initializeApp } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-app.js";
    import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-analytics.js";
    import { getDatabase, ref, set, get, child, onValue } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-database.js";
  
    const firebaseConfig = {
      apiKey: "AIzaSyCnVIPEevJRjIk5rOryUofw9mLmZzVFUj0",
      authDomain: "banco-acme-a5567.firebaseapp.com",
      databaseURL: "https://banco-acme-a5567-default-rtdb.firebaseio.com",
      projectId: "banco-acme-a5567",
      storageBucket: "banco-acme-a5567.firebasestorage.app",
      messagingSenderId: "304465915351",
      appId: "1:304465915351:web:8da84d30dea719fb0a6f92",
      measurementId: "G-Y22KLMB354"
    };
  
    
    const app = initializeApp(firebaseConfig);
    
    const db = getDatabase();
  
    export { db };

   
      