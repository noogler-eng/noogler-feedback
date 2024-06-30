import zod from "zod";

const verifySchema = zod.object({
    verifyCode: zod.string()
        .length(6, {
            message: "check the length of verification code"
        })
})

export default verifySchema;