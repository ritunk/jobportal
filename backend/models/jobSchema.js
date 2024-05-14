import mongoose from "mongoose";

const jobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "please provide job title"],
    minLength: [3, "Job title must contain at least 3 characters"],
    maxLength: [50, "job title cannot exceed 50 characters"],
  },
  description: {
    type: String,
    required: [true, "please provide job description"],
    minLength: [3, "job description must contain at least 50 characters"],
    maxLength: [50, "job description cannot exceed 50 characters"],
  },

  category: {
    type: String,
    required: [true, "job country is required"],
  },

  country: {
    type: String,
    required: [true, "Please provide a country name."],
  },

  city: {
    type: String,
    required: [true, "job city is required"],
  },

  location: {
    type: String,
    required: [true, "please provide exact location"],
    minLength: [50, "job location must contain at least 50 characters"],
  },

  fixedSalary: {
    type: Number,
    minLength: [4, "Salary must contain at least 4 digits"],
    maxLength: [9, "Salary cannot exceed 9 digits"],
  },

  salaryFrom: {
    type: Number,
    minLength: [4, "Salary must contain at least 4 digits"],
    maxLength: [9, "Salary cannot exceed 9 digits"],
  },
  salaryTo: {
    type: Number,
    minLength: [4, "Salary must contain at least 4 digits"],
    maxLength: [9, "Salary cannot exceed 9 digits"],
  },
  expired: {
    type: Boolean,
    default: false,
  },
  jobPostedOn: {
    type: Date,
    default: Date.now,
  },

  postedBy: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },
});

export const Job = mongoose.model("Job", jobSchema);
