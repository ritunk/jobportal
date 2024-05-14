import User from "../models/user.js";
import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import ErrorHandler from "../middlewares/error.js";
import { sendToken } from "../utils/jwtToken.js";

export const register = catchAsyncError(async (req, res, next) => {
  const { name, email, phone, password, role } = req.body;

  if (!name || !email || !phone || !password || !role) {
    return next(new ErrorHandler("Please fill all the details"));
  }

  const isEmail = await User.findOne({ email }); // Use User instead of user

  if (isEmail) {
    return next(new ErrorHandler("Email already exists"));
  }

  const newUser = await User.create({
    // Changed variable name to newUser
    name,
    email,
    phone,
    password,
    role,
  });

  sendToken(newUser, 200, res, "User Registerd Successfully");
});

export const login = catchAsyncError(async (req, res, next) => {
  const { email, password, role } = req.body;

  if (!email || !password || !role) {
    return next(new ErrorHandler("Please Provide all details", 400));
  }

  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    return next(new ErrorHandler("Invald Email and password", 400));
  }

  const isPasswordMatched = await user.comparePassword(password);

  if (!isPasswordMatched) {
    return next(new ErrorHandler("Invald Email and password", 400));
  }

  if (user.role !== role) {
    return next(new ErrorHandler("User with this role not found!", 400));
  }

  sendToken(user, 200, res, "User logged in successfully");
});

export const logout = catchAsyncError(async (req, res, next) => {
  res
    .status(201)
    .cookie("token", "", {
      httpOnly: true,
      expires: new Date(Date.now()),
    })

    .json({
      success: true,
      message: "User logged out successfully",
    });
});

export const getUser = catchAsyncError(async (req, res, next) => {
  const user = req.user;
  res.status(200).json({
    success: true,
    user,
  });
});
