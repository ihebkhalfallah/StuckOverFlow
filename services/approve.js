import User from "../modules/user.js";

export const approveUser = async (req, res) => {
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
    user.approvalCode = undefined;
    await user.save();

    res.status(200).json({ message: "User approved successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
