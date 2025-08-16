const express = require('express');
const connectToDb = require('./Config/db');
const userRouter = require('./Routes/userRouter');
const productRouter = require('./Routes/productRouter');
const cartRoutes = require('./Routes/cartRouter');
const addressRouter = require('./Routes/addressRouter');
const orderRouter = require('./Routes/orderRouter');
const cors = require('cors');
require('dotenv').config();

const app = express();

// ✅ Use CORS to allow frontend connections (both local and production)
const allowedOrigins = [
  "http://localhost:5173",
  "https://brahmanicouture.com"
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, curl, etc.)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
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
app.use("/cart", cartRoutes);
app.use("/address", addressRouter);
app.use("/orders", orderRouter);

// ✅ Default route
app.get("/", (req, res) => {
  res.send("I am root");
});

// ✅ Start server
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`✅ App is running on port ${port}`);
});
