import express from 'express';
import userAuth from '../middleware/userAuth.js';
import { getUserData } from '../controllers/authController.js';
const app = express.Router();



app.get("/data", userAuth, getUserData);

export default app;