import bcrypt from 'bcryptjs';

const saltRounds = 10;

export const generatePasswordHash = async (plainTextPassword: string) => {
    const salt = await bcrypt.genSalt(saltRounds);
    return await bcrypt.hash(plainTextPassword, salt);
};

export const comparePassword = async (plainTextPassword: string, hashedPassword: string) => {
    return await bcrypt.compare(plainTextPassword, hashedPassword);
};