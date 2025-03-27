const mongoose = require('mongoose');


// Définir le schéma pour un élément (annonce)
const elementSchema = new mongoose.Schema({
    titre: { type: String, required: true },            // Titre de l'annonce
    description: { type: String, required: true },      // Description de l'annonce
    prix: { type: Number, required: true },             // Prix de la maison/appartement
    superficie: { type: Number, required: true },       // Superficie en m²
    chambres: { type: Number, required: true },         // Nombre de chambres
    photos: { type: [String], required: false },       // Tableau de liens vers les photos (optionnel)
    adresse: { type: String, required: true },          // Adresse de l'annonce
    datePublication: { type: Date, required: true }     // Date de publication
});

// Créer le modèle Mongoose basé sur le schéma
module.exports = mongoose.model('element', elementSchema);