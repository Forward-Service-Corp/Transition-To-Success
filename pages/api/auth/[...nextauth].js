import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import EmailProvider from "next-auth/providers/email"
import Credentials from "next-auth/providers/credentials";
import {MongoDBAdapter} from "@next-auth/mongodb-adapter"
import clientPromise from "../../../lib/mongodb"
import {connectToDatabase} from "../../../lib/dbConnect";

export const authOptions = {
    adapter: MongoDBAdapter(clientPromise),
    session: {
        strategy: "database",
        maxAge: 600000
    },
    providers: [
        EmailProvider({
            server: process.env.EMAIL_SERVER,
            from: process.env.EMAIL_FROM
        }),
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET
        }),
        Credentials({
            name: "Credentials",
            credentials: {
                phone: {label: "Phone", type: "text", placeholder: "phone"},
                response: {label: "Response", type: "text"}
            },
            async authorize(credentials) {
                const {phone, response} = credentials;
                const {db} = await connectToDatabase()
                const userSearch = await db
                    .collection("users")
                    .findOne({phone: phone})

                if(response === "approved"){
                    // If no error and we have user data, return it
                    return {
                        id: userSearch._id.toString(),
                        name: userSearch.name,
                        email: userSearch.email,
                    }
                }else{
                    return null
                }
            }
        })
    ],
    pages: {
        signIn: "/auth/sign-in",
        verifyRequest: "/auth/verify-request",
    },
    secret: process.env.NEXTAUTH_SECRET,
    // url: process.env.NEXTAUTH_URL,
    callbacks: {
        async session({ session, user }) {
            try {
                const {db} = await connectToDatabase();
                const dbUser = await db.collection("users").findOne({email: session.user.email})
                    .catch(er => console.error(er));
                if(dbUser){
                    session.user._id = dbUser._id;
                    session.level = dbUser.level;
                }
            } catch (error){
                console.error('Error fetching user from database:', error);
            }
            // In database strategy, user object contains the database user info
            session.custom = user?.id;
            return session
        },
        async signIn({ user, account, credentials }){
            const {db} = await connectToDatabase()
            if (account.type === "email") {
                const userSearch = await db.collection("users").findOne({email: user.email})
                if(userSearch){
                    return true
                } else {
                    return "/api/auth/no-account"
                }
            } else if(account.type === "credentials") {
                const userSearch = await db.collection("users").findOne({phone: credentials.phone})
                if(userSearch){
                    return true
                } else {
                    return "/api/auth/no-account"
                }
            } else if(account.type === "oauth") {
                const userSearch = await db.collection("users").findOne({email: user.email})
                if(userSearch){
                    return true
                } else {
                    return "/auth/no-account"
                }
            }
        },
    },
    events: {
        signIn: async ({user, isNewUser}) => {
            const {db} = await connectToDatabase()
            if (isNewUser) {
                const userEmail = user.email
                const isFSCEmail = user.email.indexOf("fsc-corp.org") > -1

                await db.collection("users").updateOne({"email": userEmail}, {
                    $set: {
                        "level": isFSCEmail ? "coach" : "client",
                        "name": "",
                        "county": [],
                        "homeCounty": "",
                        "programs": []
                    }
                })
            }
        },
    }
}

export default NextAuth(authOptions)
