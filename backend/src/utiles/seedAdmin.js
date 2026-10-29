import bcrypt from "bcryptjs";
import Admin from "../model/admin.model.js";

const seedAdmin = async () => {
  const email = process.env.ADMIN_EMAIL?.toLowerCase().trim();
  const password = process.env.ADMIN_PASSWORD;
  const name = process.env.ADMIN_NAME || "Portfolio Admin";

  if (!email || !password || !process.env.JWT_SECRET) {
    throw new Error(
      "ADMIN_EMAIL, ADMIN_PASSWORD and JWT_SECRET must be configured"
    );
  }

  if (password.length < 12) {
    throw new Error("ADMIN_PASSWORD must be at least 12 characters");
  }

  const existingAdmin = await Admin.findOne({ email });

  if (existingAdmin) {
    console.log("Admin account already exists");
    return;
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  await Admin.create({
    name,
    email,
    password: hashedPassword,
    role: "admin",
  });

  console.log("Initial admin account created");
};

export default seedAdmin;