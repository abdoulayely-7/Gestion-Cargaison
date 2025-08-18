export declare class DOMEventManager {
    /**
     * Initialise tous les event listeners
     */
    static initializeEventListeners(handlers: {
        allerEtapeSuivante: (etape: number) => void;
        allerEtapePrecedente: (etape: number) => void;
        afficherSousOptions: () => void;
        afficherContraintesMetier: () => void;
        calculerTarif: () => void;
        genererRecu: () => void;
        nouveauColis: () => void;
        retourDashboard: () => void;
        annulerFormulaire: () => void;
    }): void;
}
//# sourceMappingURL=eventManager.d.ts.map