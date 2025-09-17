import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
dotenv.config();

const SALT_ROUNDS = parseInt(process.env.SALT_ROUNDS) || 10;

export const hashPassword = async (password) => {
    return await bcrypt.hash(password, SALT_ROUNDS);
}
export const comparePassword = async (password, hashedPassword) => {
    return await bcrypt.compare(password, hashedPassword);
}

