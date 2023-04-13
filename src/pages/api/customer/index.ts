import prisma from '@/lib/prisma';
import type { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]"

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
    const session = await getServerSession(req, res, authOptions(req, res));

    switch (req.method) {
        case 'GET':
            if(req.query.id) {
                const customer = await prisma.user.findUnique({
                    where: {
                        id: req.query.id as string,
                    },
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        username: true,
                        active: true,
                        userType: true,
                        image: true,
                        created_at: true,
                    }
                });
                        
                return res.status(200).json({
                    status: "success",
                    data: customer ? customer : null
                })
            }


            const customer = await prisma.user.findMany({
                where: {
                    userType: "customer",
                },
                select: {
                    id: true,
                    name: true,
                    email: true,
                    username: true,
                    active: true,
                    userType: true,
                    image: true
                }
            });
        
            return res.status(200).json({
                status: "success",
                data: customer ? customer : []
            })
            break;
        case "DELETE":
            if(session && session.user.userType != "admin") {
                return res.status(401).json({
                    status: 'error',
                    statusText: "Unauthorized",
                });
            }

            const deleteCustomer = await prisma.user.delete({
                where: {
                    id: req.query.id as string,
                }
            });

            return res.status(200).json({
                status: "success",
                data: deleteCustomer ? deleteCustomer : null
            })
            break;
    
        default:
            break;
    }
}
