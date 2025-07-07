const express = require('express');
const connectToDb = require('./Config/db');
const userRouter = require('./Routes/userRouter');
const productRouter = require('./Routes/productRouter');
const cors = require('cors'); // ✅ import cors
require('dotenv').config();

const app = express();

// ✅ Use CORS
app.use(cors({
  origin: "http://localhost:5173", // <-- frontend origin
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

connectToDb();

const port = process.env.PORT;

// Routes
app.use("/users", userRouter);
app.use("/products", productRouter);

// Default route
app.get("/", (req, res) => {
  res.send("I am root");
});

app.listen(port, () => {
  console.log(`✅ App is running on port ${port}`);
});
