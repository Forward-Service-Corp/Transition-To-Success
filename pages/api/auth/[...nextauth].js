import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import EmailProvider from "next-auth/providers/email"
import Credentials from "next-auth/providers/credentials";
import {MongoDBAdapter} from "@next-auth/mongodb-adapter"
import clientPromise from "../../../lib/mongodb"
import {connectToDatabase} from "../../../lib/dbConnect";
import { generatePhoneSearchPatterns } from "../../../lib/phoneUtils";

// Helper function for fuzzy phone user lookup
async function findUserByPhone(db, phoneNumber) {
    if (!phoneNumber) return null;

    const searchPatterns = generatePhoneSearchPatterns(phoneNumber);
    const searchQueries = searchPatterns.map(pattern => ({ phone: pattern }));

    return await db.collection("users").findOne({ $or: searchQueries });
}

export const authOptions = {
    adapter: MongoDBAdapter(clientPromise),
    session: {
        strategy: "jwt", // Use JWT for all sessions to support credentials provider
        maxAge: (parseInt(process.env.SESSION_AUTO_LOGOUT_LENGTH_IN_MINUTES) || 30) * 60, // Default 30 minutes
        updateAge: 24 * 60 * 60, // Update session every 24 hours
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

                // Use fuzzy phone matching
                const userSearch = await findUserByPhone(db, phone);

                if(response === "approved" && userSearch){
                    const userObject = {
                        id: userSearch._id.toString(),
                        name: userSearch.name || '',
                        email: userSearch.email || `phone-${userSearch.phone}@credentials.local`,
                        phone: userSearch.phone,
                        emailVerified: null,
                        image: null
                    };
                    return userObject;
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
    jwt: {
        secret: process.env.JWT_SECRET,
        // maxAge: (parseInt(process.env.SESSION_AUTO_LOGOUT_LENGTH_IN_MINUTES) || 30) * 60, // Match session maxAge
    },
    secret: process.env.NEXTAUTH_SECRET,
    // url: process.env.NEXTAUTH_URL,
    callbacks: {
        async session({ session, token }) {

            // Pass user data from JWT token to session
            if (token.user) {
                session.user = {
                    ...session.user,
                    ...token.user
                };
                session.level = token.user.level;
            }

            return session;
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
                // Use fuzzy phone matching
                const userSearch = await findUserByPhone(db, credentials.phone);
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
        async jwt({ token, user, account }) {

            // If user is present (sign in), add user data to token
            if (user && account) {
                token.user = user;
                token.accountType = account.type;

                // Fetch user data from database
                try {
                    const {db} = await connectToDatabase();
                    let dbUser = null;

                    if (account.type === 'credentials') {
                        // For phone-based auth, look up by phone using fuzzy matching
                        if (user.phone) {
                            dbUser = await findUserByPhone(db, user.phone);
                        } else if (user.email && user.email.includes('@credentials.local')) {
                            const phoneMatch = user.email.match(/phone-([^@]+)@credentials\.local/);
                            if (phoneMatch) {
                                dbUser = await findUserByPhone(db, phoneMatch[1]);
                            }
                        }
                    } else {
                        // For email/OAuth, look up by email
                        dbUser = await db.collection("users").findOne({email: user.email});
                    }

                    if (dbUser) {
                        token.user._id = dbUser._id.toString();
                        token.user.level = dbUser.level;
                        token.user.phone = dbUser.phone;
                        token.user.name = dbUser.name || user.name;
                    }
                } catch (error) {
                    console.error('Error fetching user data for JWT:', error);
                }
            }

            return token;
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
                        // "name": "",
                        // "county": [],
                        // "homeCounty": "",
                        // "programs": []
                    }
                })
            }
            
            // Note: With JWT session strategy, session expiration is handled by JWT maxAge
        },
    }
}

export default NextAuth(authOptions)
