import multer from "multer";
import path from "path";
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // cb(null, path.join( "/var/www/uploads"));
    cb(null, path.join(process.cwd(), "uploads"));
  },
  filename: async function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

// upload single image
const uploadprofileImage = upload.single("profileImage");
const uploadPackageImage = upload.single("packageImage");
const uploadServiceImage = upload.single("serviceImage");
const uploadPortifiloImage = upload.single("portifolioImage");
// const uploadPortifiloImages = upload.fields([
//   { name: "companyLogo", maxCount: 1 }, // Single file for company logo
//   { name: "companyImages", maxCount: 10 }, // Multiple files for company images
// ]);

// upload multiple image
const uploadRiderVehicleInfo = upload.fields([
  { name: "vehicleRegistrationImage", maxCount: 1 },
  { name: "vehicleInsuranceImage", maxCount: 1 },
  { name: "drivingLicenceImage", maxCount: 1 },
]);

export const fileUploader = {
  upload,
  uploadprofileImage,
  uploadRiderVehicleInfo,
  uploadPackageImage,
  uploadServiceImage,
  uploadPortifiloImage,
};
