class UserValidator {
    static userSchema = {
        email: {
            isEmail: {
                errorMessage: "Invalid email address",
            },
            normalizeEmail: true,
        },
        password: {
            isLength: {
                options: { min: 6 },
                errorMessage: "Password must be at least 6 characters long",
            },
        },
        age: {
            isInt: {
                options: { min: 18, max: 120 },
                errorMessage: "Age must be between 18 and 120",
            },
            toInt: true,
        },
        name: {
            notEmpty: {
                errorMessage: "Name is required",
            },
            isLength: {
                options: { min: 3 },
                errorMessage: "Username must be at least 3 characters long",
            },
            trim: true,
            escape: true,
        },
    };
}
export default UserValidator;
