/**
 * Service pour la gestion des cargaisons
 */
export declare class CargaisonService {
    private static readonly API_URL;
    /**
     * Obtient la liste des cargaisons disponibles
     */
    static obtenirCargaisonsDisponibles(): Promise<any[]>;
    /**
     * Calcule le poids disponible dans une cargaison
     */
    static calculerPoidsDisponible(cargaison: any): number;
    /**
     * Met à jour une cargaison avec un nouveau colis
     */
    static mettreAJourCargaison(cargaisonId: string, colisId: string): Promise<boolean>;
    /**
     * Met à jour complètement une cargaison avec de nouvelles données
     */
    static mettreAJourCargaisonComplete(cargaisonId: string, donneesMAJ: any): Promise<boolean>;
    /**
     * Crée une nouvelle cargaison
     */
    static creerCargaison(donneesCargaison: any): Promise<string | null>;
    /**
     * Obtient les détails d'une cargaison
     */
    static obtenirCargaison(id: string): Promise<any | null>;
}
//# sourceMappingURL=CargaisonService.d.ts.map