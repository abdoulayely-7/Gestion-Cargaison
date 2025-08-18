import { showError } from "../../utils/messages.js";
/**
 * Gestionnaire d'API pour l'enregistrement des colis
 */
export class ColisApiManager {
    static API_URL = 'http://localhost:3000/colis';
    /**
     * Enregistre un colis via l'API
     */
    static async enregistrerColis(colisData) {
        try {
            // Générer un code de suivi unique
            const codeTracking = this.genererCodeTracking();
            // Préparer les données pour l'API
            const donneesAPI = {
                code: codeTracking,
                etat: 'En attente',
                poids: colisData.poids,
                expediteur: {
                    ...colisData.expediteur,
                    id: Date.now() // ID temporaire
                },
                destinataire: {
                    ...colisData.destinataire,
                    id: Date.now() + 1 // ID temporaire
                },
                typeProduit: this.obtenirValeurTypeProduit(colisData.typeProduit),
                souTypeProduit: colisData.sousTypeProduit || null,
                libelleProduit: colisData.libelleProduit,
                degreToxicite: colisData.degreToxicite || null,
                typeCargaison: colisData.typeCargaison,
                dateEnregistrement: new Date().toISOString(),
                notes: colisData.notes || '',
                cargaisonId: null, // Sera attribué lors de l'affectation à une cargaison
                prix: colisData.prix
            };
            // Envoyer à l'API
            const response = await fetch(this.API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(donneesAPI)
            });
            if (response.ok) {
                return codeTracking;
            }
            else {
                throw new Error('Erreur lors de l\'enregistrement');
            }
        }
        catch (error) {
            console.error('Erreur:', error);
            showError('Erreur lors de l\'enregistrement du colis. Veuillez réessayer.');
            throw error;
        }
    }
    /**
     * Génère un code de tracking unique
     */
    static genererCodeTracking() {
        const prefix = 'COL';
        const timestamp = Date.now().toString().slice(-6);
        const random = Math.floor(Math.random() * 100).toString().padStart(2, '0');
        return `${prefix}${timestamp}${random}`;
    }
    /**
     * Convertit le type de produit pour l'API
     */
    static obtenirValeurTypeProduit(type) {
        const mapping = {
            'alimentaire': 'Alimentaire',
            'chimique': 'Chimique',
            'materiel': 'Materiel'
        };
        return mapping[type] || type;
    }
}
//# sourceMappingURL=api.js.map