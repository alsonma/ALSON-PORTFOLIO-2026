import express from "express";

import {
  getPortfolio,
  updatePortfolio,
} from "../controller/portfolio.controller.js";

import { verifyAdmin } from "../middleware/auth.middleware.js";

const router = express.Router();

// Public route: anyone can view the portfolio.
router.get("/", getPortfolio);

// Protected route: only a logged-in admin can edit it.
router.put("/", verifyAdmin, updatePortfolio);

export default router;