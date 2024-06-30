import zod from "zod";

const acceptMessageSchema = zod.object({
    acceptMessage: zod.boolean()
})

export default acceptMessageSchema;