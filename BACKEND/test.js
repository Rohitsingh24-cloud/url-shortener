import mongoose from "mongoose";

const uri =


try {
  await mongoose.connect(uri);
  console.log("Connected!");
  process.exit(0);
} catch (err) {
  console.error(err);
  process.exit(1);
}
