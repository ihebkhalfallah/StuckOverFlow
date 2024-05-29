import User from "../modules/user.js";
import bcrypt from "bcrypt";
import { sendApprovalCode } from "../services/email.service.js";

const createCoach = async (req, res) => {
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
      role: "COACH",
      email,
      password: hashedPassword,
      adresse,
      phoneNumber,
    });
    await user.save();

    res.status(201).json(user);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

const getCoach = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "Coach not found" });
    }
    res.status(200).json(user);
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

const deleteCoach = async (req, res) => {
  try {
    const id = req.params.id;
    const user = await User.findByIdAndDelete(id);
    if (!user) {
      return res.status(404).json({ message: "Coach not found" });
    }
    res
      .status(200)
      .send(`Coach ${user.firstName} ${user.lastName} has been deleted`);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

const updateCoach = async (req, res) => {
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
      return res.status(404).json({ message: "Coach not found" });
    }

    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

const changePasswordCoach = async (req, res) => {
  const id = req.params.id;
  const newPassword = await bcrypt.hash(req.body.password, 10);
  const user = await User.findOneAndUpdate(
    { _id: id },
    { password: newPassword },
    { new: true }
  );

  if (!user) {
    return res.status(404).json({ message: "Coach not found" });
  }
  res.status(200).json({
    response: `Coach ${user.firstName} ${user.lastName} password has been modified`,
  });
};

export {
  createCoach,
  getCoach,
  getAllCoaches,
  deleteCoach,
  updateCoach,
  changePasswordCoach,
};
