import { body } from "express-validator";
// class ProductValidator {
//     static productSchema = {
//         "data.title": {
//             in: ["body"],
//             isString: true,
//             notEmpty: {
//                 errorMessage: "Product title is required",
//             },
//             trim: true,
//             escape: true,
//         },
//         discount: {
//             in: ["body"],
//             trim: true,
//             escape: true,
//         },
//         brand: {
//             in: ["body"],
//             isString: true,
//             notEmpty: {
//                 errorMessage: "Brand is required",
//             },
//             trim: true,
//             escape: true,
//         },
//         oldPrice: {
//             in: ["body"],
//             trim: true,
//             escape: true,
//         },
//         newPrice: {
//             in: ["body"],
//             isNumeric: { errorMessage: "Must be number value" },
//             isInt: { min: 1 },
//             trim: true,
//             escape: true,
//         },
//         description: {
//             in: ["body"],
//             isString: true,
//             isLength: {
//                 options: { min: 10 },
//                 errorMessage: "Description must be at least 10 characters long",
//             },
//             trim: true,
//             escape: true,
//         },
//         evaluation: {
//             in: ["body"],
//             isNumeric: { errorMessage: "Must be number value" },
//             isInt: { min: 1 },
//             trim: true,
//             escape: true,
//         },
//         images: {
//             custom: {
//                 options: (value, { req }) => {
//                     if (req.files.length < 4) throw new Error("You must upload at least 4 images");
//                 },
//             },
//         },
//     };
// }
// export default ProductValidator;
const validationSchema = [
    body("data.title")
        .isString()
        .withMessage("Product title must be a string")
        .notEmpty()
        .withMessage("Product title is required")
        .trim()
        .escape(),
    body("data.discount").optional().trim().escape(),
    body("data.brand")
        .isString()
        .withMessage("Brand must be a string")
        .notEmpty()
        .withMessage("Brand is required")
        .trim()
        .escape(),
    body("data.oldPrice").optional().trim().escape(),
    body("data.newPrice")
        .isNumeric()
        .withMessage("Must be a numeric value")
        .isInt({ min: 1 })
        .withMessage("Price must be at least 1")
        .trim()
        .escape(),
    body("data.description")
        .isString()
        .withMessage("Description must be a string")
        .isLength({ min: 10 })
        .withMessage("Description must be at least 10 characters long")
        .trim()
        .escape(),
    body("data.evaluation")
        .isNumeric()
        .withMessage("Evaluation must be a numeric value")
        .isInt({ min: 1 })
        .withMessage("Evaluation must be at least 1")
        .trim()
        .escape(),
    body("images").custom((value, { req }) => {
        if (!req.files || req.files.length < 4) {
            throw new Error("You must upload at least 4 images");
        }
        return true;
    }),
];
export default validationSchema;
