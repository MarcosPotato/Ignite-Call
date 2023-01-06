import { NextApiRequest, NextApiResponse } from "next";
import { NextAuthOptions } from "next-auth";
import NextAuth from "next-auth/next";
import GoogleProvider, { GoogleProfile } from "next-auth/providers/google"
import { PrismaAdapter } from "../../../lib/next-auth/prisma-adapter";

export const buildNextAuthOptions = (
    req: NextApiRequest, 
    res: NextApiResponse
): NextAuthOptions => {
    return{
        adapter: PrismaAdapter(req, res),
        providers: [
            GoogleProvider({
                clientId: process.env.GOOGLE_CLIENT_ID as string,
                clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
                authorization: {
                    params: {
                        scope: "https://www.googleapis.com/auth/admin.directory.resource.calendar https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile"
                    }
                },
                profile(profile: GoogleProfile){
                    return{
                        id: profile.sub,
                        name: profile.name,
                        fullname: profile.name,
                        username: "",
                        email: profile.email,
                        avatar_url: profile.picture
                    }
                }
            })
        ],
        callbacks: {
            async signIn({ account }){
                if(!account?.scope?.includes("https://www.googleapis.com/auth/admin.directory.resource.calendar")){
                    return "/register/connect-calendar?error=permissions"
                }
    
                return true
            }
        }
    }
}

/* export default NextAuth(authOptions) */

export default async function auth(req: NextApiRequest, res: NextApiResponse){
    return await NextAuth(req, res, buildNextAuthOptions(req, res))
}