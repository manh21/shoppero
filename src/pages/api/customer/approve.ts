import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]"
import prisma from "@/lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const session = await getServerSession(req, res, authOptions(req, res));
    if (session && req.method == "POST") {
        if(session.user.userType != "admin") {
            return res.status(401).json({
                status: 'error',
                statusText: "Unauthorized",
            });
        }

        const { id } = req.body;
        // Update status to approved
        await prisma.user.update({
            where: {
                id: id,
            },
            data: {
                active: true,
            },
        });

        res.status(200).json({
            status: "success",
        })
    } else {
        // Not Signed in
        res.status(401);
    }
    res.end();
}
