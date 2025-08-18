import type { ValidationResult } from './types.js';
export declare const TARIFS_CONFIG: {
    prixMinimum: number;
    /**
     * Calcule le prix selon les règles métier définies dans Cargaison.ts
     */
    calculerPrix: (poids: number, typeProduit: string, typeCargaison: string, distance?: number) => number;
    /**
     * Valide les contraintes métier
     */
    validerContraintes: (typeProduit: string, sousTypeProduit: string | undefined, typeCargaison: string) => ValidationResult;
};
//# sourceMappingURL=tarifs.d.ts.map