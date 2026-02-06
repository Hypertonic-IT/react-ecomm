
const mongoose = require('mongoose');
const User = require('./src/models/User');
require('dotenv').config();

const resetAdmin = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/hypertonic');
        console.log(`MongoDB Connected: ${conn.connection.host}`);

        const adminUser = await User.findOne({ emailOrMobile: 'admin' });

        if (adminUser) {
            console.log('Found admin user. Resetting password to plain text...');
            adminUser.password = 'admin';
            await adminUser.save();
            console.log('Password reset to "password123"');
        } else {
            console.log('User "admin" not found.');
            // Create it if not exists, just in case
            const newUser = await User.create({
                name: 'Administrator',
                emailOrMobile: 'admin',
                password: 'password123',
                isAdmin: true,
                role: 'super_admin'
            });
            console.log('Created user "admin" with password "password123"');
        }

        process.exit();
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

resetAdmin();
