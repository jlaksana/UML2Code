import mongoose, { ConnectOptions } from 'mongoose';

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || '', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    } as ConnectOptions);

    console.log('MongoDB connected!');
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

export default connectDB;
