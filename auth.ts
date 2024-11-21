import NextAuth, { AuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";

/**
 * Custom auth handler
 * DO NOT FUCK WITH THIS IF YOU DONT KNOW HOW IT WORKS
 */
const options: AuthOptions = {
    debug: false,
    providers: [
        Credentials({
            credentials: {
                email: { label: 'Email', type: 'email' },
                password: { label: 'Password', type: 'password' }
            },
            authorize: async (credentials: any) => {
                const url = process.env.API_URL as string;
                const params = new URLSearchParams({
                    action: 'ValidateLogin',
                    identifier: process.env.API_IDENTIFIER || '',
                    secret: process.env.API_SECRET || '',
                    email: String(credentials.email),
                    password2: String(credentials.password),
                    responsetype: 'json'
                });

                try {
                    console.log('Attempting to validate login credentials!');
                    const response = await fetch(url, {
                        method: 'POST',
                        body: params
                    }).then(res => res.json());

                    if (response.result === 'success') {
                        console.log('Validation successful, fetching client details');
                        const clientParams = new URLSearchParams({
                            action: 'GetClientsDetails',
                            identifier: process.env.API_IDENTIFIER || '',
                            secret: process.env.API_SECRET || '',
                            clientid: String(response.userid),
                            responsetype: 'json'
                        });

                        const clientResponse = await fetch(url, {
                            method: 'POST',
                            body: clientParams
                        }).then(res => res.json());

                        const client = clientResponse;

                        if (!client) {
                            console.log('Client not found');
                            return null;
                        }

                        console.log('NodeByte Client located');
                        /** 
                        const panelParams = new URLSearchParams({
                            username: String(credentials.email),
                            password: String(credentials.password)
                        })

                        const panelLogin = await fetch(url, {
                            method: 'POST',
                            body: panelParams,
                            headers: {
                                'Content-Type': 'application/x-www-form-urlencoded'
                            }
                        });

                        if (!panelLogin.ok) {
                            console.log('Failed to simultaneously login to the billing panel')
                            console.log('Details:', panelLogin)
                            return null;
                        }
                        */

                        console.log('User validated and logged in successfully!')

                        return {
                            id: response.userid,
                            email: credentials.email,
                            firstName: client.firstname,
                            lastName: client.lastname,
                            company: client.companyname,
                            created: client.datecreated,
                            status: client.status
                        };
                    } else {
                        console.log('Login failed:', response.message);
                        return null;
                    }
                } catch (error) {
                    console.error('Error during authentication:', error);
                    return null;
                }
            },
        }),
    ],
    session: { strategy: "jwt" },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id ?? '';
                token.email = user.email ?? '';
                token.firstName = user.firstName ?? '';
                token.lastName = user.lastName ?? '';
                token.company = user.company ?? '';
                token.created = user.created ?? '';
                token.status = user.status ?? '';
            }
            return token;
        },
        async session({ session, token }) {
            session.user.id = token.id;
            session.user.email = token.email;
            session.user.firstName = token.firstName;
            session.user.lastName = token.lastName;
            session.user.company = token.company;
            session.user.created = token.created;
            session.user.status = token.status;
            return session;
        }
    },
    secret: process.env.NEXTAUTH_SECRET,
};

export default NextAuth(options);

declare module "next-auth" {
    interface Session {
        user: {
            id: string;
            email: string;
            firstName: string;
            lastName: string;
            company: string;
            created: string;
            status: string;
        };
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        id: string;
        email: string;
        firstName: string;
        lastName: string;
        company: string;
        created: string;
        status: string;
    }
}

declare module "next-auth" {
    interface User {
        id: string;
        email: string;
        firstName: string;
        lastName: string;
        company: string;
        created: string;
        status: string;
    }

    interface Session {
        user: {
            id: string;
            email: string;
            firstName: string;
            lastName: string;
            company: string;
            created: string;
            status: string;
        };
    }
}