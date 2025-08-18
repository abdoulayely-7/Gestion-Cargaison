import { showError } from "../../utils/messages.js";
import { TARIFS_CONFIG } from './tarifs.js';
import type { TarifResult } from './types.js';

/**
 * Gestionnaire des contraintes métier et calculs de tarifs
 */
export class BusinessRulesManager {

    /**
     * Affiche les sous-options selon le type de produit
     */
    static afficherSousOptions(): void {
        const typeProduit = (document.getElementById('type_produit') as HTMLSelectElement).value;
        const sousOptionsMateriel = document.getElementById('sous_options_materiel');
        const degreToxicite = document.getElementById('degre_toxicite');

        // Cacher toutes les sous-options
        if (sousOptionsMateriel) sousOptionsMateriel.classList.add('hidden');
        if (degreToxicite) degreToxicite.classList.add('hidden');

        // Afficher les bonnes sous-options
        if (typeProduit === 'materiel' && sousOptionsMateriel) {
            sousOptionsMateriel.classList.remove('hidden');
        } else if (typeProduit === 'chimique' && degreToxicite) {
            degreToxicite.classList.remove('hidden');
        }
    }

    /**
     * Affiche les contraintes métier en temps réel
     */
    static afficherContraintesMetier(): void {
        const typeProduit = (document.getElementById('type_produit') as HTMLSelectElement).value;
        const typeCargaison = (document.getElementById('type_cargaison') as HTMLSelectElement).value;
        const contraintesInfo = document.getElementById('contraintes_info');
        const contraintesDetails = document.getElementById('contraintes_details');

        if (!contraintesInfo || !contraintesDetails || !typeProduit || !typeCargaison) {
            if (contraintesInfo) contraintesInfo.classList.add('hidden');
            return;
        }

        let contraintes: string[] = [];

        // Analyser les contraintes selon les règles métier
        switch (typeProduit) {
            case 'chimique':
                if (typeCargaison !== 'maritime') {
                    contraintes.push('❌ Les colis chimiques doivent OBLIGATOIREMENT transiter par voie maritime.');
                } else {
                    contraintes.push('✅ Colis chimique compatible avec le transport maritime.');
                }
                break;
                
            case 'materiel':
                const sousType = (document.getElementById('sous_type_materiel') as HTMLSelectElement).value;
                if (sousType === 'fragile' && typeCargaison === 'maritime') {
                    contraintes.push('❌ Les matériels fragiles ne peuvent PAS passer par voie maritime.');
                } else if (sousType === 'fragile') {
                    contraintes.push('✅ Matériel fragile compatible avec le transport ' + (typeCargaison === 'aerien' ? 'aérien' : 'routier') + '.');
                } else if (sousType === 'incassable') {
                    contraintes.push('✅ Matériel incassable compatible avec tous les types de transport.');
                }
                break;
                
            case 'alimentaire':
                contraintes.push('✅ Produits alimentaires compatibles avec tous les types de transport.');
                break;
        }

        if (contraintes.length > 0) {
            contraintesDetails.innerHTML = contraintes.map(c => `<p>${c}</p>`).join('');
            contraintesInfo.classList.remove('hidden');
        } else {
            contraintesInfo.classList.add('hidden');
        }
    }

    /**
     * Calcule les tarifs selon les règles métier
     */
    static calculerTarif(): TarifResult | null {
        const nombreColis = parseInt((document.getElementById('nombre_colis') as HTMLInputElement).value) || 0;
        const poids = parseFloat((document.getElementById('poids') as HTMLInputElement).value) || 0;
        const typeProduit = (document.getElementById('type_produit') as HTMLSelectElement).value;
        const typeCargaison = (document.getElementById('type_cargaison') as HTMLSelectElement).value;
        const sousTypeProduit = (document.getElementById('sous_type_materiel') as HTMLSelectElement).value;

        if (!nombreColis || !poids || !typeProduit || !typeCargaison) {
            this.cacherAffichageTarif();
            return null;
        }

        try {
            // Validation des contraintes métier avant calcul
            const validation = TARIFS_CONFIG.validerContraintes(typeProduit, sousTypeProduit, typeCargaison);
            if (!validation.valide) {
                showError(validation.erreur!);
                this.cacherAffichageTarif();
                return null;
            }

            // Distance par défaut
            const distance = 100; // km par défaut
            
            // Calculer le prix selon les règles métier
            const prixParColis = TARIFS_CONFIG.calculerPrix(poids, typeProduit, typeCargaison, distance);
            const prixTotal = prixParColis * nombreColis;

            this.afficherTarif(prixParColis, prixTotal);
            
            return { prixParColis, prixTotal };
            
        } catch (error) {
            if (error instanceof Error) {
                showError(error.message);
            }
            this.cacherAffichageTarif();
            return null;
        }
    }

    /**
     * Affiche le tarif calculé
     */
    private static afficherTarif(prixParColis: number, prixTotal: number): void {
        const affichageTarif = document.getElementById('affichage_tarif');
        if (affichageTarif) {
            affichageTarif.classList.remove('hidden');
            
            (document.getElementById('prix_base') as HTMLElement).textContent = `${prixParColis.toLocaleString('fr-FR')} FCFA/colis`;
            (document.getElementById('prix_calcule') as HTMLElement).textContent = `${prixParColis.toLocaleString('fr-FR')} FCFA/colis`;
            (document.getElementById('prix_final') as HTMLElement).textContent = `${prixTotal.toLocaleString('fr-FR')} FCFA`;
        }
    }

    /**
     * Cache l'affichage du tarif
     */
    private static cacherAffichageTarif(): void {
        const affichageTarif = document.getElementById('affichage_tarif');
        if (affichageTarif) {
            affichageTarif.classList.add('hidden');
        }
    }
}
