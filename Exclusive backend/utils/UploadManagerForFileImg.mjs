import multer from "multer";
import { v4 as uuidv4 } from "uuid";
// Налаштовуємо місце збереження файлів та їх імена
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "images");
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname + "-" + uuidv4());
    },
});
const upload = multer({ storage });

export default upload;
