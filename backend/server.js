import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import connectDB from "./src/config/database.js";
import seedAdmin from "./src/utiles/seedAdmin.js";

import authRoutes from "./src/routes/auth.routes.js";
import portfolioRoutes from "./src/routes/portfolio.routes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
import cors from "cors";

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://alson-portfolio-2026.vercel.app",
    ],
    credentials: true,
  })
);

app.use(express.json({ limit: "1mb" }));

// Basic health-check route
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Portfolio CMS API is running",
  });
});

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/portfolio", portfolioRoutes);

// Start the server after connecting to MongoDB.
const startServer = async () => {
  try {
    await connectDB();
    await seedAdmin();

    app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Server startup failed:", error.message);
    process.exit(1);
  }
};

startServer();