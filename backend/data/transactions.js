const mongoose = require("mongoose");

const transactions = [
  {
    username: "6856d110e61796d9786695b0", // Juan
    amount: 1200,
    category: "6856d7ebe9b3da3353bbcce0", // Comida
    type: "6856d6b53a7da566e87bf3f0", // Egreso
  },
  {
    username: "6856d110e61796d9786695b4", // María
    amount: 3500,
    category: "6856d7ebe9b3da3353bbccdf", // Tecnología
    type: "6856d6b53a7da566e87bf3f1", // Ingreso
  },
  {
    username: "6856d110e61796d9786695b8", // Agustin
    amount: 500,
    category: "6856d7ebe9b3da3353bbcce2", // Moda
    type: "6856d6b53a7da566e87bf3f0", // Egreso
  },
  {
    username: "6856d110e61796d9786695b8", // Agustin
    amount: 2000,
    category: "6856d7ebe9b3da3353bbcce1", // Hogar
    type: "6856d6b53a7da566e87bf3f1", // Ingreso
  },
  {
    username: "6856d110e61796d9786695b4", // María
    amount: 300,
    category: "6856d7ebe9b3da3353bbcce3", // Animales
    type: "6856d6b53a7da566e87bf3f0", // Egreso
  },
];

module.exports = transactions;
