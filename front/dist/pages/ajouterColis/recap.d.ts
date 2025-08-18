import type { ColisData } from './types.js';
/**
 * Gestionnaire du récapitulatif et affichage des données
 */
export declare class RecapManager {
    /**
     * Génère le récapitulatif complet
     */
    static genererRecapitulatif(): ColisData;
    /**
     * Affiche le récapitulatif de l'expéditeur
     */
    private static afficherRecapExpediteur;
    /**
     * Affiche le récapitulatif du destinataire
     */
    private static afficherRecapDestinataire;
    /**
     * Affiche le récapitulatif du colis
     */
    private static afficherRecapColis;
    /**
     * Obtient le label du type de produit
     */
    private static obtenirLabelTypeProduit;
    /**
     * Obtient le label du type de transport
     */
    private static obtenirLabelTransport;
}
//# sourceMappingURL=recap.d.ts.map