import mongoose from 'mongoose';

const mongoUrl = process.env.MONGODB_URL as string;

export const database = await mongoose.connect(mongoUrl, {
  dbName: 'words',
});

database.connection.on('error', (error) => console.log(error));
