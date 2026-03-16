import { Request , Response } from "express";
import User from "../models/user.model.js";

export const createUser = async (req: Request , res: Response) => {
  try {
    const { name , email , password , role} = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({
        message: "All required fields must be provided",
      });
    }

    const newUser = new User({
      name,
      email,
      password,
      role,
    });

    const savedUser = await newUser.save();

    return res.status(201).json({ savedUser});

  } catch (error: any) {
    return res.status(500).json({
      message: 'Server Error',
      error: error.message,
    });
  }
};

export const readAllUsers = async (req: Request , res: Response) => {
  try {
    const users = await User.find()

    return res.status(200).json({
      users,
    })
  } catch (error: any) {
    return res.status(500).json({
      message: 'Server Error',
      error: error.message,
    })
  }
}

export const readUser = async (req: Request , res: Response) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        message: 'User not Found',
      })
    }

    return res.status(200).json({
      user,
    })
  } catch (error: any) {
    return res.status(500).json({
      message: 'Server Error',
      error: error.message,
    })
  }
}

export const updateUser = async (req: Request , res:Response) => {
  try {
    const { id } = req.params;

    const updatedUser = await User.findByIdAndUpdate(
      id,
      req.body,
      { new: true}
    );

    if (!updatedUser) {
      return res.status(404).json({
        message: 'User not found',
      });
    }

    return res.status(200).json(updatedUser)
  } catch (error: any) {
    return res.status(500).json({
      message: 'Server Error',
      error: error.message,
    })
  }
}

export const deleteUser = async (req: Request , res:Response) => {
  try {
    const { id } = req.params;

    const deletedUser = await User.findByIdAndDelete(id)

    if (!deletedUser) {
      return res.status(404).json({
        message: 'User not found',
      });
    }
    
    return res.status(200).json({
      message: 'User deleted Successfully'
    });
  } catch (error: any) {
    return res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
}

export const getUserGrowth = async (req, res) => {
  try {

    const users = await User.aggregate([
      {
        $group: {
          _id: { $month: "$createdAt" },
          total: { $sum: 1 }
        }
      },
      {
        $sort: { "_id": 1 }
      }
    ]);

    res.json(users);

  } catch (error) {
    res.status(500).json({ message: "Failed to fetch user growth" });
  }
};