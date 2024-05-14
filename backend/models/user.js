import mongoose from "mongoose";

import validator from "validator";

import bcrypt from "bcrypt";

import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "please provide your name"],
    minLength: [3, "Name must contain at least 3 characters"],
    maxLength: [30, "Name must contain at exceed 30  characters"],
  },

  email: {
    type: String,
    required: [true, "please provide your email"],
    validate: [validator.isEmail, "please provide valid email"],
  },

  phone: {
    type: Number,
    required: [true, "please provide your phone number"],
  },

  password: {
    type: String,
    required: [true, "please provide your password "],
    minLength: [8, "password cannot be less than 8 characters"],
    maxLength: [32, "password cannot be more than  30 characters"],
    select: false,
  },

  role: {
    type: String,
    required: [true, "please provide your role "],
    enum: ["Job Seeker", "Employer"],
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

//Hashing the password

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }

  this.password = await bcrypt.hash(this.password, 10);
});

// COMPARING PASSWORD

userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// generating the jwt token for authorization

userSchema.methods.getJWTToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

export default mongoose.model("User", userSchema);
