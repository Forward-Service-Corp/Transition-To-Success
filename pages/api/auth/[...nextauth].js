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
        maxAge: (parseInt(process.env.SESSION_AUTO_LOGOUT_LENGTH_IN_MINUTES) || 1) * 60
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

                if(response === "approved" && userSearch){
                    return {
                        id: userSearch._id.toString(),
                        name: userSearch.name || '',
                        email: userSearch.email || `phone-${userSearch.phone}@credentials.local`, // Provide email for database adapter
                        phone: userSearch.phone,
                        // Add additional fields that the database adapter expects
                        emailVerified: null,
                        image: null
                    };
                }else{
                    return null;
                }
            }
        })
    ],
    pages: {
        signIn: "/auth/sign-in",
        verifyRequest: "/auth/verify-request",
    },
    // jwt: {
    //     secret: process.env.JWT_SECRET,
    // },
    secret: process.env.NEXTAUTH_SECRET,
    // url: process.env.NEXTAUTH_URL,
    callbacks: {
        async session({ session }) {
            try {
                const {db} = await connectToDatabase();
                // Try to find user by email first, then by phone if no email
                let dbUser = null;
                
                if (session.user.email) {
                    dbUser = await db.collection("users").findOne({email: session.user.email});
                } else if (session.user.phone) {
                    dbUser = await db.collection("users").findOne({phone: session.user.phone});
                } else if (user?.id) {
                    // Fallback to finding by user ID
                    const { ObjectId } = require('mongodb');
                    dbUser = await db.collection("users").findOne({_id: new ObjectId(user.id)});
                }
                
                if(dbUser){
                    session.user._id = dbUser._id;
                    session.level = dbUser.level;
                    session.user.phone = dbUser.phone;
                }
            } catch (error){
                console.error('Error fetching user from database:', error);
            }
            // session.custom = token.sub;
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
        async redirect({ url, baseUrl }) {
            // Allows relative callback URLs
            if (url.startsWith("/")) return `${baseUrl}${url}`
            // Allows callback URLs on the same origin
            else if (new URL(url).origin === baseUrl) return url
            return baseUrl
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
            
            // Set session expiration based on user level
            let dbUser = null;
            if (user.email) {
                dbUser = await db.collection("users").findOne({email: user.email});
            } else if (user.phone) {
                dbUser = await db.collection("users").findOne({phone: user.phone});
            } else if (user.id) {
                const { ObjectId } = require('mongodb');
                dbUser = await db.collection("users").findOne({_id: new ObjectId(user.id)});
            }
            
            if (dbUser && dbUser.level === 'client') {
                // For client users, set session to expire in 10 minutes
                const clientExpiry = new Date(Date.now() + (10 * 60 * 1000)); // 10 minutes
                await db.collection("sessions").updateMany(
                    { userId: dbUser._id.toString() },
                    { $set: { expires: clientExpiry } }
                );
            }
        },
    }
}

export default NextAuth(authOptions)
