import mongoose from "mongoose";
let isConnected = false; // to check connection

export const connectedToDB = async () => {
  // to prevevnt unnecessary queries
  mongoose.set("strictQuery", true);

  if (!process.env.MONGODB_URL) return console.log("MONGODB_URL not specified");
  if (isConnected) return console.log("Already connected to MongoDB");
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    isConnected = true;
    console.log("Connected to MongoDB");
  } catch (error) {
    console.log("Couldn't connect to MongoDB");
  }
};
