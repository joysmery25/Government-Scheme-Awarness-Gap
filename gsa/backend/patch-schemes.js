/**
 * patch-schemes.js
 * Run once to backfill `government` field on all existing Scheme documents.
 * Usage: node patch-schemes.js
 */
require('dotenv').config();
const mongoose = require('mongoose');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/gsa';

mongoose.connect(MONGO_URI).then(async () => {
    console.log('Connected to MongoDB');

    const db = mongoose.connection.db;
    const collection = db.collection('schemes');

    // Patch Central schemes
    const centralResult = await collection.updateMany(
        { schemeType: /central/i },
        { $set: { government: 'Central' } }
    );
    console.log(`Patched ${centralResult.modifiedCount} Central schemes`);

    // Patch State schemes
    const stateResult = await collection.updateMany(
        { schemeType: { $not: /central/i } },
        { $set: { government: 'Andhra Pradesh' } }
    );
    console.log(`Patched ${stateResult.modifiedCount} State (AP) schemes`);

    console.log('✅ Done!');
    await mongoose.disconnect();
}).catch(err => {
    console.error('Error:', err.message);
    process.exit(1);
});
