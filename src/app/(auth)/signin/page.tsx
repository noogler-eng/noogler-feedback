import Login from "@/components/LoginForm";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/config/auth_options";
import { redirect } from "next/navigation";


export default async function SignIn(){
    const session = await getServerSession(authOptions);

    if (session) {
        return redirect("/");
    }

    return <div>
        <Login/>
    </div>
}