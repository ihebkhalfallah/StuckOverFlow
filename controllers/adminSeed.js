import mongoose from "mongoose";
import User from "../modules/user.js";

export const createAdmin = async () => {
  try {
    const admin = await User.findOne({ role: "admin" });

    if (!admin) {
      const newAdmin = new User({
        firstName: "admin",
        lastName: "admin",
        nickName: "admin",
        birthDate: "1997-08-29T00:00:00.000+00:00",
        email: "admin@example.com",
        password: "adminpassword",
        role: "ADMIN",
        active: true,
        isApproved: true,
      });
      await newAdmin.save();
      console.log("Admin account created successfully");
    } else {
      console.log("Admin account already exists");
    }
  } catch (error) {
    console.error("Error creating admin account:", error);
  } finally {
    mongoose.connection.close();
  }
};
