import prisma from '@/lib/prisma';
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
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
    
        default:
            break;
    }
}
