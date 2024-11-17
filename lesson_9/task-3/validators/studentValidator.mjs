class StudentValidator {
    static studentSchema = {
        name: {
            notEmpty: {
                errorMessage: "Name is required",
            },
            isString: {
                errorMessage: "Model must be a string",
            },
            trim: true,
            escape: true,
        },
        age: {
            notEmpty: {
                errorMessage: "Age is required",
            },
            isNumeric: {
                errorMessage: "Age must be a number",
            },
            isInt: {
                options: {
                    min: 17,
                    max: 100,
                },
                errorMessage: "Age must be at least 100",
            },
            trim: true,
            escape: true,
        },
        averageMark: {
            notEmpty: {
                errorMessage: "Average Mark is required",
            },
            isNumeric: {
                errorMessage: "Average Mark must be a number",
            },
            isInt: {
                options: {
                    min: 10,
                },
                errorMessage: "Average Mark must be at least 10",
            },
        },
        trim: true,
        escape: true,
    };
}
export default StudentValidator;
