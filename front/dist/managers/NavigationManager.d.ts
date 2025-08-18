export declare class NavigationManager {
    private etapeActuelle;
    private readonly NOMBRE_ETAPES;
    constructor();
    private initialiserEventListeners;
    allerEtapeSuivante(): void;
    allerEtapePrecedente(): void;
    private cacherEtapeActuelle;
    private afficherEtape;
    private mettreAJourIndicateurEtapes;
    private mettreAJourLabels;
    getEtapeActuelle(): number;
    setEtapeActuelle(etape: number): void;
}
//# sourceMappingURL=NavigationManager.d.ts.map