import handelConnection from "@/lib/dibConnect"
import signUpSchema from "@/schemas/signupSchema"
import models from "@/model/user"
import bcrypt from "bcrypt"
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail"
import { trusted } from "mongoose"

// 1. request we are sending
export async function POST(request: Request, response: Response){
    await handelConnection();
    try{
        const body = await request.json();
        const isValid = signUpSchema.safeParse(body);
        if(isValid.success){

            const existingVerifiedUser = await models.UserModel.find({
                username: isValid.data.username,
                isVeified: trusted
            })

            if(existingVerifiedUser){
                return Response.json({
                    success: false,
                    message: "username already exists"
                },{ status: 400 })
            }else{

                // find will give us an array of entity
                // findOne will gives us an user or single entity
                const exisitingUserByEmail = await models.UserModel.findOne({
                    email: isValid.data.email,
                })

                const hashedPassowrd = bcrypt.hashSync(isValid.data?.password || "", 10);
                const expiryDate: Date = new Date();
                const verifyCode = String(100000 + Math.floor(Math.random() * 900000));
                expiryDate.setHours(expiryDate.getHours() + 3600).toString();

                let toVerifyUser;
                // user is not verified byt exists, checking with email
                if(exisitingUserByEmail){
                    toVerifyUser = exisitingUserByEmail;
                    exisitingUserByEmail.password = hashedPassowrd;
                    exisitingUserByEmail.verifyCodeExpiry = expiryDate;
                    exisitingUserByEmail.verifyCode = verifyCode;
                    await exisitingUserByEmail.save();
                }else{
                    const user = await models.UserModel.create({
                        username: isValid.data?.username,
                        email: isValid.data?.email,
                        password: hashedPassowrd,
                        verifyCodeExpiry: expiryDate,
                        verifyCode: verifyCode,
                        isVeified: false,
                        isAccepting: true,
                        message: []
                    })
                    await user.save();
                    toVerifyUser = user;
                }

                // send verification email
                const emailRes = await sendVerificationEmail(isValid.data.username, isValid.data.email, toVerifyUser.verifyCode);
                if(emailRes.success){
                    return Response.json({
                        success: true,
                        message: "user registered succesfully"
                    },{ status: 201 })
                }else{
                    return Response.json({
                        success: false,
                        message: emailRes.message
                    },{ status: 500 })
                }
            }
        }else{
            return Response.json({
                success: false,
                message: "Invalid credentials"
            },{ status: 403 })
        }
    }catch(error){
        console.log("error while singup", error);
        return Response.json({
            success: false,
            message: "error in backend server"
        },{ status: 500 })
    } 
}