const express = require('express');
const connectToDb = require('./Config/db');
const userRouter = require('./Routes/userRouter');
const productRouter = require('./Routes/productRouter');
const cartRoutes = require('./Routes/cartRouter');
const cors = require('cors');
require('dotenv').config();

const app = express();

// ✅ Use CORS to allow frontend connection
app.use(cors({
  origin: "http://localhost:5173", // Frontend URL (Vite, likely)
  credentials: true,
}));

// ✅ Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Connect to MongoDB
connectToDb();

// ✅ Routes
app.use("/users", userRouter);
app.use("/products", productRouter);
app.use("/cart", cartRoutes)

// ✅ Default route
app.get("/", (req, res) => {
  res.send("I am root");
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`✅ App is running on port ${port}`);
});
