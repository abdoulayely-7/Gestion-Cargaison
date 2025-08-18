import type { ColisData } from './types.js';
/**
 * Gestionnaire du reçu et modal de succès
 */
export declare class ReceiptManager {
    /**
     * Affiche le modal de succès
     */
    static afficherModalSucces(code: string): void;
    /**
     * Génère et imprime le reçu
     */
    static genererRecu(colisData: ColisData): void;
    /**
     * Génère le contenu HTML du reçu
     */
    private static genererContenuRecu;
    /**
     * Obtient le label du type de produit
     */
    private static obtenirLabelTypeProduit;
    /**
     * Obtient le label du type de transport
     */
    private static obtenirLabelTransport;
}
//# sourceMappingURL=receipt.d.ts.map