import { Request, Response } from "express";
import { hash, compare } from "bcryptjs";
import { sign } from "jsonwebtoken";
import prisma from "../../middleware/prisma";

class AuthController {
  public register = async (req: Request, res: Response) => {
    try {
      const { email, password, username } = req.body;
      if (email && password && username) {
        const userAvailable = await prisma.users.findFirst({
          where: { email },
        });
        if (userAvailable) {
          res.json({
            success: false,
            message: "User already exists",
          });
        } else {
          let hashedPassword = await hash(password, 10);
          let userCreated = await prisma.users.create({
            data: {
              email,
              username,
              password: hashedPassword,
            },
          });
          res.json({
            success: true,
            message: "User created successfully",
            user: userCreated,
          });
        }
      } else {
        res.json({
          success: false,
          message: "Please Provide all the fields",
        });
      }
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: err.toString(),
      });
    }
  };

  public login = async (req: Request, res: Response): Promise<any> => {
    try {
      const { username, password } = req.body;
      if ( username && password ) {
        const userAvailable = await prisma.users.findUnique({
          where: {
            username,
          },
        });
        if (userAvailable) {
          let isMatch = await compare(password, userAvailable.password);
          if (isMatch) {
            let payload = { id: userAvailable.id };
            let token = sign({ payload }, process.env.JWT_AUTH_SECRET, {
              expiresIn: "1h",
            });
            res.json({
              success: true,
              token,
            });
          } else {
            res.json({
              success: false,
              message: "Invalid password",
            });
          }
        } else {
          res.json({
            success: false,
            message: "User not found",
          });
        }
      } else {
        res.json({
          success: false,
          message: "Please provide all the required fields",
        });
      }
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: err.toString(),
      });
    }
  };
}

export default AuthController;