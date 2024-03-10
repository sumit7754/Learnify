import mongoose from 'mongoose';

mongoose.set('strictQuery', false);

const connectToDb = async (req, res) => {
  try {
    const connection = await mongoose.connect(process.env.MONGO_URI);
    console.log(`connected to database: ${connection.host}`);
  } catch (e) {
    console.log(e);
    process.exit(1);
  }
};

export default connectToDb;
