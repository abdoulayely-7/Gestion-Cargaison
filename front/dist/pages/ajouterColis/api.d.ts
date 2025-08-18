import type { ColisData } from './types.js';
/**
 * Gestionnaire d'API pour l'enregistrement des colis
 */
export declare class ColisApiManager {
    private static readonly API_URL;
    /**
     * Enregistre un colis via l'API
     */
    static enregistrerColis(colisData: ColisData): Promise<string>;
    /**
     * Génère un code de tracking unique
     */
    private static genererCodeTracking;
    /**
     * Convertit le type de produit pour l'API
     */
    private static obtenirValeurTypeProduit;
}
//# sourceMappingURL=api.d.ts.map