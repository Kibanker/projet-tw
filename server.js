const app = require('./index');
const PORT = process.env.PORT || 3000;

// Gérer les routes non trouvées
app.use((req, res, next) => {
    res.status(404).json({ message: 'Route non trouvée' });
});

app.listen(PORT, () => {
    console.log(`Serveur lancé sur http://localhost:${PORT}`);
});