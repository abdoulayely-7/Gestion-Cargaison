/**
 * Gestionnaire de validation des formulaires
 */
export declare class FormValidator {
    /**
     * Valide les champs requis
     */
    static validerChamps(champs: string[]): boolean;
    /**
     * Valide l'étape expéditeur
     */
    static validerEtapeExpediteur(): boolean;
    /**
     * Valide l'étape destinataire
     */
    static validerEtapeDestinataire(): boolean;
    /**
     * Valide l'étape colis avec contraintes métier
     */
    static validerEtapeColis(): boolean;
    /**
     * Ajoute la validation en temps réel au formulaire
     */
    static ajouterValidationTempsReel(): void;
}
//# sourceMappingURL=validation.d.ts.map