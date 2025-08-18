interface GlobalFunctions {
    allerEtapeSuivante: (etape: number) => void;
    allerEtapePrecedente: (etape: number) => void;
    afficherSousOptions: () => void;
    afficherContraintesMetier: () => void;
    calculerTarif: () => void;
    genererRecu: () => void;
    nouveauColis: () => void;
    retourDashboard: () => void;
    annulerFormulaire: () => void;
}
declare global {
    interface Window {
        colisFormFunctions?: GlobalFunctions;
    }
}
/**
 * Classe pour gérer l'exposition des fonctions au contexte global
 */
export declare class GlobalFunctionManager {
    /**
     * Expose les fonctions dans le contexte global de manière typée
     */
    static exposeGlobalFunctions(functions: GlobalFunctions): void;
    /**
     * Nettoie les fonctions globales
     */
    static cleanupGlobalFunctions(): void;
}
export {};
//# sourceMappingURL=globalFunctions.d.ts.map