import { Request, Response, NextFunction } from "express"
import { verify, VerifyErrors } from "jsonwebtoken"

const validateUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    let token: string = req.headers.authorization?.split(" ")[1]
    let jwtSecret: string = process.env.JWT_AUTH_SECRET!
    if (token) {
        verify(token, jwtSecret, (err: VerifyErrors, decoded: any) => {
            if (err) {
                res.json({
                    success: false,
                    message: "Invalid token"
                })
            } else {
                res.locals.user = decoded.payload
                next()
            }
        })
    } else {
        res.json({
            success: false,
            message: "Please provide token"
        })
    }
}

export default validateUser;