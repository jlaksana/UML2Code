import dotenv from 'dotenv';
import app from './app';
import connectDB from './db';

dotenv.config();

const start = (port: number) => {
  try {
    app.listen(port, () => {
      console.log(`Api running at http://localhost:${port}`);
    });
    connectDB();
  } catch (err) {
    console.error(err);
    process.exit();
  }
};

start(5000);
