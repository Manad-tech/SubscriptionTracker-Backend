import mongoose from "mongoose"

const connectDB = async () => {
  try {
    console.log("Trying to connect to MongoDB hello...",process.env.MONGO_URI)

    await mongoose.connect(process.env.MONGO_URI as string), {
      family: 4,
    }

    console.log("MongoDB Connected Successfully")
  } catch (error) {
    console.error("MongoDB Connection Error:", error)
    throw error
  }
}

export default connectDB