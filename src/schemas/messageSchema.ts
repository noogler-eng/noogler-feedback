import zod from "zod";

const messageSchema = zod.object({
    content: zod.string()
        .min(20, {
            message: "content must be atleast 20 characters"
        })
        .max(300, {
            message: "content must be no longer then 300 characters"
        })
})

export default messageSchema;