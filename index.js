const express = require('express');
const connectToDb = require('./Config/db');
const userRouter = require('./Routes/userRouter');
const productRouter = require('./Routes/productRouter');
const cartRoutes = require('./Routes/cartRouter');
const addressRouter = require('./Routes/addressRouter');
const orderRouter = require('./Routes/orderRouter');
const paymentRoutes = require('./Routes/payments'); // ✅ added Razorpay routes
const cors = require('cors');
require('dotenv').config();

const app = express();

// ✅ Allowed origins for frontend (local + production)
const allowedOrigins = [
  "http://localhost:5173",
  "https://brahmanicouture.com",
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.error("❌ Blocked by CORS:", origin);
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

// ✅ API Routes
app.use("/users", userRouter);
app.use("/products", productRouter);
app.use("/cart", cartRoutes);
app.use("/address", addressRouter);
app.use("/orders", orderRouter);
app.use("/api/payments", paymentRoutes); // ✅ Razorpay endpoints

// ✅ Default route
app.get("/", (req, res) => {
  res.send("Brahmani Couture API is running...");
});

// ✅ Start server
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`✅ App is running on port ${port}`);
});
