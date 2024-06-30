import { Message } from "@/model/user"

export interface response {
    success: boolean,
    message: string,
    isAcceptingMessage?: boolean,
    messages?: Array<Message>
}