
import PortfolioContent from "../model/portfoliocontent.model.js";

// Default portfolio content used when the database has no portfolio yet.
const defaultContent = {
  hero: {
    name: "Alson M.A.",
    title: "Creative Developer",
    description:
      "I build interactive digital experiences using React, JavaScript and creative animations.",
    profileImage: "",
  },

  about: {
    heading: "A little about me",
    description:
      "I'm an MCA graduate passionate about building creative, interactive web experiences.",
  },

  education: [
    {
      id: 1,
      title: "Master of Computer Applications",
      institution: "",
      date: "",
      description:
        "A foundation in computer science and software development.",
    },
  ],

  projects: [
    {
      id: 1,
      title: "Movie Explorer",
      description: "A movie search application built with React.",
      image: "",
      liveUrl: "",
      githubUrl: "",
    },
    {
      id: 2,
      title: "Portfolio Website",
      description: "A creative portfolio with GSAP animations.",
      image: "",
      liveUrl: "",
      githubUrl: "",
    },
  ],

  skills: [
    "HTML",
    "CSS",
    "JavaScript",
    "React",
    "Node.js",
    "MongoDB",
  ],

  contact: {
    email: "",
    github: "",
    linkedin: "",
  },
};

// GET: Load portfolio content.
export const getPortfolio = async (req, res) => {
  try {
    let portfolio = await PortfolioContent.findOne({ key: "main" });

    // Create the initial portfolio document on the first request.
    if (!portfolio) {
      portfolio = await PortfolioContent.create({
        key: "main",
        content: defaultContent,
      });
    }

    return res.status(200).json({
      success: true,
      content: portfolio.content,
      updatedAt: portfolio.updatedAt,
    });
  } catch (error) {
    console.error("Get portfolio error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to load portfolio content",
    });
  }
};

// PUT: Save portfolio content (admin only).
export const updatePortfolio = async (req, res) => {
  try {
    const content = req.body;

    // Validate the main content object.
    if (
      !content ||
      typeof content !== "object" ||
      Array.isArray(content)
    ) {
      return res.status(400).json({
        success: false,
        message: "A valid portfolio content object is required",
      });
    }

    // These are the only sections the admin can update.
    const allowedSections = [
      "hero",
      "about",
      "education",
      "projects",
      "skills",
      "contact",
    ];

    const suppliedSections = Object.keys(content);

    // Require all sections and reject unexpected fields.
    if (
      suppliedSections.length !== allowedSections.length ||
      suppliedSections.some(
        (section) => !allowedSections.includes(section)
      ) ||
      allowedSections.some(
        (section) =>
          !Object.prototype.hasOwnProperty.call(content, section)
      )
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Content must include hero, about, education, projects, skills and contact",
      });
    }

    // Validate object and array section types.
    if (
      !content.hero ||
      typeof content.hero !== "object" ||
      Array.isArray(content.hero) ||

      !content.about ||
      typeof content.about !== "object" ||
      Array.isArray(content.about) ||

      !Array.isArray(content.education) ||
      !Array.isArray(content.projects) ||
      !Array.isArray(content.skills) ||

      !content.contact ||
      typeof content.contact !== "object" ||
      Array.isArray(content.contact)
    ) {
      return res.status(400).json({
        success: false,
        message: "One or more portfolio sections have an invalid format",
      });
    }

    // Validate education entries.
    const invalidEducation = content.education.some(
      (item) =>
        !item ||
        typeof item !== "object" ||
        Array.isArray(item)
    );

    if (invalidEducation) {
      return res.status(400).json({
        success: false,
        message: "Each education entry must be an object",
      });
    }

    // Validate project entries.
    const invalidProject = content.projects.some(
      (item) =>
        !item ||
        typeof item !== "object" ||
        Array.isArray(item)
    );

    if (invalidProject) {
      return res.status(400).json({
        success: false,
        message: "Each project entry must be an object",
      });
    }

    // Validate skills.
    const invalidSkill = content.skills.some(
      (skill) => typeof skill !== "string"
    );

    if (invalidSkill) {
      return res.status(400).json({
        success: false,
        message: "Every skill must be a string",
      });
    }

    // Save the complete portfolio content to MongoDB.
    const portfolio = await PortfolioContent.findOneAndUpdate(
      { key: "main" },
      {
        $set: {
          content,
          updatedBy: req.user.id,
        },
        $setOnInsert: {
          key: "main",
        },
      },
      {
        new: true,
        upsert: true,
        runValidators: true,
      }
    );

    return res.status(200).json({
      success: true,
      message: "Portfolio content saved successfully",
      content: portfolio.content,
      updatedAt: portfolio.updatedAt,
    });
  } catch (error) {
    console.error("Update portfolio error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to save portfolio content",
    });
  }
};
