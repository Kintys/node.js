// Задача. Додати до попереднього ДЗ проєкту валідацію даних.
class CarsValidator {
    static carsSchema = {
        name: {
            notEmpty: {
                errorMessage: "Name is required",
            },
            isString: {
                errorMessage: "Model must be a string",
            },
            isLength: {
                options: {
                    min: 4,
                    max: 10,
                },
                errorMessage: "Minimum length is 4 to 10 characters",
            },
            trim: true,
            escape: true,
        },
        price: {
            notEmpty: {
                errorMessage: "Price is required",
            },
            isNumeric: {
                errorMessage: "Price must be a number",
            },
            isInt: {
                options: {
                    min: 100,
                },
                errorMessage: "Price must be at least 100",
            },
            trim: true,
            escape: true,
        },
        dataRelease: {
            notEmpty: {
                errorMessage: "Date is required",
            },
            trim: true,
            escape: true,
        },
        description: {
            notEmpty: {
                errorMessage: "Description is required",
            },
            isString: {
                errorMessage: "Model must be a string",
            },
            isLength: {
                options: {
                    min: 10,
                },
                errorMessage: "Minimum length is 10 characters",
            },
            trim: true,
            escape: true,
        },
        img: {
            custom: {
                options: (value, { req }) => {
                    if (!req.file) throw new Error("Image is required");
                    return true;
                },
            },
        },
    };
}
export default CarsValidator;
