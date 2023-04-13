import prisma from "@/lib/prisma";
import { generatePasswordHash } from "@/services/password";
import type { NextApiRequest, NextApiResponse } from "next";
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
    try {
        switch (req.method) {
            case "POST":
                const form = new formidable.IncomingForm();
                form.parse(req, async function (err, fields, files) {
                    const filename = await saveFile(files.file as formidable.File);
                    const { name, username, email, password, confirm } = fields;

                    if (
                        !(
                            name &&
                            username &&
                            email &&
                            password &&
                            confirm &&
                            password.length >= 1
                        )
                    ) {
                        res.status(400).json({
                            status: 'error',
                            statusText: "Invalid user parameters",
                        })
                        return;
                    }
    
                    if (password != confirm) {
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
                        profileExists.length > 0
                    ) {
                        res.status(403).json({
                            status: 'error',
                            statusText: "User already exists",
                        })
                        return;
                    }
    
                    const user = await prisma.user.create({
                        data: {
                            name: name as string,
                            email: email as string,
                            username: username as string,
                            password: await generatePasswordHash(password as string),
                            active: false,
                            image: filename,
                            userType: "customer",
                        },
                    });
    
                    if (!user) {
                        return res.status(500).json({
                            status: 'error',
                            statusText: "Unable to create user account",
                        });
                    }
    
                    const account = await prisma.account.create({
                        data: {
                            userId: user.id,
                            type: "credentials",
                            provider: "credentials",
                            providerAccountId: user.id,
                        },
                    });
    
                    if (user && account) {
                        return res.status(201).json({
                            status: "success",
                            statusText: "User created successfully",
                        });
                    } else {
                        return res.status(500).json({
                            status: 'error',
                            statusText: "Unable to link account to created user profile",
                        });
                    }
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
