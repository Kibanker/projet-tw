const mongoose = require('mongoose');

const elementSchema = new mongoose.Schema({
    id: { type: Number, required: true},
    name: { type: String, required: true },
    location: { type: String, required: true },
});

module.exports = mongoose.model('element', elementSchema);
