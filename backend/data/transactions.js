const mongoose = require("mongoose");

const transactions = [
  {
    _id: "6856d8ebe9b3da3353bbcce4",
    userId: "6856d110e61796d9786695b0", // Juan
    amount: 1200,
    category: "6856d7ebe9b3da3353bbcce0", // Comida
    type: "expense",
    description: "Compras del supermercado",
    isActive: true,
  },
  {
    _id: "6856d8ebe9b3da3353bbcce5",
    userId: "6856d110e61796d9786695b4", // María
    amount: 3500,
    category: "6856d7ebe9b3da3353bbccdf", // Tecnología
    type: "income",
    description: "Venta de equipo tecnológico",
    isActive: true,
  },
  {
    _id: "6856d8ebe9b3da3353bbcce6",
    userId: "6856d110e61796d9786695b8", // Agustin
    amount: 500,
    category: "6856d7ebe9b3da3353bbcce2", // Moda
    type: "expense",
    description: "Compra de ropa",
    isActive: true,
  },
  {
    _id: "6856d8ebe9b3da3353bbcce7",
    userId: "6856d110e61796d9786695b8", // Agustin
    amount: 2000,
    category: "6856d7ebe9b3da3353bbcce1", // Hogar
    type: "income",
    description: "Venta de muebles usados",
    isActive: true,
  },
  {
    _id: "6856d8ebe9b3da3353bbcce8",
    userId: "6856d110e61796d9786695b4", // María
    amount: 300,
    category: "6856d7ebe9b3da3353bbcce3", // Animales
    type: "expense",
    description: "Veterinario para la mascota",
    isActive: true,
  },
  {
    _id: "6856d8ebe9b3da3353bbcce9",
    userId: "6856d110e61796d9786695b0", // Juan
    amount: 5000,
    category: "6856d7ebe9b3da3353bbccdf", // Tecnología
    type: "income",
    description: "Trabajo freelance de programación",
    isActive: true,
  },
  {
    _id: "6856d8ebe9b3da3353bbccea",
    userId: "6856d110e61796d9786695b4", // María
    amount: 800,
    category: "6856d7ebe9b3da3353bbcce1", // Hogar
    type: "expense",
    description: "Artículos de decoración",
    isActive: true,
  },
];

module.exports = transactions;
