import mongoose, {Schema, Document} from "mongoose";

export interface Message extends Document{
    content: string,
    createdAt: Date
}

export interface User extends Document{
    username: string,
    email: string,
    password: string,
    verifyCode: string,
    isVeified: boolean,
    verifyCodeExpiry: Date,
    isAccepting: boolean,
    message: Message[]
}

const messageSchema: Schema<Message> = new Schema({
    content: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        required: true
    }
})

const userSchema: Schema<User> = new Schema({
    username: {
        type: String,
        required: [true, "username is required"],
        unique: true
    },
    email: {
        type: String,
        required: [true, "email is required"],
        unique: true,
        match: [/.+\@.+\..+/, 'please use a valid email']
    },
    password: {
        type: String,
        required: [true, 'password is required']
    },
    verifyCode: {
        type: String,
        required: true
    },
    isVeified: {
        type: Boolean,
        default: false,
        required: true
    },
    verifyCodeExpiry: {
        type: Date,
        required: true
    },
    isAccepting: {
        type: Boolean,
        required: true,
        default: true
    },
    message: {
        type: [messageSchema]
    }
})


const UserModel = (mongoose.models.User as mongoose.Model<User>) || (mongoose.model<User>("User", userSchema))
const MessageModel = (mongoose.models.User as mongoose.Model<User>) || (mongoose.model<Message>("Message", messageSchema))

export default { UserModel, MessageModel };