const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();
const User = require('./src/models/User');

mongoose.connect(process.env.MONGO_URI).then(async () => {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('admin123', salt);
    
    await User.deleteOne({ emailOrMobile: 'admin@kayaroop.com' });
    
    await User.create({
        name: 'Kayaroop Admin',
        emailOrMobile: 'admin@kayaroop.com',
        password: hashedPassword,
        isAdmin: true,
        role: 'super_admin'
    });
    
    console.log('Admin user created successfully!');
    process.exit(0);
});
