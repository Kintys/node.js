import multer from "multer";
import { v4 as uuidv4 } from "uuid";

const storage = multer.memoryStorage();

// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, "uploads/");
//     },
//     filename: (req, file, cb) => {
//         cb(null, `${uuidv4()}-${file.originalname}`);
//     },
// });

const upload = multer({ storage });

export default upload;
