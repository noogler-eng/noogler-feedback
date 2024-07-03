import mongoose, { Schema } from "mongoose";

const messageSchema = new Schema({
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

const userSchema = new Schema({
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

// mongoose check first if the model exists or not 
const UserModel = mongoose.models.User || mongoose.model("User", userSchema)
const MessageModel = mongoose.models.Message || mongoose.model("Message", messageSchema)

export default { UserModel, MessageModel };