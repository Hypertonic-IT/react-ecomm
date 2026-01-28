
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDB = require('./src/config/db');
const User = require('./src/models/User');

// Load env vars
dotenv.config();

const createAdmin = async () => {
    try {
        await connectDB();

        const email = 'admin@hypertonic.com';
        const password = 'password123'; // In a real app, hash this!

        const userExists = await User.findOne({ emailOrMobile: email });

        if (userExists) {
            console.log('Admin user already exists. Updating role...');
            userExists.isAdmin = true;
            userExists.role = 'super_admin';
            userExists.password = password; // Resetting password just in case
            await userExists.save();
            console.log('Admin user updated successfully');
        } else {
            console.log('Creating new admin user...');
            const user = await User.create({
                name: 'Super Admin',
                emailOrMobile: email,
                password: password,
                isAdmin: true,
                role: 'super_admin'
            });
            console.log('Admin user created successfully');
        }

        console.log(`\ncredentials:\nEmail: ${email}\nPassword: ${password}\n`);

        process.exit();
    } catch (error) {
        console.error('Error creating admin:', error);
        process.exit(1);
    }
};

createAdmin();
