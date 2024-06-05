import User from "../modules/user.js";
import bcrypt from "bcrypt";
import { sendApprovalCode } from "../services/email.service.js";
import crypto from "crypto";
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
    const approvalCode = crypto.randomBytes(3).toString("hex");
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

    res.status(201).json({
      message: "User created. Approval code sent to email.",
      user: user,
    });
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

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).json({ results: users.length, data: users });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

const getAllCoaches = async (req, res) => {
  try {
    const coaches = await User.find({ role: "COACH" });
    console.log("coaches :", coaches);

    if (!coaches || coaches.length === 0) {
      return res.status(404).json({ message: "Coaches not found" });
    }
    res.status(200).json({ results: coaches.length, coaches: coaches });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

const getAllNutritionnistes = async (req, res) => {
  try {
    const nutritionnistes = await User.find({ role: "NUTRITIONNISTE" });

    if (!nutritionnistes || nutritionnistes.length === 0) {
      return res.status(404).json({ message: "Nutritionnistes not found" });
    }
    res.status(200).json({
      results: nutritionnistes.length,
      nutritionnistes: nutritionnistes,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    const id = req.params.id;
    const user = await User.findByIdAndDelete(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res
      .status(200)
      .send(`User ${user.firstName} ${user.lastName} has been deleted`);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

const updateUser = async (req, res) => {
  try {
    const id = req.params.id;
    const updates = req.body;

    const allowedUpdates = [
      "firstName",
      "lastName",
      "nickName",
      "birthDate",
      "adresse",
      "weight",
      "height",
    ];
    const actualUpdates = Object.keys(updates);
    //   const isValidOperation = actualUpdates.every((update) => allowedUpdates.includes(update));
    const isValidOperation = actualUpdates.some((update) =>
      allowedUpdates.includes(update)
    );

    if (!isValidOperation) {
      return res.status(400).json({ error: "Invalid updates!" });
    }

    const user = await User.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

const changePassword = async (req, res) => {
  const id = req.params.id;
  const newPassword = await bcrypt.hash(req.body.password, 10);
  const user = await User.findOneAndUpdate(
    { _id: id },
    { password: newPassword },
    { new: true }
  );

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  res.status(200).json({
    response: `User ${user.firstName} ${user.lastName} password has been modified`,
  });
};

export {
  createUser,
  getUser,
  getAllUsers,
  getAllCoaches,
  getAllNutritionnistes,
  deleteUser,
  updateUser,
  changePassword,
};
