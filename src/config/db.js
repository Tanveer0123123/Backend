import mongoose from "mongoose"

export const ConnectDB=()=>{
try {
    mongoose.connect(process.env.MONGO_URI)
    console.log("Database connected successfully", process.env.MONGO_URI)
} catch (error) {
    process.exit(1)
}
}