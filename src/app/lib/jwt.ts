import jwt from 'jsonwebtoken';
console.log('JWT_SECRET:', process.env.JWT_SECRET);
export const signToken = (payload: object) => jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn: '7d' });
export const verifyToken = (token: string) => jwt.verify(token, process.env.JWT_SECRET!);
