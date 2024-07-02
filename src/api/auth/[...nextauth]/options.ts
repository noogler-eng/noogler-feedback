import CredentialsProvider from "next-auth/providers/credentials"
import handelConnection from "@/lib/dibConnect";
import model from "@/model/user";
import bcrypt from "bcrypt"

const providers = [
  CredentialsProvider({
    id: 'Credentials',
    name: 'Credentials',

    // behind the scene nextjs form an auth page ( signin ) 
    credentials: {
        email: { label: "email", type: "email", placeholder: "email" },
        username: { label: "username", type: "text", placeholder: "username"},
        password: { label: "Password", type: "password" }
    },
    
    async authorize(credentials: any, req): Promise<any> {
        await handelConnection();

        try{
            const hashedPassword = await bcrypt.hashSync(credentials?.password || "", 10);
            const user = await model.UserModel.findOne({
                $or: [
                    {email: credentials.email},
                    {username: credentials.username}
                ],
                password: hashedPassword
            })

            if (user && user.isVeified) {
                return user;
            }
            return null
        }catch(error){
            console.log(error);
            return null;
        }
    }
  })
]

// overwriting the pages, on sign-in, it comes here
const pages = {
    signIn: '/sign-in',
}

const session = {
    strategy: "jwt",
}


const authOptions = {
    providers: providers,
    pages: pages,
    session: session,
    secret: process.env.SECRET_KEY,
    callbacks: {
        // user comes from above where we defined it
        async session({ session, user, token }: any) {
            return session
        },
        async jwt({ token, user }: any) {
            if(user){       
                const token_id = user._id.toString();         
            }
            return token
        }
    }
}

export default authOptions;