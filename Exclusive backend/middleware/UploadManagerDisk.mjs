import multer from "multer";
import { v4 as uuidv4 } from "uuid";
import { validationResult } from "express-validator";
// Налаштовуємо місце збереження файлів та їх імена

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads");
    },
    filename: function (req, file, cb) {
        cb(null, uuidv4() + "-" + file.originalname);
    },
});
const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            cb(new Error("Error"), false);
        }

        if (file.mimetype.startsWith("image/")) {
            cb(null, true);
        } else {
            cb(new Error("Not an image! Please upload an image."), false);
        }
    },
});

export default upload;
