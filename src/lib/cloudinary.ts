// cloudinary.ts
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (file: Blob): Promise<string | null> => {
  if (!file) {
    return null;
  }
  try {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { resource_type: "auto" },
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result?.secure_url ?? null);
          }
        },
      );
      uploadStream.end(buffer);
    });
  } catch (error) {
    console.log(error);
    return null;
  }
};

export default uploadOnCloudinary;





// // cloudinary.ts
// import { v2 as cloudinary } from "cloudinary";

// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET,
// });

// const uploadOnCloudinary = async (file: Blob): Promise<string | null> => {
//   if (!file) {
//     console.log("❌ No file provided to uploadOnCloudinary");
//     return null;
//   }

//   // ✅ Debug: check env vars
//   console.log("🔍 Cloudinary config check:", {
//     cloud_name: process.env.CLOUDINARY_CLOUD_NAME ?? "❌ MISSING",
//     api_key: process.env.CLOUDINARY_API_KEY ? "✅ set" : "❌ MISSING",
//     api_secret: process.env.CLOUDINARY_API_SECRET ? "✅ set" : "❌ MISSING",
//   });

//   try {
//     console.log("📦 Converting file to buffer...");
//     const arrayBuffer = await file.arrayBuffer();
//     const buffer = Buffer.from(arrayBuffer);
//     console.log(`✅ Buffer ready, size: ${buffer.length} bytes`);

//     return new Promise((resolve, reject) => {
//       console.log("🚀 Starting Cloudinary upload stream...");

//       const uploadStream = cloudinary.uploader.upload_stream(
//         { resource_type: "auto" },
//         (error, result) => {
//           if (error) {
//             console.error("❌ Cloudinary upload error:", error);
//             reject(error);
//           } else {
//             console.log("✅ Cloudinary upload success:", result?.secure_url);
//             resolve(result?.secure_url ?? null);
//           }
//         },
//       );

//       uploadStream.end(buffer);
//     });
//   } catch (error) {
//     console.error("❌ Unexpected error in uploadOnCloudinary:", error);
//     return null;
//   }
// };

// export default uploadOnCloudinary;