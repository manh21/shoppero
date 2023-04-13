import prisma from "@/lib/prisma";
import { generatePasswordHash } from "@/services/password";
import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]"
import formidable from "formidable";
import fs from "fs";

export const config = {
    api: {
        bodyParser: false,
    },
};

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const session = await getServerSession(req, res, authOptions(req, res));

    if(!session) {
        return res.status(500).json({
            status: 'error',
            statusText: "Internal Server Error",
        });
    }

    if(session?.user.userType != "admin") {
        return res.status(401).json({
            status: 'error',
            statusText: "Unauthorized",
        });
    }

    try {
        switch (req.method) {
            case "POST":
                const form = new formidable.IncomingForm();
                form.parse(req, async function (err, fields, files) {
                    const filename = files.file ? await saveFile(files.file as formidable.File) : undefined;
                    const { name, username, email, password, confirm, customerId, status } = fields;

                    if (!(name && username && email && customerId)) {
                        res.status(400).json({
                            status: 'error',
                            statusText: "Invalid user parameters",
                        })
                        return;
                    }
    
                    if (password && (password != confirm)) {
                        res.status(400).json({
                            status: 'error',
                            statusText: "Password mismatch",
                        })
                        return;
                    }
    
                    const profileExists = await prisma.user.findMany({
                        where: {
                            OR: [
                                {
                                    username: username as string,
                                },
                                {
                                    email: email as string,
                                },
                            ],
                        },
                    });
    
                    if (
                        profileExists &&
                        Array.isArray(profileExists) &&
                        profileExists.length > 0 &&
                        customerId != profileExists[0].id
                    ) {
                        res.status(403).json({
                            status: 'error',
                            statusText: "User already exists",
                        })
                        return;
                    }

                    // Build Data
                    const data = {
                        name: name as string,
                        email: email as string,
                        username: username as string,
                        password: password ? await generatePasswordHash(password as string) : undefined,
                        image: filename ? filename : undefined,
                        active: status === 'true' ? true : false,
                    };
    
                    const user = await prisma.user.update({
                        where: {
                            id: customerId as string,
                        },
                        data
                    });
    
                    return res.status(200).json({
                        status: "success",
                        statusText: "User updated successfully",
                    });
                });
                break;
            default:
                res.setHeader("Allow", ["POST"]);
                res.status(405).json({
                    status: 'error',
                    statusText: `Method ${req.method} Not Allowed`,
                });
        }
    } catch (error) {
        res.status(500).json({
            status: 'error',
            statusText: "Internal Server Error",
            error: error,
        });
    }
}

const saveFile = async (file: formidable.File) => {
    const data = fs.readFileSync(file.filepath);
    fs.writeFileSync(`./public/userfiles/avatar/${file.newFilename}`, data);
    fs.unlinkSync(file.filepath);
    return file.newFilename;
};
