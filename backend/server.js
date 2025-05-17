import express from "express";
import cors from 'cors';
import 'dotenv/config';
import cookieParser from "cookie-parser";
const app = express();
const port = process.env.PORT || 4000;
const allowedOrigins = ['http://localhost:5173']
app.use(cors({ origin: allowedOrigins, credentials: true }));
app.use(express.json());
app.use(cookieParser());
import connectDB from "./config/database.js";
import userRoute from "./routes/userRoutes.js"
import authRoute from "./routes/authRoutes.js"
connectDB();
app.get('/', (req, res) => {
    res.send("API working");
})
app.use("/user", userRoute);
app.use("/auth", authRoute);

app.listen(port, () => {
    console.log(`Server is running on ${port} `);
})
// shivamsisodiya2055
// Shivam
// mongodb+srv://shivamsisodiya2055:Shivam@cluster0.4oxogwb.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
// 4:55