import { showError } from "../../utils/messages.js";
import { TARIFS_CONFIG } from './tarifs.js';
/**
 * Gestionnaire de validation des formulaires
 */
export class FormValidator {
    /**
     * Valide les champs requis
     */
    static validerChamps(champs) {
        for (const champ of champs) {
            const element = document.getElementById(champ);
            if (element && element.hasAttribute('required') && !element.value.trim()) {
                showError(`Le champ "${element.previousElementSibling?.textContent?.replace(' *', '') || champ}" est requis`);
                element.focus();
                return false;
            }
        }
        return true;
    }
    /**
     * Valide l'étape expéditeur
     */
    static validerEtapeExpediteur() {
        const champs = ['expediteur_nom', 'expediteur_prenom', 'expediteur_telephone', 'expediteur_adresse'];
        return this.validerChamps(champs);
    }
    /**
     * Valide l'étape destinataire
     */
    static validerEtapeDestinataire() {
        const champs = ['destinataire_nom', 'destinataire_prenom', 'destinataire_telephone', 'destinataire_adresse'];
        return this.validerChamps(champs);
    }
    /**
     * Valide l'étape colis avec contraintes métier
     */
    static validerEtapeColis() {
        const champs = ['nombre_colis', 'poids', 'type_produit', 'type_cargaison', 'libelle_produit'];
        // Validation des champs de base
        if (!this.validerChamps(champs)) {
            return false;
        }
        const typeProduit = document.getElementById('type_produit').value;
        const typeCargaison = document.getElementById('type_cargaison').value;
        let sousTypeProduit = '';
        // Validation conditionnelle
        if (typeProduit === 'materiel') {
            const sousType = document.getElementById('sous_type_materiel').value;
            if (!sousType) {
                showError('Veuillez sélectionner le type de matériel');
                return false;
            }
            sousTypeProduit = sousType;
        }
        if (typeProduit === 'chimique') {
            const toxicite = document.getElementById('toxicite').value;
            if (!toxicite) {
                showError('Veuillez sélectionner le degré de toxicité');
                return false;
            }
        }
        // Validation des contraintes métier
        const validation = TARIFS_CONFIG.validerContraintes(typeProduit, sousTypeProduit, typeCargaison);
        if (!validation.valide) {
            showError(validation.erreur);
            return false;
        }
        return true;
    }
    /**
     * Ajoute la validation en temps réel au formulaire
     */
    static ajouterValidationTempsReel() {
        // Validation du téléphone
        const telephones = ['expediteur_telephone', 'destinataire_telephone'];
        telephones.forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element.addEventListener('input', function () {
                    this.value = this.value.replace(/[^\d\s+]/g, '');
                });
            }
        });
        // Validation du poids
        const poidsElement = document.getElementById('poids');
        if (poidsElement) {
            poidsElement.addEventListener('input', function () {
                if (parseFloat(this.value) <= 0) {
                    this.setCustomValidity('Le poids doit être supérieur à 0');
                }
                else {
                    this.setCustomValidity('');
                }
            });
        }
        // Validation du nombre de colis
        const nombreElement = document.getElementById('nombre_colis');
        if (nombreElement) {
            nombreElement.addEventListener('input', function () {
                if (parseInt(this.value) <= 0) {
                    this.setCustomValidity('Le nombre de colis doit être supérieur à 0');
                }
                else {
                    this.setCustomValidity('');
                }
            });
        }
    }
}
//# sourceMappingURL=validation.js.map