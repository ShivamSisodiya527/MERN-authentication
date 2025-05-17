import express from 'express';

import { isAuthenticated, login, logout, register, resetPassword, sendResetOtp, sendVerifyOtp, verifyEmail } from '../controllers/userController.js';
import userAuth from '../middleware/userAuth.js';
const app = express.Router();



app.post('/register', register);
app.post('/login', login);
app.get('/logout', logout);
app.post('/send-verify-otp', userAuth, sendVerifyOtp);
app.post('/verify-account', userAuth, verifyEmail);

app.get('/is-auth', userAuth, isAuthenticated);
app.post("/send-reset-otp", sendResetOtp);

app.post('/reset-password', resetPassword);


export default app;