import multer from "multer";

// Store in memory — we pipe directly to Cloudinary, no disk writes
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
        cb(null, true);
    } else {
        cb(new Error("Only image files are allowed."), false);
    }
};

const upload = multer({
    storage,
    limits: {
        fileSize: 5 * 1024 * 1024,   // 5MB per file
        files: 10,
    },
    fileFilter,
});

export default upload;