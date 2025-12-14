import mongoose from "mongoose";
import dotenv from "dotenv";
import Sweet from "../models/Sweet.js"; // Correct model
import connectDB from "../config/db.js";

dotenv.config();

// Connect to the database
await connectDB();

// Product data
const products = [
  {
    name: "Dairy Milk Silk Bubbly Chocolate",
    brand: "Dairy Milk",
    desc: "Light, airy, and irresistibly smooth chocolate with bubbly texture.",
    price: 99,
    category: "chocolate",
    img: "Dairymilk.png",
    stock: 5,
  },
  {
    name: "Chocolate Cake",
    brand: "CakeTown",
    desc: "Soft chocolate cake layered with cream",
    price: 799,
    category: "cake",
    img: "cake.png",
    stock: 3,
  },
  {
    name: "Milk Cake",
    brand: "DesiSweet",
    desc: "Traditional milk cake made with love",
    price: 260,
    category: "sweet",
    img: "milkcake.png",
    stock: 4,
  },
  {
    name: "Besan Ladoo",
    brand: "DesiSweet",
    desc: "Roasted besan ladoo made with pure ghee and cardamom.",
    price: 180,
    category: "sweet",
    img: "ladoo.png",
    stock: 40,
  },
  {
    name: "Kaju Katli",
    brand: "DesiSweet",
    desc: "Premium cashew sweet with rich, smooth texture.",
    price: 1200,
    category: "sweet",
    img: "kaju.png",
    stock: 45,
  },
];

// Seeder function
const seedProducts = async () => {
  try {
    // Delete existing sweets
    await Sweet.deleteMany();

    // Insert new sweets
    await Sweet.insertMany(products);

    console.log("Sweets seeded successfully");
    process.exit(); // Exit after seeding
  } catch (error) {
    console.error("Error seeding sweets:", error);
    process.exit(1);
  }
};

seedProducts();
