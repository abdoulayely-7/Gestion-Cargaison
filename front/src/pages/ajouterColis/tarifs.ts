import type { ValidationResult } from './types.js';

// Configuration des tarifs selon les règles métier
export const TARIFS_CONFIG = {
    prixMinimum: 10000,
    
    /**
     * Calcule le prix selon les règles métier définies dans Cargaison.ts
     */
    calculerPrix: (poids: number, typeProduit: string, typeCargaison: string, distance: number = 100): number => {
        let prix = 0;
        
        switch (typeProduit) {
            case 'alimentaire':
                if (typeCargaison === 'routier') prix = 100 * poids * distance;
                else if (typeCargaison === 'maritime') prix = 90 * poids * distance + 5000;
                else if (typeCargaison === 'aerien') prix = 300 * poids * distance;
                break;

            case 'chimique':
                if (typeCargaison !== 'maritime') {
                    throw new Error('Colis chimique doit transiter par voie maritime.');
                }
                prix = 500 * poids * distance + 10000;
                break;

            case 'materiel':
                if (typeCargaison === 'routier') prix = 200 * poids * distance;
                else if (typeCargaison === 'maritime') prix = 400 * poids * distance;
                else if (typeCargaison === 'aerien') prix = 1000 * poids * distance;
                break;
        }

        return Math.max(prix, TARIFS_CONFIG.prixMinimum);
    },
    
    /**
     * Valide les contraintes métier
     */
    validerContraintes: (typeProduit: string, sousTypeProduit: string | undefined, typeCargaison: string): ValidationResult => {
        switch (typeProduit) {
            case 'chimique':
                if (typeCargaison !== 'maritime') {
                    return {
                        valide: false,
                        erreur: 'Les colis chimiques doivent obligatoirement transiter par voie maritime.'
                    };
                }
                break;
                
            case 'materiel':
                if (sousTypeProduit === 'fragile' && typeCargaison === 'maritime') {
                    return {
                        valide: false,
                        erreur: 'Les matériels fragiles ne peuvent pas passer par voie maritime.'
                    };
                }
                break;
        }
        
        return { valide: true };
    }
};
