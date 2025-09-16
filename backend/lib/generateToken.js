import dotenv from "dotenv";
import jwt from "jsonwebtoken";

dotenv.config(); 

export const generateToken = (payload, res) => {
    const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, {
        expiresIn: "7d"
    })

    res.cookie("jwt", token, {
        httpOnly: true, 
        secure: process.env.NODE_ENV !== 'development',
        sameSite : 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000
    })
}
