const mongoose = require('mongoose');
const Element = require('../models/element');
const connectDB = require('../config/database');

describe('Tests unitaires pour le modèle Element', () => {
    beforeAll(async () => {
        await connectDB();
        await Element.deleteMany({});
    });

    afterAll(async () => {
        await mongoose.connection.close();
    });

    it('doit sauvegarder un nouvel élément', async () => {
        const nouvelElement = new Element({ id: 1, name: 'Test Element', location: 'Test Location' });
        const elementSauvegarde = await nouvelElement.save();
        expect(elementSauvegarde.id).toBe(1);
    });
});

