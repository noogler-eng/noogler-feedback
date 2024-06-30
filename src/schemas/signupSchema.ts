import zod from "zod";

const signUpSchema = zod.object({
    username: zod.string()
        .min(5, "username must be at least of 5 characters")
        .max(10, "username must be max of 10 characters")
        .regex(/^[a-zA-Z0-9]+$/, "username must not contain any special character"),
    email: zod.string()
        .email({
            message: "invalid email"
        }),
    password: zod
        .string()
        .length(6, {
            message: "length must be of 6 letters"
        })
})

export default signUpSchema;