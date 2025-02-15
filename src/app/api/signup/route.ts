import handelConnection from "@/lib/dbConnect"
import signUpSchema from "@/schemas/signupSchema"
import model from "@/model/user"
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

            const existingVerifiedUser = await model.UserModel.findOne({
                username: isValid.data.username,
                isVeified: true
            })

            console.log(existingVerifiedUser)
            if(existingVerifiedUser){
                return Response.json({
                    success: false,
                    message: "username already exists"
                },{ status: 400 })
            }else{

                // find will give us an array of entity
                // findOne will gives us an user or single entity
                const exisitingUserByEmail = await model.UserModel.findOne({
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
                    try{
                        const user = await model.UserModel.create({
                            username: isValid.data?.username,
                            email: isValid.data?.email,
                            password: hashedPassowrd,
                            verifyCodeExpiry: expiryDate,
                            isVeified: false,
                            verifyCode: verifyCode,
                            isAccepting: true,
                            message: []
                        })
                        await user.save();
                        toVerifyUser = user;
                    }catch(error){
                        console.log("---", error);
                    }
                }

                // send verification email
                const emailRes = await sendVerificationEmail(isValid.data.email, isValid.data.username, toVerifyUser.verifyCode);
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