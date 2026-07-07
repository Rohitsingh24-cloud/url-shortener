import mongoose from "mongoose";

const uri =
"mongodb+srv://rohit:Rohit1234@url-shortener-cluster.u2btr13.mongodb.net/url-shortner?retryWrites=true&w=majority&appName=url-shortener-cluster";

try {
  await mongoose.connect(uri);
  console.log("Connected!");
  process.exit(0);
} catch (err) {
  console.error(err);
  process.exit(1);
}