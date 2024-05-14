import app from "./app.js";

import cloudinary from "cloudinary";

app.listen(process.env.PORT, () => {
  console.log(`Server is running on Port ${process.env.PORT}`);
});
