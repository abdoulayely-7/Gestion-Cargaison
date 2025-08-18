import type { ColisData } from './types.js';
/**
 * Gestionnaire d'attribution des colis aux cargaisons
 */
export declare class CargaisonAttribution {
    /**
     * Attribue un colis à une cargaison disponible
     */
    static attribuerColisACargaison(colisData: ColisData, colisId: string, cargaisonId?: string): Promise<boolean>;
    /**
     * Vérifie qu'une cargaison est disponible et peut accueillir le colis
     */
    private static verifierCargaisonDisponible;
    /**
     * Trouve automatiquement une cargaison compatible
     */
    private static trouverCargaisonCompatible;
    /**
     * Effectue l'attribution du colis à la cargaison
     */
    private static effectuerAttribution;
    /**
     * Vérifie si une cargaison est fermée
     */
    private static estCargaisonFermee;
    /**
     * Vérifie si une cargaison peut accueillir le poids
     */
    private static peutAccueillirPoids;
    /**
     * Calcule le poids disponible dans une cargaison
     */
    private static calculerPoidsDisponible;
    /**
     * Vérifie la compatibilité de type de cargaison
     */
    private static estTypeCompatible;
    /**
     * Calcule le coût du colis (peut être personnalisé)
     */
    private static calculerCoutColis;
    /**
     * Obtient la liste des cargaisons disponibles pour affichage
     */
    static obtenirCargaisonsDisponiblesPourAffichage(): Promise<any[]>;
}
//# sourceMappingURL=cargaisonAttribution.d.ts.map