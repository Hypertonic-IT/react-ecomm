const mongoose = require('mongoose');
const User = require('./src/models/User'); // Adjust path as necessary
require('dotenv').config();

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/hypertonic');
        console.log(`MongoDB Connected: ${conn.connection.host}`);

        const users = await User.find({});
        console.log('--- USERS IN DB ---');
        console.log(JSON.stringify(users, null, 2));
        console.log('-------------------');

        process.exit();
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

connectDB();
