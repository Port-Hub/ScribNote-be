import { Request, Response } from "express";
import { hash, compare } from "bcryptjs";
import { sign } from "jsonwebtoken";
import prisma from "../../middleware/prisma";
import { users } from "@prisma/client";

class AuthController {
  public register: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>> = async (req, res) => {
    try {
      const { email, password, username } = req.body;
      if (email && password && username) {
        const emailAvailable: users = await prisma.users.findFirst({
          where: { email },
        });
        const userAvailable: users = await prisma.users.findFirst({
          where: { username },
        });
        if (emailAvailable) {
          res.json({
            success: false,
            message: "Email already exists",
          }); 
        } 
        if (userAvailable) {
          res.json({
            success: false,
            message: "User already exists",
          });
        }
        else {
          let hashedPassword: string = await hash(password, 10);
          let userCreated: users = await prisma.users.create({
            data: {
              email,
              username,
              password: hashedPassword,
            },
          });
          if(userCreated)
          {
            const { id, password, createdAt, ...others } = userCreated;
            res.json({
              success: true,
              message: "User created successfully",
              user: others,
            });
          }
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

  public login: (req: Request, res: Response) => Promise<any> = async (req, res) => {
    try {
      const { username, password } = req.body;
      if ( username && password ) {
        const userAvailable: users = await prisma.users.findUnique({
          where: {
            username,
          },
        });
        if (userAvailable) {
          let isMatch: boolean = await compare(password, userAvailable.password);
          if (isMatch) {
            let payload: { id: any } = { id: userAvailable.id };
            let token: string = sign({ payload }, process.env.JWT_AUTH_SECRET, {
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