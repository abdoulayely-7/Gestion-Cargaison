import { showError } from "../../utils/messages.js";
import { API_URI } from "../../config/environnement.js";
import type { ColisData } from './types.js';

/**
 * Gestionnaire d'API pour l'enregistrement des colis
 */
export class ColisApiManager {
    private static readonly API_URL = `${API_URI}/api/colis`;

    /**
     * Enregistre un colis via l'API
     */
    static async enregistrerColis(colisData: ColisData, cargaisonId?: string): Promise<string> {
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
                cargaisonId: cargaisonId || null, // Attribution à une cargaison spécifique
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
                const result = await response.json();
                return result.code || codeTracking;
            } else {
                throw new Error('Erreur lors de l\'enregistrement');
            }
        } catch (error) {
            console.error('Erreur:', error);
            showError('Erreur lors de l\'enregistrement du colis. Veuillez réessayer.');
            throw error;
        }
    }

    /**
     * Génère un code de tracking unique
     */
    private static genererCodeTracking(): string {
        const prefix = 'COL';
        const timestamp = Date.now().toString().slice(-6);
        const random = Math.floor(Math.random() * 100).toString().padStart(2, '0');
        return `${prefix}${timestamp}${random}`;
    }

    /**
     * Convertit le type de produit pour l'API
     */
    private static obtenirValeurTypeProduit(type: string): string {
        const mapping: { [key: string]: string } = {
            'alimentaire': 'Alimentaire',
            'chimique': 'Chimique',
            'materiel': 'Materiel'
        };
        return mapping[type] || type;
    }
}
