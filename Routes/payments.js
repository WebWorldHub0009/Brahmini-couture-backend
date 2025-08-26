// routes/payments.js
const express = require("express");
const Razorpay = require("razorpay");
const crypto = require("crypto");

const router = express.Router();

// Razorpay instance with your live keys
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// ✅ 1) Create Order
router.post("/create-order", async (req, res) => {
  try {
    const { amount, currency = "INR", receiptId } = req.body;

    // Amount should always come from server-side product price (not trusted client)
    const options = {
      amount: Number(amount), // amount in paise (₹1 = 100)
      currency,
      receipt: receiptId || `rcpt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);

    res.json({ success: true, order });
  } catch (err) {
    console.error("Create order error:", err);
    res.status(500).json({ success: false, message: "Order creation failed" });
  }
});

// ✅ 2) Verify Payment Signature
router.post("/verify", (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      req.body;

    const hmac = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(razorpay_order_id + "|" + razorpay_payment_id)
      .digest("hex");

    if (hmac === razorpay_signature) {
      // TODO: mark order as paid in your DB
      return res.json({ success: true, message: "Payment verified successfully" });
    } else {
      return res.status(400).json({ success: false, message: "Invalid signature" });
    }
  } catch (err) {
    console.error("Verification error:", err);
    res.status(500).json({ success: false, message: "Verification failed" });
  }
});

module.exports = router;
