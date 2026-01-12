import jwt from "jsonwebtoken";
import config from "../config/config.js";

const generateAccessAndRefreshTokens = (user)=>{
    const accessToken = jwt.sign(
        {
            id:user.id,
            role:user.role
        },
        config.get('ACCESS_TOKEN_SECRET'),
        {
            expiresIn:config.get("ACCESS_TOKEN_EXPIRY")
        }
    )

    const refreshToken = jwt.sign(
        {
            id:user.id,
            role:user.role
        },
        config.get('REFRESH_TOKEN_SECRET'),
        {
            expiresIn:config.get("REFRESH_TOKEN_EXPIRY")
        }
    )

    return{
        accessToken,
        refreshToken
    }
}

export {
    generateAccessAndRefreshTokens
}