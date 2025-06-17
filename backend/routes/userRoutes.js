import express from 'express';

import { isAuthenticated, login, logout, register, resetPassword, sendResetOtp, sendVerifyOtp, verifyEmail } from '../controllers/userController.js';
import userAuth from '../middleware/userAuth.js';
const router = express.Router();



router.post('/register', register);
router.post('/login', login);
router.get('/logout', logout);
router.post('/send-verify-otp', userAuth, sendVerifyOtp) //user auth
router.post('/verify-account', userAuth, verifyEmail);  //user auth

router.get('/is-auth', userAuth, isAuthenticated); //userAuth
router.post("/send-reset-otp", sendResetOtp);

router.post('/reset-password', resetPassword);


export default router;