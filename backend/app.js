import express from "express";

import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import fileUpload from "express-fileupload";

import userRouter from "./routes/userRouter.js";
import applicationRouter from "./routes/applicationRouter.js";
import jobRouter from "./routes/jobRouter.js";
import { dbConnection } from "./database/dbConnection.js";

import cors from "cors";
import { errorMiddleware } from "./middlewares/error.js";

const app = express();

dotenv.config({ path: "./config/config.env" });

app.use(
  cors({
    origin: [process.env.FRONTEND_URL],
    methods: ["GET", "POST", "DELETE", "PUT"],
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);

app.use("/api/v1/user", userRouter);
app.use("/api/v1/job", jobRouter);
app.use("/api/v1/application", applicationRouter);
// app.use((req, res, next) => {
//   // Mock user for testing
//   req.user = { _id: "66463e6d4696e0fea1938816" }; // Example user ID
//   next();
// });

dbConnection();

app.use(errorMiddleware);

export default app;

// import express from "express";
// import dotenv from "dotenv";
// import cookieParser from "cookie-parser";
// import busboy from "busboy";
// import path from "path";
// import fs from "fs";

// import userRouter from "./routes/userRouter.js";
// import applicationRouter from "./routes/applicationRouter.js";
// import jobRouter from "./routes/jobRouter.js";
// import { dbConnection } from "./database/dbConnection.js";
// import cors from "cors";
// import { errorMiddleware } from "./middlewares/error.js";
// import { postApplication } from "./controllers/applicationController.js";

// const app = express();

// dotenv.config({ path: "./config/config.env" });

// app.use(
//   cors({
//     origin: [process.env.FRONTEND_URL],
//     methods: ["GET", "POST", "DELETE", "PUT"],
//     credentials: true,
//   })
// );

// app.use(cookieParser());
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// // Existing routers
// app.use("/api/v1/user", userRouter);
// app.use("/api/v1/job", jobRouter);
// app.use("/api/v1/application", applicationRouter);

// // Database connection
// dbConnection();

// // Error handling middleware
// app.use(errorMiddleware);

// // Integrate busboy with /api/v1/application/post route
// // app.post("/api/v1/application/post", postApplication);

// export default app;
