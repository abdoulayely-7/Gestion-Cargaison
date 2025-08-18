import { CargaisonService } from "../../service/CargaisonService.js";
import { showError, showSuccess } from "../../utils/messages.js";
import type { ColisData } from './types.js';

/**
 * Interface pour une cargaison
 */
interface Cargaison {
    id: string;
    poidsMax: number;
    poidsActuel?: number;
    etatGlobal: string;
    prixTransport: number;
    colis: string[];
    numero: string;
    type: string;
}

/**
 * Gestionnaire d'attribution des colis aux cargaisons
 */
export class CargaisonAttribution {
    
    /**
     * Attribue un colis à une cargaison disponible
     */
    static async attribuerColisACargaison(
        colisData: ColisData, 
        colisId: string, 
        cargaisonId?: string
    ): Promise<boolean> {
        try {
            let cargaisonCible: Cargaison | null = null;

            if (cargaisonId) {
                // Cargaison spécifiée par l'utilisateur
                cargaisonCible = await this.verifierCargaisonDisponible(cargaisonId, colisData.poids);
                if (!cargaisonCible) {
                    return false;
                }
            } else {
                // Trouver automatiquement une cargaison compatible
                cargaisonCible = await this.trouverCargaisonCompatible(colisData);
                if (!cargaisonCible) {
                    showError('Aucune cargaison disponible pour ce colis. Veuillez créer une nouvelle cargaison.');
                    return false;
                }
            }

            // Attribuer le colis à la cargaison
            const success = await this.effectuerAttribution(cargaisonCible, colisId, colisData.poids);
            
            if (success) {
                showSuccess(`Colis attribué à la cargaison ${cargaisonCible.numero}`);
                return true;
            }
            
            return false;
            
        } catch (error) {
            console.error('Erreur lors de l\'attribution:', error);
            showError('Erreur lors de l\'attribution du colis à la cargaison');
            return false;
        }
    }

    /**
     * Vérifie qu'une cargaison est disponible et peut accueillir le colis
     */
    private static async verifierCargaisonDisponible(
        cargaisonId: string, 
        poidsColis: number
    ): Promise<Cargaison | null> {
        try {
            const cargaison = await CargaisonService.obtenirCargaison(cargaisonId);
            
            if (!cargaison) {
                showError('Cargaison introuvable');
                return null;
            }

            // Vérifier l'état de la cargaison
            if (this.estCargaisonFermee(cargaison)) {
                showError('Cette cargaison est fermée et ne peut plus accepter de colis');
                return null;
            }

            // Vérifier la capacité de poids
            if (!this.peutAccueillirPoids(cargaison, poidsColis)) {
                const poidsDisponible = this.calculerPoidsDisponible(cargaison);
                showError(`Poids insuffisant. Disponible: ${poidsDisponible}kg, Requis: ${poidsColis}kg`);
                return null;
            }

            return cargaison;
            
        } catch (error) {
            console.error('Erreur lors de la vérification:', error);
            return null;
        }
    }

    /**
     * Trouve automatiquement une cargaison compatible
     */
    private static async trouverCargaisonCompatible(colisData: ColisData): Promise<Cargaison | null> {
        try {
            const cargaisonsDisponibles = await CargaisonService.obtenirCargaisonsDisponibles();
            
            // Filtrer les cargaisons compatibles
            const cargaisonsCompatibles = cargaisonsDisponibles.filter(cargaison => 
                !this.estCargaisonFermee(cargaison) &&
                this.peutAccueillirPoids(cargaison, colisData.poids) &&
                this.estTypeCompatible(cargaison, colisData.typeCargaison)
            );

            if (cargaisonsCompatibles.length === 0) {
                return null;
            }

            // Prioriser par capacité disponible (moins pleine en premier)
            cargaisonsCompatibles.sort((a, b) => {
                const poidsDispA = this.calculerPoidsDisponible(a);
                const poidsDispB = this.calculerPoidsDisponible(b);
                return poidsDispB - poidsDispA;
            });

            return cargaisonsCompatibles[0];
            
        } catch (error) {
            console.error('Erreur lors de la recherche:', error);
            return null;
        }
    }

    /**
     * Effectue l'attribution du colis à la cargaison
     */
    private static async effectuerAttribution(
        cargaison: Cargaison, 
        colisId: string, 
        poidsColis: number
    ): Promise<boolean> {
        try {
            // Mettre à jour la cargaison
            const nouveauPoidsActuel = (cargaison.poidsActuel || 0) + poidsColis;
            const nouveauxColis = [...cargaison.colis, colisId];
            
            const donneesMAJ = {
                poidsActuel: nouveauPoidsActuel,
                colis: nouveauxColis,
                // Mettre à jour le montant total si nécessaire
                montantTotal: (cargaison.prixTransport || 0) + this.calculerCoutColis(poidsColis)
            };

            const success = await CargaisonService.mettreAJourCargaisonComplete(cargaison.id, donneesMAJ);
            
            if (success) {
                console.log(`Colis ${colisId} attribué à la cargaison ${cargaison.numero}`);
                console.log(`Nouveau poids: ${nouveauPoidsActuel}kg/${cargaison.poidsMax}kg`);
            }
            
            return success;
            
        } catch (error) {
            console.error('Erreur lors de l\'attribution:', error);
            return false;
        }
    }

    /**
     * Vérifie si une cargaison est fermée
     */
    private static estCargaisonFermee(cargaison: Cargaison): boolean {
        const etatsFermes = ['Fermé', 'En transit', 'Livré', 'Annulé'];
        return etatsFermes.includes(cargaison.etatGlobal);
    }

    /**
     * Vérifie si une cargaison peut accueillir le poids
     */
    private static peutAccueillirPoids(cargaison: Cargaison, poidsColis: number): boolean {
        const poidsActuel = cargaison.poidsActuel || 0;
        const poidsDisponible = cargaison.poidsMax - poidsActuel;
        return poidsDisponible >= poidsColis;
    }

    /**
     * Calcule le poids disponible dans une cargaison
     */
    private static calculerPoidsDisponible(cargaison: Cargaison): number {
        const poidsActuel = cargaison.poidsActuel || 0;
        return Math.max(0, cargaison.poidsMax - poidsActuel);
    }

    /**
     * Vérifie la compatibilité de type de cargaison
     */
    private static estTypeCompatible(cargaison: Cargaison, typeColis: string): boolean {
        // Pour l'instant, on accepte tous les types
        // Peut être étendu pour des règles spécifiques
        return true;
    }

    /**
     * Calcule le coût du colis (peut être personnalisé)
     */
    private static calculerCoutColis(poids: number): number {
        // Exemple de calcul basé sur le poids
        const tarifParKg = 1000; // 1000 FCFA par kg
        return poids * tarifParKg;
    }

    /**
     * Obtient la liste des cargaisons disponibles pour affichage
     */
    static async obtenirCargaisonsDisponiblesPourAffichage(): Promise<any[]> {
        try {
            const cargaisons = await CargaisonService.obtenirCargaisonsDisponibles();
            
            return cargaisons
                .filter(cargaison => !this.estCargaisonFermee(cargaison))
                .map(cargaison => ({
                    id: cargaison.id,
                    numero: cargaison.numero,
                    type: cargaison.type,
                    poidsDisponible: this.calculerPoidsDisponible(cargaison),
                    poidsMax: cargaison.poidsMax,
                    etatGlobal: cargaison.etatGlobal,
                    nbColis: cargaison.colis.length
                }));
                
        } catch (error) {
            console.error('Erreur lors de la récupération:', error);
            return [];
        }
    }
}
