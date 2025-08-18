import type { TarifResult } from './types.js';
/**
 * Gestionnaire des contraintes métier et calculs de tarifs
 */
export declare class BusinessRulesManager {
    /**
     * Affiche les sous-options selon le type de produit
     */
    static afficherSousOptions(): void;
    /**
     * Affiche les contraintes métier en temps réel
     */
    static afficherContraintesMetier(): void;
    /**
     * Calcule les tarifs selon les règles métier
     */
    static calculerTarif(): TarifResult | null;
    /**
     * Affiche le tarif calculé
     */
    private static afficherTarif;
    /**
     * Cache l'affichage du tarif
     */
    private static cacherAffichageTarif;
}
//# sourceMappingURL=businessRules.d.ts.map