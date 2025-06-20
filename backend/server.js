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

if (process.env.NODE_ENV === "production") {
    app.set("trust proxy", 1);
}

// ✅ CORS Configuration
const corsOptions = {
    origin: ["http://localhost:5173", "https://mern-authentication-frontend-ks21.onrender.com"],
    credentials: true,
    // methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    // allowedHeaders: ["Content-Type", "Authorization"]
};


app.use(cors(corsOptions));
// app.options("*", cors(corsOptions));

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
app.get("/check-token", (req, res) => {
    console.log("Cookies from frontend:", req.cookies);
    res.send(req.cookies);
});


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
