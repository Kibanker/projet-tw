const mongoose = require('mongoose');

const logementSchema = new mongoose.Schema({
    id: { type: Number, required: true},
    name: { type: String, required: true },
    location: { type: String, required: true },
});

module.exports = mongoose.model('logement', logementSchema);
