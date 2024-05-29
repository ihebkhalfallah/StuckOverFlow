import User from "../modules/user.js";
import bcrypt from "bcrypt";
import ApiError from "../utils/apiError.js";
import { sendApprovalCode } from "../services/email.service.js";

const createAdmin = async (req, res) => {
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
    const admin = new User({
      firstName,
      lastName,
      nickName,
      birthDate,
      role: "ADMIN",
      email,
      password: hashedPassword,
      adresse,
      phoneNumber,
    });
    await admin.save();

    res.status(201).json(admin);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
const getUser = async (req, res) => {
  try {
    const admin = await User.findById(req.params.id);
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }
    res.status(200).json(admin);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

const getAllAccounts = async (req, res) => {
  try {
    const admins = await User.find({});
    res.status(200).json({ results: admins.length, data: admins });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
const getAllAdmins = async (req, res) => {
  try {
    const admins = await User.find({ role: "ADMIN" });
    res.status(200).json({ results: admins.length, data: admins });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ role: "USER" });
    if (!users || users.length === 0) {
      return res.status(404).json({ message: "Users not found" });
    }
    res.status(200).json({ results: users.length, data: users });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

const getAllCoaches = async (req, res) => {
  try {
    const coaches = await User.find({ role: "COACH" });

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

const updateAdmin = async (req, res) => {
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

    const admin = await User.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });

    if (!admin) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(admin);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

const changePassword = async (req, res) => {
  const id = req.params.id;
  const newPassword = await bcrypt.hash(req.body.password, 10);
  const admin = await User.findOneAndUpdate(
    { _id: id },
    { password: newPassword },
    { new: true }
  );

  if (!admin) {
    return res.status(404).json({ message: "Admin not found" });
  }
  res.status(200).json({
    response: `User ${user.firstName} ${user.lastName} password has been modified`,
  });
};

const desactiveAccount = async (req, res) => {
  const id = req.params.id;
  const account = await User.findById(id);
  if (account.active === false) {
    return res.status(404).json({ message: "Account is already desactivated" });
  }

  if (!account) {
    return res.status(404).json({ message: "Account not found" });
  }

  const newAccount = await User.findOneAndUpdate(
    { _id: id },
    { active: false }
  );
  res.status(200).json({
    response: `Account ${newAccount.firstName} ${newAccount.lastName} has been descativated`,
  });
};

const reactiveAccount = async (req, res) => {
  const id = req.params.id;
  const account = await User.findById(id);
  if (account.active === true) {
    return res.status(404).json({ message: "Account is already activated" });
  }
  if (!account) {
    return res.status(404).json({ message: "Account not found" });
  }

  const newAccount = await User.findOneAndUpdate({ _id: id }, { active: true });
  res.status(200).json({
    response: `Account ${newAccount.firstName} ${newAccount.lastName} has been reativated`,
  });
};

const getUserByEmail = async (email) => {
  if (!email) {
    throw new ApiError("Email is required", 400);
  }

  const user = await User.findOne({ email });

  if (!user) {
    throw new ApiError("User not found", 404);
  }

  return user;
};

export {
  createAdmin,
  getUser,
  getAllAccounts,
  getAllAdmins,
  getAllUsers,
  getAllCoaches,
  getAllNutritionnistes,
  deleteUser,
  updateAdmin,
  changePassword,
  desactiveAccount,
  reactiveAccount,
  getUserByEmail,
};
