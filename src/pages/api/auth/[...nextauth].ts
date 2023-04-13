import type { NextApiRequest, NextApiResponse } from 'next'
import NextAuth, { NextAuthOptions } from 'next-auth';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import prisma from '@/lib/prisma';
import CredentialsProvider from "next-auth/providers/credentials"
import { comparePassword } from '@/services/password';

// Modules needed to support key generation, token encryption, and HTTP cookie manipulation 
import { randomUUID } from 'crypto'
import Cookies from 'cookies'
import { encode, decode } from 'next-auth/jwt'

export const authOptions = (req: NextApiRequest, res: NextApiResponse) => {
    const adapter = PrismaAdapter(prisma)
    const options: NextAuthOptions = {
        providers: [
            CredentialsProvider({
                name: 'Credentials',
                credentials: {
                    username: { label: "Username", type: "text", placeholder: "shopper" },
                    password: { label: "Password", type: "password" }
                },
                async authorize(credentials, req) {
                    if(!credentials?.username || !credentials?.password) return null
        
                    // Add logic here to look up the user from the credentials supplied
                    const user = await prisma.user.findUnique({
                        select: {
                            id: true,
                            name: true,
                            image: true,
                            email: true,
                            username: true,
                            password: true,
                            active: true,
                        },
                        where: { username: credentials?.username }
                    })
                    
                    if(!user) return null
                    
                    // If no user is found or the password is incorrect, return null
                    if(await comparePassword(credentials?.password, user.password) == false) return null
        
                    // Check if the user is active
                    if(!user.active) return null
                    
                    // Return the user object, passing the password field, so it is not returned
                    return {...user, password: undefined}
                }
            })
        ],
        adapter,
        secret: process.env.SECRET,
        callbacks: {
            async session({ session, user }) {
                if(user.email) {
                    // @ts-ignore
                    user.password = undefined;

                    session.user = user
                }

                return session
              },
            async signIn({ user, account, profile, email, credentials }: any) {                
                if (req.query?.nextauth?.includes('callback') && req.query.nextauth.includes('credentials') && req.method === 'POST') {
                    if (user) {
                        const sessionToken = generateSessionToken()
                        const sessionMaxAge = 60 * 60 * 24 * 30; //30Daysconst sessionMaxAge = 60 * 60 * 24 * 30; //30Days
                        const sessionExpiry = fromDate(sessionMaxAge);
                        
                        await adapter.createSession({
                            sessionToken: sessionToken,
                            userId: user.id,
                            expires: sessionExpiry
                        })
    
                        const cookies = new Cookies(req,res)
    
                        cookies.set('next-auth.session-token', sessionToken, {
                            expires: sessionExpiry
                        })
                    }   
                }
    
                return true;
            },
        },
        jwt: {
            maxAge: 60 * 60 * 24 * 30, //30Days
            encode: async ({token, secret, maxAge}: any) => {
                if (req?.query?.nextauth?.includes('callback') && req.query.nextauth.includes('credentials') && req.method === 'POST') {
                    const cookies = new Cookies(req,res)

                    const cookie = cookies.get('next-auth.session-token')

                    if(cookie) return cookie; else return '';

                }
                // Revert to default behaviour when not in the credentials provider callback flow
                return encode({token, secret, maxAge})
            },
            decode: async ({token, secret}: any) => {
                if (req?.query?.nextauth?.includes('callback') && req.query.nextauth.includes('credentials') && req.method === 'POST') {
                    return null
                }

                // Revert to default behaviour when not in the credentials provider callback flow
                return decode({token, secret})
            }
        },
        cookies: {
            sessionToken: {
              name: "next-auth.session-token",
              options: {
                httpOnly: true,
                sameSite: "lax",
                path: "/",
                secure: process.env.NODE_ENV === "production",
              },
            },
        },
        pages: {
            error: '/',
            signIn: '/signin',
        },
    }

    return options;

}

export default async function auth(req: NextApiRequest, res: NextApiResponse) {
   
    return await NextAuth(req, res, authOptions(req, res))
}

const generateSessionToken = () => {
    return randomUUID()
}

const fromDate = (time: any, date = Date.now()) => {
    return new Date(date + time * 1000)
}