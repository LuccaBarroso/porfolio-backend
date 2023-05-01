import express from "express";
import cors from "cors";
import animationRoutes from "./routes/animationRoutes.js";
import animationCategoryRoutes from "./routes/animationCategoryRoutes.js";
import postRoutes from "./routes/postRoutes.js";
import timelineRoutes from "./routes/timelineRoutes.js";
import stackRoutes from "./routes/stackRoutes.js";
import skillRoutes from "./routes/skillRoutes.js";

import dotenv from "dotenv";
dotenv.config();

// import { getAnimation, getAnimations, createAnimation } from "./database.js";

const app = express();

const corsOptions = {
  origin: "http://localhost:3000",
};
app.use(cors(corsOptions));

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.json({ message: "Welcome to my application." });
});

app.use("/animations", animationRoutes);
app.use("/animation-categories", animationCategoryRoutes);
app.use("/posts", postRoutes);
app.use("/timelines", timelineRoutes);
app.use("/stacks", stackRoutes);
app.use("/skills", skillRoutes);

app.listen(process.env.PORT, () => {
  console.log("Server running on port 3000");
});
