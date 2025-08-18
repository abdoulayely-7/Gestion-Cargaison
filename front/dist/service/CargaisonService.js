import { API_URI } from "../config/environnement.js";
/**
 * Service pour la gestion des cargaisons
 */
export class CargaisonService {
    static API_URL = `${API_URI}/api/cargaisons`;
    /**
     * Obtient la liste des cargaisons disponibles
     */
    static async obtenirCargaisonsDisponibles() {
        try {
            const response = await fetch(this.API_URL);
            if (response.ok) {
                const cargaisons = await response.json();
                // Filtrer les cargaisons disponibles (non complètes, non parties)
                return cargaisons.filter((cargaison) => cargaison.etatGlobal === 'En_cours' ||
                    cargaison.etatGlobal === 'En_attente');
            }
            return [];
        }
        catch (error) {
            console.error('Erreur lors de la récupération des cargaisons:', error);
            return [];
        }
    }
    /**
     * Calcule le poids disponible dans une cargaison
     */
    static calculerPoidsDisponible(cargaison) {
        const poidsMaximal = cargaison.poidsMaximal || 1000; // 1000kg par défaut
        const poidsActuel = cargaison.poidsActuel || 0;
        return Math.max(0, poidsMaximal - poidsActuel);
    }
    /**
     * Met à jour une cargaison avec un nouveau colis
     */
    static async mettreAJourCargaison(cargaisonId, colisId) {
        try {
            const response = await fetch(`${this.API_URL}/${cargaisonId}/colis`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ colisId })
            });
            return response.ok;
        }
        catch (error) {
            console.error('Erreur lors de la mise à jour de la cargaison:', error);
            return false;
        }
    }
    /**
     * Met à jour complètement une cargaison avec de nouvelles données
     */
    static async mettreAJourCargaisonComplete(cargaisonId, donneesMAJ) {
        try {
            const response = await fetch(`${this.API_URL}/${cargaisonId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(donneesMAJ)
            });
            return response.ok;
        }
        catch (error) {
            console.error('Erreur lors de la mise à jour complète de la cargaison:', error);
            return false;
        }
    }
    /**
     * Crée une nouvelle cargaison
     */
    static async creerCargaison(donneesCargaison) {
        try {
            const response = await fetch(this.API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(donneesCargaison)
            });
            if (response.ok) {
                const cargaison = await response.json();
                return cargaison.id;
            }
            return null;
        }
        catch (error) {
            console.error('Erreur lors de la création de la cargaison:', error);
            return null;
        }
    }
    /**
     * Obtient les détails d'une cargaison
     */
    static async obtenirCargaison(id) {
        try {
            const response = await fetch(`${this.API_URL}/${id}`);
            if (response.ok) {
                return await response.json();
            }
            return null;
        }
        catch (error) {
            console.error('Erreur lors de la récupération de la cargaison:', error);
            return null;
        }
    }
}
//# sourceMappingURL=CargaisonService.js.map