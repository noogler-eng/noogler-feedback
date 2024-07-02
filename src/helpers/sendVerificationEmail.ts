import resend from "@/lib/resend";
import EmailTemplate from "../../emails/verificationEmail";
import { response } from "@/types/apiResponse";

export async function sendVerificationEmail(
    email: string,
    username: string,
    verificationCode: string
): Promise<response>{
    try{
        await resend.emails.send({
            from: 'Acme <onboarding@resend.dev>',
            to: [email],
            subject: 'feedback | verification email',
            react: EmailTemplate({ firstName: username, verificationCode: verificationCode }),
        });
      
        return {
            success: true,
            message: 'verification email sent susscessfully'
        }
    }catch(error){
        console.log('error while sending verification email: ',error);
        return {
            success: false,
            message: 'failed to send verification email'
        }
    }
}