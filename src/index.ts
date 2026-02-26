import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import subscriptionRoutes from './routes/subscription.routes.js'

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Backend running");
});

app.use('/api', subscriptionRoutes)

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