import { User } from "../models/user.model.js";

const seedAdmin = async () => {
  try {
    const existingAdmin = await User.findOne({
      role: "admin",
    });

    if (existingAdmin) {
      console.log("Admin already exists.");
      return;
    }

    await User.create({
      name: "Admin",
      email: "admin@leavepro.com",
      password: "admin123",
      role: "admin",
    });

    console.log("Admin created successfully.");
  } catch (error) {
    console.error("Admin seeding failed:", error);
  }
};

export default seedAdmin;
