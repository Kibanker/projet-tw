const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../index');
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
        const nouvelElement = new Element({ id: 0, name: 'Test Element', location: 'Test Location' });
        const elementSauvegarde = await nouvelElement.save();
        expect(elementSauvegarde.id).toBe(0);
        expect(elementSauvegarde.name).toBe('Test Element');
        expect(elementSauvegarde.location).toBe('Test Location');
    });
});

describe('Tests end-to-end pour l’API /elements', () => {
    beforeAll(async () => {
        await connectDB();
        await Element.deleteMany({});
        await Element.insertMany([
            { id: 1, name: 'Appartement T1', location: 'Paris' }
        ]);
    });

    afterAll(async () => {
        await mongoose.connection.close();
    });

    it('doit ajouter un nouvel élément', async () => {
        const response = await request(app)
            .post('/elements')
            .send({ id: 2, name: 'E2E Element', location: 'E2E Location' });
        expect(response.statusCode).toBe(201);
        expect(response.body.name).toBe('E2E Element');
    });
});