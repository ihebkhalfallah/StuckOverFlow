import User from "../modules/user.js";
import bcrypt from "bcrypt";
import { sendApprovalCode } from "../services/emailService.js";
import crypto from "crypto"; // For generating random approval code

const createUser = async (req, res) => {
  const {
    firstName,
    lastName,
    nickName,
    birthDate,
    email,
    password,
    adresse,
    phoneNumber,
  } = req.body;

  try {
    const approvalCode = crypto.randomBytes(3).toString("hex"); // Generate random approval code
    const user = new User({
      firstName,
      lastName,
      nickName,
      birthDate,
      role: "USER",
      email,
      password,
      adresse,
      phoneNumber,
      approvalCode,
      isApproved: false,
    });
    await user.save();

    await sendApprovalCode(email, approvalCode);

    res
      .status(201)
      .json({ message: "User created. Approval code sent to email." });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

const approveUser = async (req, res) => {
  const { email, approvalCode } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.approvalCode !== approvalCode) {
      return res.status(400).json({ message: "Invalid approval code" });
    }

    user.isApproved = true;
    user.approvalCode = undefined; // Clear the approval code
    await user.save();

    res.status(200).json({ message: "User approved successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Other user controller methods ...

export {
  createUser,
  approveUser,
  getUser,
  // Other exports...
};
