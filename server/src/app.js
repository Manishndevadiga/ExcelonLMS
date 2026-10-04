import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import userRouter from "./routes/users.routes.js";
import leaveRouter from "./routes/leave.routes.js";

const app = express();


// -----------------------------------------
// CORS
// -----------------------------------------

const allowedOrigins = [
  "http://localhost:5173",
  "https://excelon-p7rylpjq0-manish-s-projects-844e9815.vercel.app",
   process.env.CLIENT_URL,
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);


// -----------------------------------------
// Middleware
// -----------------------------------------

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());


// -----------------------------------------
// Health check
// -----------------------------------------

app.get("/", (req, res) => {
  res.status(200).send("Leave Management Server is running...");
});

// -----------------------------------------
// Routes
// -----------------------------------------

app.use("/api/user", userRouter);
app.use("/api/leave", leaveRouter);


// -----------------------------------------
// 404 Handler
// -----------------------------------------

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Can't find ${req.originalUrl} on the server`,
  });
});


// -----------------------------------------
// Global Error Handler
// -----------------------------------------

app.use((err, req, res, next) => {
  console.error(err);

  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});


export { app };