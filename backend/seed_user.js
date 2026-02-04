const mongoose = require('mongoose');
const User = require('./src/models/User');
require('dotenv').config();

mongoose.connect("mongodb://localhost:27017/hypertonic_db").then(async () => {
    console.log("Connected to DB");

    try {
        await User.deleteOne({ emailOrMobile: 'testuser@example.com' });

        await User.create({
            name: "Test User",
            emailOrMobile: 'testuser@example.com',
            password: 'password123',
            mobile: '1234567890'
        });
        console.log("Test user created");
    } catch (e) {
        console.error(e);
    } finally {
        mongoose.disconnect();
    }
}).catch(err => console.error("DB Error", err));
