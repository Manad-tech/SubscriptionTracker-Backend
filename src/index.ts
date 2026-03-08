import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";
import subscriptionRoutes from './routes/subscription.routes.js'
import userRoutes from './routes/user.routes.js'
import authRoutes from "./routes/auth.routes.js";
import "./jobs/renewalReminder.job.js";
import notificationRoutes from "./routes/notification.routes.js";


const app = express();

app.use(cors());
app.use(express.json());

app.use('/api', subscriptionRoutes)
app.use('/api', userRoutes)
app.use("/api/auth", authRoutes);
app.use("/api", notificationRoutes);

const PORT = process.env.PORT || 5000;
console.log("MONGO_URI:", process.env.MONGO_URI)

const startServer = async () => {
  try {
    await connectDB()

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`)
    })
  } catch (error) {
    console.error("Failed to start server due to DB error")
  }
}

startServer()