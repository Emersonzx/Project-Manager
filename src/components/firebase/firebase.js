import { initializeApp } from "firebase/app";
import { getFirestore, collection, doc, setDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCx1--u7hGXa4uxt_BDzzJCwMiM5eb7cv0",
  authDomain: "reactform-74ad1.firebaseapp.com",
  projectId: "reactform-74ad1",
  storageBucket: "reactform-74ad1.appspot.com",
  messagingSenderId: "116229038869",
  appId: "1:116229038869:web:fe8b4a546613f8b8aa7f1c",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);



// Define the data you want to add
const categoriesData = [
  {
    id: 1,
    name: "Infra",
  },
  {
    id: 2,
    name: "Desenvolvimento",
  },
  {
    id: 3,
    name: "Design",
  },
  {
    id: 4,
    name: "Planejamento",
  },
];

// Add the categories data to Firestore
const categoriesCollectionRef = collection(db, "categories");
categoriesData.forEach((category) => {
  setDoc(doc(categoriesCollectionRef, category.id.toString()), category);
});
