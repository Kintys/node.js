class CourseValidator {
    static courseSchema = {
        title: {
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
        lifeTime: {
            notEmpty: {
                errorMessage: "Price is required",
            },
            isNumeric: {
                errorMessage: "Price must be a number",
            },
            trim: true,
            escape: true,
        },
        student: {
            notEmpty: {
                errorMessage: "Price is required",
            },
        },
        trim: true,
        escape: true,
    };
}
export default CourseValidator;
