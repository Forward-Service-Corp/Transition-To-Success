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
        strategy: "jwt", // Use JWT for all sessions to support credentials provider
        maxAge: (parseInt(process.env.SESSION_AUTO_LOGOUT_LENGTH_IN_MINUTES) || 1) * 60
    },
    providers: [
        EmailProvider({
            server: process.env.EMAIL_SERVER,
            from: process.env.EMAIL_FROM
        }),
        Credentials({
            name: "Credentials",
            credentials: {
                phone: {label: "Phone", type: "text", placeholder: "phone"},
                response: {label: "Response", type: "text"}
            },
            async authorize(credentials) {
                console.log('Credentials authorize called with:', { phone: credentials.phone, response: credentials.response });
                const {phone, response} = credentials;
                const {db} = await connectToDatabase()
                const userSearch = await db
                    .collection("users")
                    .findOne({phone: phone})

                console.log('User search result:', userSearch ? 'User found' : 'User not found');

                if(response === "approved" && userSearch){
                    const userObject = {
                        id: userSearch._id.toString(),
                        name: userSearch.name || '',
                        email: userSearch.email || `phone-${userSearch.phone}@credentials.local`,
                        phone: userSearch.phone,
                        emailVerified: null,
                        image: null
                    };
                    console.log('Returning user object:', userObject);
                    return userObject;
                }else{
                    console.log('Authorization failed - response:', response, 'userFound:', !!userSearch);
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
    },
    secret: process.env.NEXTAUTH_SECRET,
    // url: process.env.NEXTAUTH_URL,
    callbacks: {
        async session({ session, token }) {
            console.log('Session callback called');
            console.log('Session:', session);
            console.log('Token:', token);

            // Pass user data from JWT token to session
            if (token.user) {
                session.user = {
                    ...session.user,
                    ...token.user
                };
                session.level = token.user.level;
                console.log('Session populated from JWT token with level:', session.level);
            } else {
                console.log('No user data in token');
            }

            return session;
        },
        async signIn({ user, account, credentials }){
            console.log('SignIn callback called with account type:', account.type);
            console.log('User object:', user);
            console.log('Credentials:', credentials);

            const {db} = await connectToDatabase()
            if (account.type === "email") {
                const userSearch = await db.collection("users").findOne({email: user.email})
                if(userSearch){
                    console.log('Email signin successful for:', user.email);
                    return true
                } else {
                    console.log('Email signin failed - no account found for:', user.email);
                    return "/api/auth/no-account"
                }
            } else if(account.type === "credentials") {
                const userSearch = await db.collection("users").findOne({phone: credentials.phone})
                if(userSearch){
                    console.log('Credentials signin successful for phone:', credentials.phone);
                    return true
                } else {
                    console.log('Credentials signin failed - no account found for phone:', credentials.phone);
                    return "/api/auth/no-account"
                }
            } else if(account.type === "oauth") {
                const userSearch = await db.collection("users").findOne({email: user.email})
                if(userSearch){
                    console.log('OAuth signin successful for:', user.email);
                    return true
                } else {
                    console.log('OAuth signin failed - no account found for:', user.email);
                    return "/auth/no-account"
                }
            }
        },
        async jwt({ token, user, account }) {
            console.log('JWT callback called');
            console.log('Token:', token);
            console.log('User:', user);
            console.log('Account:', account);

            // If user is present (sign in), add user data to token
            if (user && account) {
                console.log('Adding user data to JWT token');
                token.user = user;
                token.accountType = account.type;

                // Fetch user data from database
                try {
                    const {db} = await connectToDatabase();
                    let dbUser = null;

                    if (account.type === 'credentials') {
                        // For phone-based auth, look up by phone
                        if (user.phone) {
                            dbUser = await db.collection("users").findOne({phone: user.phone});
                        } else if (user.email && user.email.includes('@credentials.local')) {
                            const phoneMatch = user.email.match(/phone-(\d+)@credentials\.local/);
                            if (phoneMatch) {
                                dbUser = await db.collection("users").findOne({phone: phoneMatch[1]});
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
                        console.log('Added database user data to token:', { level: dbUser.level, phone: dbUser.phone });
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
                        "name": "",
                        "county": [],
                        "homeCounty": "",
                        "programs": []
                    }
                })
            }
            
            // Note: With JWT session strategy, session expiration is handled by JWT maxAge
        },
    }
}

export default NextAuth(authOptions)
