import CredentialsProvider from "next-auth/providers/credentials";
import model from "@/model/user"
import bcrypt from "bcrypt"
import { AuthOptions } from "next-auth";
import handelConnection from "@/lib/dbConnect";

export const authOptions: AuthOptions = {
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            
            credentials: {
              username: { label: "Username", type: "text", placeholder: "username" },
              password: { label: "Password", type: "password" }
            },
            async authorize(credentials: any, req): Promise<any> {
                await handelConnection();
                try{
                    const hashedPassword = await bcrypt.hashSync(credentials?.password || "", 10);
                    const user = await model.UserModel.findOne({
                        $or: [
                            {email: credentials.username},
                            {username: credentials.username}
                        ],
                        password: hashedPassword
                    })
                
                    if (user && user.isVeified) {
                        return user
                    }
                    return null
                }catch(error: any){
                    console.log(error);
                    return null;
                }
            }    
          })
    ],
    session: {
        strategy: "jwt",
    },
    pages: {
        signIn: "/signin",
    },
    secret: process.env.AUTH_SECRET,
}