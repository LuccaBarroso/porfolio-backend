import express from "express";
import cors from "cors";
import animationRoutes from "./routes/animationRoutes.js";
import animationCategoryRoutes from "./routes/animationCategoryRoutes.js";
import postRoutes from "./routes/postRoutes.js";
import timelineRoutes from "./routes/timelineRoutes.js";
import stackRoutes from "./routes/stackRoutes.js";
import skillRoutes from "./routes/skillRoutes.js";
import projectRoutes from "./routes/projectRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import bcrypt from "bcrypt";
import session from "express-session";
import rateLimit from "express-rate-limit";
import compression from "compression";
import helmet from "helmet";
import cookieParser from "cookie-parser";

import dotenv from "dotenv";
dotenv.config();

const app = express();

app.use(compression());

const corsOptions = {
  credentials: true,
  origin: "http://localhost:3001",
};

app.use(cors(corsOptions));

app.use(express.json());

app.use(
  helmet({
    contentSecurityPolicy: false,
  })
);

// Limit requests to 100 per hour per IP address
const limiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 200,
  message: "Too many requests from this IP, please try again tomorrow.",
});

app.use(limiter);

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

app.use(cookieParser());

app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.json({ message: "Welcome to my application." });
});

app.use("/api/animations", animationRoutes);
app.use("/api/animation-categories", animationCategoryRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/timelines", timelineRoutes);
app.use("/api/stacks", stackRoutes);
app.use("/api/skills", skillRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/auth", authRoutes);


app.listen(process.env.PORT, () => {
  console.log("Server running on port " + process.env.PORT);
});
