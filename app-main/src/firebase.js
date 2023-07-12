// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAaNYJZm5XTAhfPtgMBT2MUrWNxkaYjVws",
  authDomain: "approjet1.firebaseapp.com",
  projectId: "approjet1",
  storageBucket: "approjet1.appspot.com",
  messagingSenderId: "579033962566",
  appId: "1:579033962566:web:f5947e42ec76fbafb29247",
  measurementId: "G-NJZHFDR2VM"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export default app;