import mongoose from "mongoose";
import bcrypt from "bcrypt";

const { Schema, model } = mongoose;

const userSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    nickName: {
      type: String,
      required: true,
      unique: true,
    },
    birthDate: {
      type: Date,
      required: true,
    },
    role: {
      type: String,
      enum: ["ADMIN", "COACH", "NUTRITIONNISTE", "USER"],
      default: "USER",
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    adresse: {
      type: String,
    },
    phoneNumber: {
      type: Number,
      unique: true,
    },
    weight: {
      type: Number,
    },
    height: {
      type: String,
    },
    rating: {
      type: String,
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

export default model("User", userSchema);
