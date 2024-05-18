import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import ErrorHandler from "../middlewares/error.js";
import { Job } from "../models/jobSchema.js";
import { Application } from "../models/applicationSchema.js";

export const getAllJobs = catchAsyncError(async (req, res, next) => {
  console.log("getAllJobs function called"); // Debugging line

  let jobs;

  if (req.user) {
    console.log("User is authenticated:", req.user); // Debugging line

    try {
      // Find all applications that the user has applied for
      const applications = await Application.find({
        "applicantID.user": req.user._id,
      });

      console.log("User Applications:", applications); // Debugging line

      if (!applications.length) {
        console.log("No applications found for user"); // Debugging line
      }

      // Extract job IDs from these applications
      const appliedJobIds = applications.map(
        (application) => application.jobID
      );

      console.log("Applied Job IDs:", appliedJobIds); // Debugging line

      // Find all jobs excluding those the user has already applied for
      jobs = await Job.find({
        expired: false,
        _id: { $nin: appliedJobIds },
      });

      console.log("Filtered Jobs:", jobs); // Debugging line
    } catch (error) {
      console.error(
        "Error occurred while fetching applications or jobs:",
        error
      );
      return next(
        new ErrorHandler("An error occurred while fetching jobs", 500)
      );
    }
  } else {
    // If the user is not authenticated, show all jobs
    console.log("User is not authenticated"); // Debugging line
    try {
      jobs = await Job.find({ expired: false });
    } catch (error) {
      console.error("Error occurred while fetching jobs:", error);
      return next(
        new ErrorHandler("An error occurred while fetching jobs", 500)
      );
    }
  }

  res.status(200).json({
    success: true,
    jobs,
  });
});

export const postJob = catchAsyncError(async (req, res, next) => {
  const { role } = req.user;

  if (role === "Job Seeker") {
    return next(
      new ErrorHandler(
        "Job seeker is not allowed to access this resources",
        400
      )
    );
  }

  const {
    title,
    description,
    category,
    country,
    city,
    location,
    fixedSalary,
    salaryFrom,
    salaryTo,
  } = req.body;

  if (!title || !description || !category || !country || !city || !location) {
    return next(new ErrorHandler("please provide full job details", 400));
  }

  if ((!salaryFrom || !salaryTo) && !fixedSalary) {
    return next(
      new ErrorHandler("please either provide fixed salary or ranged salary")
    );
  }

  if (salaryFrom && salaryTo && fixedSalary) {
    return next(
      new ErrorHandler("cannot enter fixed salary and ranged salary together!!")
    );
  }

  const postedBy = req.user._id;

  const job = await Job.create({
    title,
    description,
    category,
    country,
    city,
    location,
    fixedSalary,
    salaryFrom,
    salaryTo,
    postedBy,
  });

  res.status(200).json({
    success: true,
    message: "Job Posted successfully",
    job,
  });
});

export const getMyJobs = catchAsyncError(async (req, res, next) => {
  const { role } = req.user;

  if (role == "Job Seeker") {
    return next(
      new ErrorHandler("Job Seeker not allowed to access this resource", 400)
    );
  }

  const myJobs = await Job.find({ postedBy: req.user._id });

  res.status(200).json({
    success: true,
    myJobs,
  });
});

export const updateJob = catchAsyncError(async (req, res, next) => {
  const { role } = req.user;

  if (role == "Job Seeker") {
    return next(
      new ErrorHandler("Job Seeker not allowed to access this resource.", 400)
    );
  }

  const { id } = req.params;

  let job = await Job.findById(id);

  if (!job) {
    return next(new ErrorHandler("oops! job not found", 404));
  }

  job = await Job.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
    message: "Job Updated Successfully",
  });
});

export const deleteJob = catchAsyncError(async (req, res, next) => {
  const { role } = req.user;

  if (role == "Job Seeker") {
    return next(
      new ErrorHandler("Job Seeker not allowed to access this resource.", 400)
    );
  }

  const { id } = req.params;

  const job = await Job.findById(id);

  if (!job) {
    return next(new ErrorHandler("OOPS! Job not found.", 404));
  }

  await job.deleteOne();

  res.status(200).json({
    success: true,
    message: "Job Deleted",
  });
});

export const getSinglejob = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;

  try {
    const job = await Job.findById(id);

    if (!job) {
      return next(new ErrorHandler("Job not found", 404));
    }

    res.status(200).json({
      success: true,
      job,
    });
  } catch (error) {
    return next(new ErrorHandler("Invalid ID/ CastError", 400));
  }
});
