// import express from "express";
// import cors from "cors";
// import "dotenv/config";
// import cookieParser from "cookie-parser";

// const app = express();
// const port = process.env.PORT || 4000;

// // ✅ CORS setup
// app.use(cors({
//     origin: 'https://dazzling-brioche-6c28d1.netlify.app', // Netlify site
//     credentials: true,
//     methods: ["GET", "POST", "PUT", "DELETE"],
//     allowedHeaders: ["Content-Type", "Authorization"]
// }));

// app.use(express.json());
// app.use(cookieParser());

// // DB + Routes
// import connectDB from "./config/database.js";
// import userRoute from "./routes/userRoutes.js";
// import authRoute from "./routes/authRoutes.js";

// connectDB();

// app.get("/", (req, res) => {
//     res.send("API working");
// });

// app.use("/user", userRoute);
// app.use("/auth", authRoute);

// // ❌ REMOVE this error handler — ab iska use nahi
// // app.use((err, req, res, next) => {
// //     if (err instanceof Error && err.message === "Not allowed by CORS") {
// //         return res.status(403).json({ message: "CORS Error: Origin not allowed" });
// //     }
// //     next(err);
// // });

// app.listen(port, () => {
//     console.log(`Server is running on ${port}`);
// });



import express from "express";
import cors from "cors";
import "dotenv/config";
import cookieParser from "cookie-parser";

const app = express();
const port = process.env.PORT || 4000;

// ✅ CORS Configuration
const corsOptions = {
    origin: "https://monumental-seahorse-30e096.netlify.app", // 👈 No trailing slash!
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions)); // 👈 For preflight

app.use(cookieParser());
app.use(express.json());

// ✅ DB & Routes
import connectDB from "./config/database.js";
import userRoute from "./routes/userRoutes.js";
import authRoute from "./routes/authRoutes.js";

connectDB();

app.get("/", (req, res) => {
    res.send("API working");
});

app.use("/user", userRoute);
app.use("/auth", authRoute);

// ✅ Start Server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
