import resend from "@/lib/resend";
import EmailTemplate from "../../emails/verificationEmail";

export async function sendVerificationEmail(
    email: string,
    username: string,
    verificationCode: string
): Promise<any>{
    try{
        const res = await resend.emails.send({
            from: 'Acme <onboarding@resend.dev>',
            to: [email],
            subject: 'feedback | verification email',
            react: EmailTemplate({ firstName: username, verificationCode: verificationCode }),
        });
        console.log(email, res);
        let isSuccess = false;
        if(res.data){
            isSuccess = true
        }

        return {
            success: isSuccess,
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