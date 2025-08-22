const express = require('express');
const { userLogin, userRegister, getUserProfile} = require('../Controllers/userController');
const { protect } = require('../Middlewares/authMiddleware');
const router = express.Router();

router.post("/login",userLogin);
router.post("/register",userRegister) 
router.get("/profile", protect, getUserProfile);


module.exports = router;