import type { ColisData } from "../types/ColisTypes.js";
export declare class AjouterColisController {
    private navigationManager;
    private cargaisonUIManager;
    private colisData;
    constructor();
    private initialiser;
    private configurerEventListeners;
    private configurerValidationFormulaire;
    validerEtapeActuelle(): boolean;
    allerEtapeSuivante(): void;
    allerEtapePrecedente(): void;
    afficherSousOptions(): void;
    afficherContraintesMetier(): void;
    calculerTarif(): void;
    private afficherTarif;
    private cacherAffichageTarif;
    private genererRecapitulatif;
    private soumettreFormulaire;
    private ajouterAColisExistant;
    private creerNouvelleCargaisonAvecColis;
    private afficherModalSucces;
    /**
     * Obtient les données du colis actuel
     */
    getColisData(): ColisData | null;
}
//# sourceMappingURL=AjouterColisController.d.ts.map