import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const register = async (req: Request, res: Response) => {
  try{

    const { name, email, password , role} = req.body;
    
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    
    const existingUser = await User.findOne({ email });
    
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }
    
    const hashedPassword = await bcrypt.hash(password , 10);
    
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role || 'User',
    });
    
    return res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email 
      },
    })
  } catch (error: any) {
    return res.status(500).json({
      message: 'Server Error',
      error : error.message,
    });
  }
};

export const login = async (req: Request , res: Response) => {
  try {
    const { email , password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = await User.findOne({ email })

    if (!user) {
      return res.status(404).json({
        message: 'Invalid Credentials'
      });
    }

    const isMatch = await bcrypt.compare(password , user.password);

    if(!isMatch) {
      return res.status(400).json({
        message: 'Invalid Credentials'
      })
    }

    const token = jwt.sign(
      { userId: user._id.toString() },
      process.env.JWT_SECRET as string,
      { expiresIn: '7d'}
    );

    return res.status(200).json({
      message: 'Login Successful',
      token,
      user: {
        id: user._id,
        role: user.role,
        email: user.email
      }
    })
  } catch (error: any) {
    return res.status(500).json({
      message: 'Server Error',
      error : error.message,
    });
  }
}