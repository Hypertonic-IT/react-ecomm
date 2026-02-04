
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./src/models/User');

dotenv.config();

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/hypertonic');
        console.log('MongoDB Connected');
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

const fixAdminRole = async () => {
    await connectDB();

    const email = 'admin@example.com';

    try {
        const user = await User.findOne({ emailOrMobile: email });

        if (user) {
            console.log(`Found user: ${user.emailOrMobile}, Role: ${user.role}, IsAdmin: ${user.isAdmin}`);

            user.isAdmin = true;
            user.role = 'super_admin';
            await user.save();

            console.log(`Updated user ${email} to role: super_admin`);
        } else {
            console.log(`User ${email} not found. Creating...`);
            await User.create({
                name: 'Admin User',
                emailOrMobile: email,
                password: 'password123', // rudimentary
                isAdmin: true,
                role: 'super_admin'
            });
            console.log(`Created super_admin: ${email}`);
        }
    } catch (error) {
        console.error(error);
    } finally {
        process.exit();
    }
};

fixAdminRole();
