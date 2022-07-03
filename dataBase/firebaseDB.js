const firebase = require("firebase");
const { initializeApp } = require("firebase/app");

const firebaseConfig = {
    apiKey: "AIzaSyBzyTHNr71KGnVa1HWvOy8oDJ_deejM9rs",
    authDomain: "ecommerce-desafio2-gb.firebaseapp.com",
    projectId: "ecommerce-desafio2-gb",
    storageBucket: "ecommerce-desafio2-gb.appspot.com",
    messagingSenderId: "668368699070",
    appId: "1:668368699070:web:bf6981f6ba27ab6f5428ef"
};

const app = initializeApp(firebaseConfig);

const db = firebase.firestore();
const queryCarritos = db.collection(`Carritos`);
const queryProductos = db.collection(`Productos`);


module.exports = {
    queryProductos,
};

