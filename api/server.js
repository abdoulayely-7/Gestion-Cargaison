const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Chemin vers le fichier de base de données
const DB_PATH = path.join(__dirname, '../data/db.json');

// Fonction pour lire la base de données
function readDB() {
    try {
        const data = fs.readFileSync(DB_PATH, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Erreur lecture DB:', error);
        return { cargaisons: [], colis: [] };
    }
}

// Fonction pour écrire dans la base de données
function writeDB(data) {
    try {
        fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
        return true;
    } catch (error) {
        console.error('Erreur écriture DB:', error);
        return false;
    }
}

// Routes pour les cargaisons
app.get('/api/cargaisons', (req, res) => {
    try {
        const db = readDB();
        res.json(db.cargaisons || []);
    } catch (error) {
        res.status(500).json({ error: 'Erreur serveur' });
    }
});

app.get('/api/cargaisons/:id', (req, res) => {
    try {
        const db = readDB();
        const cargaison = db.cargaisons.find(c => c.id === req.params.id);
        if (cargaison) {
            res.json(cargaison);
        } else {
            res.status(404).json({ error: 'Cargaison non trouvée' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Erreur serveur' });
    }
});

app.patch('/api/cargaisons/:id', (req, res) => {
    try {
        const db = readDB();
        const index = db.cargaisons.findIndex(c => c.id === req.params.id);
        
        if (index !== -1) {
            // Fusionner les mises à jour
            db.cargaisons[index] = { ...db.cargaisons[index], ...req.body };
            
            if (writeDB(db)) {
                res.json(db.cargaisons[index]);
            } else {
                res.status(500).json({ error: 'Erreur sauvegarde' });
            }
        } else {
            res.status(404).json({ error: 'Cargaison non trouvée' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Erreur serveur' });
    }
});

app.post('/api/cargaisons', (req, res) => {
    try {
        const db = readDB();
        const newId = db.cargaisons.length.toString();
        const newCargaison = { id: newId, ...req.body };
        
        db.cargaisons.push(newCargaison);
        
        if (writeDB(db)) {
            res.status(201).json(newCargaison);
        } else {
            res.status(500).json({ error: 'Erreur sauvegarde' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Erreur serveur' });
    }
});

// Routes pour les colis
app.get('/api/colis', (req, res) => {
    try {
        const db = readDB();
        res.json(db.colis || []);
    } catch (error) {
        res.status(500).json({ error: 'Erreur serveur' });
    }
});

app.post('/api/colis', (req, res) => {
    try {
        const db = readDB();
        
        // Générer un ID unique pour le colis
        const newId = Math.random().toString(16).slice(2, 6);
        
        // Créer le nouveau colis
        const newColis = {
            id: newId,
            ...req.body,
            dateEnregistrement: new Date().toISOString()
        };
        
        // Ajouter le colis à la base
        db.colis.push(newColis);
        
        // Attribuer automatiquement à une cargaison si spécifié
        if (req.body.cargaisonId) {
            const cargaisonIndex = db.cargaisons.findIndex(c => c.id === req.body.cargaisonId);
            if (cargaisonIndex !== -1) {
                // Ajouter l'ID du colis dans la cargaison
                if (!db.cargaisons[cargaisonIndex].colis) {
                    db.cargaisons[cargaisonIndex].colis = [];
                }
                db.cargaisons[cargaisonIndex].colis.push(newId);
                
                // Mettre à jour le poids de la cargaison
                const poidsActuel = db.cargaisons[cargaisonIndex].poidsActuel || 0;
                db.cargaisons[cargaisonIndex].poidsActuel = poidsActuel + (req.body.poids || 0);
                
                // Mettre à jour le montant si nécessaire
                if (req.body.prix) {
                    const montantActuel = db.cargaisons[cargaisonIndex].montantTotal || db.cargaisons[cargaisonIndex].prixTransport || 0;
                    db.cargaisons[cargaisonIndex].montantTotal = montantActuel + req.body.prix;
                }
            }
        }
        
        if (writeDB(db)) {
            res.status(201).json({ 
                success: true, 
                colis: newColis,
                code: newColis.code || newId
            });
        } else {
            res.status(500).json({ error: 'Erreur sauvegarde' });
        }
    } catch (error) {
        console.error('Erreur création colis:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
});

// Route pour attribuer un colis à une cargaison
app.post('/api/cargaisons/:id/colis', (req, res) => {
    try {
        const db = readDB();
        const cargaisonIndex = db.cargaisons.findIndex(c => c.id === req.params.id);
        const { colisId } = req.body;
        
        if (cargaisonIndex !== -1) {
            if (!db.cargaisons[cargaisonIndex].colis) {
                db.cargaisons[cargaisonIndex].colis = [];
            }
            
            // Ajouter le colis si pas déjà présent
            if (!db.cargaisons[cargaisonIndex].colis.includes(colisId)) {
                db.cargaisons[cargaisonIndex].colis.push(colisId);
                
                // Mettre à jour le cargaisonId du colis
                const colisIndex = db.colis.findIndex(c => c.id === colisId);
                if (colisIndex !== -1) {
                    db.colis[colisIndex].cargaisonId = req.params.id;
                    
                    // Mettre à jour le poids de la cargaison
                    const poidsColis = db.colis[colisIndex].poids || 0;
                    const poidsActuel = db.cargaisons[cargaisonIndex].poidsActuel || 0;
                    db.cargaisons[cargaisonIndex].poidsActuel = poidsActuel + poidsColis;
                }
            }
            
            if (writeDB(db)) {
                res.json({ success: true });
            } else {
                res.status(500).json({ error: 'Erreur sauvegarde' });
            }
        } else {
            res.status(404).json({ error: 'Cargaison non trouvée' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Erreur serveur' });
    }
});

// Démarrage du serveur
app.listen(PORT, () => {
    console.log(`🚀 Serveur API démarré sur http://localhost:${PORT}`);
    console.log(`📊 Base de données: ${DB_PATH}`);
});

// Gestion d'arrêt propre
process.on('SIGINT', () => {
    console.log('\n👋 Arrêt du serveur API...');
    process.exit(0);
});
