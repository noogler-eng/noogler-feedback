import handelConnection from "@/lib/dibConnect"
import signUpSchema from "@/schemas/signupSchema"
import models from "@/model/user"
import bcrypt from "bcrypt"
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail"

// 1. request we are sending
export async function POST(request: Request, response: Response){
    await handelConnection();
    try{
        const body = await request.json();
        const isValid = signUpSchema.safeParse(body);

        if(isValid.success){

            const existedUser = await models.UserModel.find({
                username: isValid.data.username,
                isVeified: true
            })

            if(existedUser){
                return Response.json({
                    success: false,
                    message: "user already exists"
                },{
                    status: 411
                })
            }else{
                const hashedPassowrd = bcrypt.hashSync(isValid.data?.password || "", 6);
                const user = await models.UserModel.create({
                    username: isValid.data?.username,
                    email: isValid.data?.email,
                    password: hashedPassowrd
                })
                await user.save();

                await sendVerificationEmail(isValid.data.username, isValid.data.email, "12345");
            }


            
        }else{

        }


    }catch(error){
        console.log("error while singup", error);
        return Response.json({
            success: false,
            message: "error in backend server"
        },{
            status: 505
        })
    } 
}