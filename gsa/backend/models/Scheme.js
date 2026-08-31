const mongoose = require('mongoose');

const schemeSchema = new mongoose.Schema({
    schemeName: { type: String, required: true },
    // e.g. "Central Government Scheme" or "Andhra Pradesh State Government Scheme"
    schemeType: { type: String, required: true },
    // Derived helper: "Central" or "Andhra Pradesh" – used for quick filtering
    government: { type: String, default: '' },
    department: { type: String },
    description: { type: String },
    eligibility: { type: String },
    benefits: { type: String },
    incomeCriteria: { type: String },
    ageCriteria: { type: String },
    minAge: { type: Number },
    maxAge: { type: Number },
    requiredDocuments: { type: String },
    applicationProcess: { type: String },
    officeToVisit: { type: String },
    officialWebsite: { type: String },
    statusTrackingWebsite: { type: String },
    contactNumber: { type: String },
    email: { type: String },
    category: { type: String },
    frequentlyAskedQuestions: { type: String },
    lastUpdated: { type: Date, default: Date.now }
});

// Auto-populate `government` before saving
schemeSchema.pre('save', function (next) {
    if (this.schemeType) {
        this.government = this.schemeType.toLowerCase().includes('central') ? 'Central' : 'Andhra Pradesh';
    }
    next();
});

// Also handle findOneAndUpdate / findByIdAndUpdate
schemeSchema.pre(['findOneAndUpdate', 'updateOne', 'updateMany'], function (next) {
    const update = this.getUpdate();
    if (update && update.schemeType) {
        update.government = update.schemeType.toLowerCase().includes('central') ? 'Central' : 'Andhra Pradesh';
    }
    next();
});

module.exports = mongoose.model('Scheme', schemeSchema);
