import NextAuth from "next-auth/next";
import { authOptions } from "@/config/auth_options"

const handler = NextAuth(authOptions);
  
export { handler as GET, handler as POST }