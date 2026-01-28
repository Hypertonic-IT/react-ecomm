
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDB = require('./src/config/db');
const User = require('./src/models/User');

// Load env vars
dotenv.config();

const createSimpleAdmin = async () => {
    try {
        await connectDB();

        const username = 'admin';
        const password = 'admin';

        // Check if user exists with this exact handle
        const userExists = await User.findOne({ emailOrMobile: username });

        if (userExists) {
            console.log('User "admin" already exists. Updating credentials and role...');
            userExists.password = password;
            userExists.isAdmin = true;
            userExists.role = 'super_admin';
            userExists.name = 'Administrator';
            await userExists.save();
            console.log('Admin user updated successfully');
        } else {
            console.log('Creating new "admin" user...');
            await User.create({
                name: 'Administrator',
                emailOrMobile: username,
                password: password,
                isAdmin: true,
                role: 'super_admin'
            });
            console.log('Admin user created successfully');
        }

        console.log(`\ncredentials:\nUsername: ${username}\nPassword: ${password}\n`);

        process.exit();
    } catch (error) {
        console.error('Error creating admin:', error);
        process.exit(1);
    }
};

createSimpleAdmin();
