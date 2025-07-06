const multer = require("multer");

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  if (file.mimetype.split("/")[0] === "image") {
    cb(null, true);
  } else {
    cb(new multer.MulterError("LIMIT_UNEXPECTED_FILE"), false);
  }
};

const uploadMultiple = multer({
  storage,
  fileFilter,
  limits: { fileSize: 9000000, files: 5 }, //9MB max of five files max
});

module.exports = uploadMultiple;
//SAMPLE USAGE
// router
//   .route("/upload-multi")
//   .post(uploadMultiple.array("image"), usersController.uploadFile);

/*DO NOT DELETE */
// const upload = multer({ dest: "uploads/" });

// image is the file name coming from the fe
// router
//   .route("/upload")
//   .post(upload.single("image"), usersController.uploadFile);

//multiple upload with different keys
// const multiUpload = upload.fields([
//   { name: "avatar", maxCount: 1 },
//   { name: "resume", maxCount: 1 },
// ]);

// router.route("/upload-multi-key").post(multiUpload, usersController.uploadFile);

//multiple upload with the same key called image
//custom file name
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     //specify where to send file to
//     cb(null, "uploads/");
//   },
//   filename: (req, file, cb) => {
//     //uuid-originalName for file name format as an example
//     const { originalname } = file;
//     cb(null, `${uuid()} - ${originalname}`);
//   },
// });
