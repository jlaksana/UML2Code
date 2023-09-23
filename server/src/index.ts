import dotenv from 'dotenv';
import app from './app';
import connectDB from './db';

dotenv.config();

const start = (port: number) => {
  try {
    app.listen(port, () => {
      console.log(`Server listening on ${port}`);
    });
    connectDB();
  } catch (err) {
    console.error(err);
    process.exit();
  }
};

start(parseInt(process.env.PORT || '5000', 10));
