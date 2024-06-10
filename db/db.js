import mongoose from "mongoose";

const connectToMongo=async()=>{
    try {
        await mongoose.connect(process.env.MONGO_DB_URL);
        console.log("connected to database");
    } catch (error) {
        console.log("Unable to connect to database",error.message);
    }
}

export default connectToMongo;