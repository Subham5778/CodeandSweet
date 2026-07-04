import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
<<<<<<< HEAD
  api_secret: process.env.API_SECRET
});

export default cloudinary;
=======
  api_secret: process.env.API_SECRET,
});

export default cloudinary;
>>>>>>> d9f7208 (Redesign the webpage)
