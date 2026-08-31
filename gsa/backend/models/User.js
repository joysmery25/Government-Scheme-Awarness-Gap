const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: 'User' },
    phoneNumber: { type: String },
    googleId: { type: String },
    
    // Profile Fields for Eligibility Match
    profile: {
        age: { type: Number },
        gender: { type: String, enum: ['Male', 'Female', 'Other'] },
        occupation: { type: String },
        categories: [{ type: String }],
        income: { type: Number },
        state: { type: String },
        district: { type: String },
        education: { type: String },
        aadharNumber: { type: String }
    },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);
