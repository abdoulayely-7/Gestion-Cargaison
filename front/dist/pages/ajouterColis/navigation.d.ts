/**
 * Gestionnaire de navigation entre les étapes du formulaire
 */
export declare class StepNavigator {
    private etapeActuelle;
    private readonly nombreEtapes;
    /**
     * Aller à l'étape suivante
     */
    allerEtapeSuivante(etape: number, validationCallback: () => boolean, recapCallback?: () => void): void;
    /**
     * Aller à l'étape précédente
     */
    allerEtapePrecedente(etape: number): void;
    /**
     * Cacher l'étape actuelle
     */
    private cacherEtapeActuelle;
    /**
     * Afficher une étape
     */
    private afficherEtape;
    /**
     * Mettre à jour les indicateurs d'étapes
     */
    private mettreAJourIndicateurEtapes;
    /**
     * Réinitialiser à la première étape
     */
    reinitialiser(): void;
    /**
     * Obtenir l'étape actuelle
     */
    getEtapeActuelle(): number;
}
//# sourceMappingURL=navigation.d.ts.map