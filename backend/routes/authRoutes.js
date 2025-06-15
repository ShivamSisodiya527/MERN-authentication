import express from 'express';
import userAuth from '../middleware/userAuth.js';
import { getUserData } from '../controllers/authController.js';
const router = express.Router();



router.get("/data", userAuth, getUserData);

export default router;