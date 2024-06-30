import zod from "zod";

const signInSchema = zod.object({
    email: zod.string()
        .email({
            message: "Invalid email"
        }),
    password: zod.string()
        .length(6)
})

export default signInSchema;