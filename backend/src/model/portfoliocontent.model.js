import mongoose from "mongoose";

const portfolioContentSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      default: "main",
      unique: true,
      required: true,
    },

    content: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },

    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
    },
  },
  { timestamps: true }
);

const PortfolioContent = mongoose.model(
  "PortfolioContent",
  portfolioContentSchema
);

export default PortfolioContent;