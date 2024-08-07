import User from "../modules/user.js";
import bcrypt from "bcrypt";
import crypto from "crypto";
import { sendApprovalCode } from "../services/email.service.js";

const createNutritionniste = async (req, res) => {
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
    const hashedPassword = await bcrypt.hash(password, 10);
    const approvalCode = crypto.randomBytes(3).toString("hex");

    const user = new User({
      firstName,
      lastName,
      nickName,
      birthDate,
      role: "NUTRITIONNISTE",
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

const getNutritionniste = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "Nutritionniste not found" });
    }
    res.status(200).json(user);
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

const deleteNutritionnistes = async (req, res) => {
  try {
    const id = req.params.id;
    const user = await User.findByIdAndDelete(id);
    if (!user) {
      return res.status(404).json({ message: "Nutritionnistes not found" });
    }
    res
      .status(200)
      .send(
        `Nutritionnistes ${user.firstName} ${user.lastName} has been deleted`
      );
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

const updateNutritionnistes = async (req, res) => {
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
      return res.status(404).json({ message: "Nutritionnistes not found" });
    }

    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

const changePasswordNutritionnistes = async (req, res) => {
  const id = req.params.id;
  const newPassword = await bcrypt.hash(req.body.password, 10);
  const user = await User.findOneAndUpdate(
    { _id: id },
    { password: newPassword },
    { new: true }
  );

  if (!user) {
    return res.status(404).json({ message: "Nutritionnistes not found" });
  }
  res.status(200).json({
    response: `Nutritionnistes ${user.firstName} ${user.lastName} password has been modified`,
  });
};

export {
  createNutritionniste,
  getAllNutritionnistes,
  getNutritionniste,
  updateNutritionnistes,
  deleteNutritionnistes,
  changePasswordNutritionnistes,
};
