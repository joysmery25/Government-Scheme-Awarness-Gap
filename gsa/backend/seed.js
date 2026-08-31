const mongoose = require('mongoose');
const Scheme = require('./models/Scheme');
const User = require('./models/User');
const Admin = require('./models/Admin');
require('dotenv').config();
const bcrypt = require('bcrypt');

const seedData = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/gsa');
        console.log('Connected to DB for Seeding');

        await Scheme.deleteMany();
        await User.deleteMany();
        await Admin.deleteMany();

        // Default Admin
        const adminHashed = await bcrypt.hash('admin123', 10);
        await Admin.create({
            fullName: 'Super Admin',
            email: 'admin@gsa.com',
            password: adminHashed
        });
        console.log('Admin user created (admin@gsa.com / admin123)');

        const fs = require('fs');
        const schemesData = JSON.parse(fs.readFileSync('./data/schemes.json', 'utf8'));
        const schemes = schemesData.map(s => {
            // Remove id from JSON mapped to _id handled by mongoose
            return {
                schemeName: s.schemeName,
                schemeType: s.schemeType,
                department: s.department,
                description: s.description,
                eligibility: s.eligibility,
                benefits: s.benefits,
                incomeCriteria: s.incomeCriteria,
                ageCriteria: s.ageCriteria,
                requiredDocuments: s.requiredDocuments,
                applicationProcess: s.applicationProcess,
                officeToVisit: s.officeToVisit,
                officialWebsite: s.officialWebsite,
                statusTrackingWebsite: s.statusTrackingWebsite,
                contactNumber: s.contactNumber,
                email: s.email,
                category: s.category,
                frequentlyAskedQuestions: s.frequentlyAskedQuestions
            };
        });

        await Scheme.insertMany(schemes);
        console.log('Schemes seeded successfully!');

        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

seedData();
