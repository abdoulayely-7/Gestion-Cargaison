import { NavigationManager } from "../managers/NavigationManager.js";
import { CargaisonUIManager } from "../managers/CargaisonUIManager.js";
import { ValidationService } from "../services/ValidationService.js";
import { TarifService } from "../services/TarifService.js";
import { ColisService } from "../services/ColisService.js";
import { CargaisonService } from "../services/CargaisonService.js";
import { createCargaison } from "../api/cargaison/cargaison.js";
import { Cargaison } from "../models/Cargaison.js";
import { Colis } from "../models/Colis.js";
import { CargaisonType } from "../enums/CargaisonType.js";
import { CargaisonEtatAvancement } from "../enums/CargaisonEtatAvancement.js";
import { ColisType } from "../enums/ColisType.js";
import { ColisEtat } from "../enums/ColisEtat.js";
import { showSuccess, showError } from "../utils/messages.js";
export class AjouterColisController {
    navigationManager;
    cargaisonUIManager;
    colisData = {};
    constructor() {
        this.navigationManager = new NavigationManager();
        this.cargaisonUIManager = new CargaisonUIManager();
        this.initialiser();
    }
    async initialiser() {
        await this.cargaisonUIManager.initialiser();
        this.configurerEventListeners();
        this.configurerValidationFormulaire();
    }
    configurerEventListeners() {
        const form = document.getElementById('colisForm');
        if (form) {
            form.addEventListener('submit', (e) => this.soumettreFormulaire(e));
        }
        // Configurer les event listeners pour les changements de produit
        const typeProduitSelect = document.getElementById('type_produit');
        if (typeProduitSelect) {
            typeProduitSelect.addEventListener('change', () => {
                this.afficherSousOptions();
                this.afficherContraintesMetier();
                this.calculerTarif();
            });
        }
        // Event listeners pour les autres champs influençant le tarif
        const champsInfluencantTarif = ['nombre_colis', 'poids', 'type_cargaison', 'sous_type_materiel'];
        champsInfluencantTarif.forEach(champId => {
            const element = document.getElementById(champId);
            if (element) {
                element.addEventListener('input', () => this.calculerTarif());
                element.addEventListener('change', () => {
                    this.afficherContraintesMetier();
                    this.calculerTarif();
                });
            }
        });
    }
    configurerValidationFormulaire() {
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
    validerEtapeActuelle() {
        try {
            const etapeActuelle = this.navigationManager.getEtapeActuelle();
            switch (etapeActuelle) {
                case 1:
                    return ValidationService.validerEtapeExpediteur();
                case 2:
                    return ValidationService.validerEtapeDestinataire();
                case 3:
                    return ValidationService.validerEtapeColis();
                default:
                    return true;
            }
        }
        catch (error) {
            if (error instanceof Error) {
                showError(error.message);
            }
            return false;
        }
    }
    allerEtapeSuivante() {
        if (this.validerEtapeActuelle()) {
            this.navigationManager.allerEtapeSuivante();
            if (this.navigationManager.getEtapeActuelle() === 4) {
                this.genererRecapitulatif();
            }
        }
    }
    allerEtapePrecedente() {
        this.navigationManager.allerEtapePrecedente();
    }
    afficherSousOptions() {
        const typeProduit = document.getElementById('type_produit').value;
        const sousOptionsMateriel = document.getElementById('sous_options_materiel');
        const degreToxicite = document.getElementById('degre_toxicite');
        // Cacher toutes les sous-options
        if (sousOptionsMateriel)
            sousOptionsMateriel.classList.add('hidden');
        if (degreToxicite)
            degreToxicite.classList.add('hidden');
        // Afficher les bonnes sous-options
        if (typeProduit === 'materiel' && sousOptionsMateriel) {
            sousOptionsMateriel.classList.remove('hidden');
        }
        else if (typeProduit === 'chimique' && degreToxicite) {
            degreToxicite.classList.remove('hidden');
        }
    }
    afficherContraintesMetier() {
        const typeProduit = document.getElementById('type_produit').value;
        const typeCargaison = document.getElementById('type_cargaison').value;
        const contraintesInfo = document.getElementById('contraintes_info');
        const contraintesDetails = document.getElementById('contraintes_details');
        if (!contraintesInfo || !contraintesDetails || !typeProduit || !typeCargaison) {
            if (contraintesInfo)
                contraintesInfo.classList.add('hidden');
            return;
        }
        const sousType = document.getElementById('sous_type_materiel')?.value;
        const contraintes = TarifService.genererContraintesAffichage(typeProduit, typeCargaison, sousType);
        if (contraintes.length > 0) {
            contraintesDetails.innerHTML = contraintes.map(c => `<p>${c}</p>`).join('');
            contraintesInfo.classList.remove('hidden');
        }
        else {
            contraintesInfo.classList.add('hidden');
        }
    }
    calculerTarif() {
        const nombreColis = parseInt(document.getElementById('nombre_colis').value) || 0;
        const poids = parseFloat(document.getElementById('poids').value) || 0;
        const typeProduit = document.getElementById('type_produit').value;
        const typeCargaison = document.getElementById('type_cargaison').value;
        const sousTypeProduit = document.getElementById('sous_type_materiel')?.value;
        if (!nombreColis || !poids || !typeProduit || !typeCargaison) {
            this.cacherAffichageTarif();
            return;
        }
        try {
            // Validation des contraintes métier avant calcul
            const validation = TarifService.validerContraintes(typeProduit, sousTypeProduit, typeCargaison);
            if (!validation.valide) {
                showError(validation.erreur);
                this.cacherAffichageTarif();
                return;
            }
            const distance = 100; // km par défaut
            const prixParColis = TarifService.calculerPrix(poids, typeProduit, typeCargaison, distance);
            const prixTotal = prixParColis * nombreColis;
            this.afficherTarif(prixParColis, prixTotal, nombreColis);
        }
        catch (error) {
            if (error instanceof Error) {
                showError(error.message);
            }
            this.cacherAffichageTarif();
        }
    }
    afficherTarif(prixParColis, prixTotal, nombreColis) {
        const affichageTarif = document.getElementById('affichage_tarif');
        if (affichageTarif) {
            affichageTarif.classList.remove('hidden');
            document.getElementById('prix_base').textContent = `${prixParColis.toLocaleString('fr-FR')} FCFA/colis`;
            document.getElementById('prix_calcule').textContent = `${prixParColis.toLocaleString('fr-FR')} FCFA/colis`;
            document.getElementById('prix_final').textContent = `${prixTotal.toLocaleString('fr-FR')} FCFA`;
        }
    }
    cacherAffichageTarif() {
        const affichageTarif = document.getElementById('affichage_tarif');
        if (affichageTarif) {
            affichageTarif.classList.add('hidden');
        }
    }
    genererRecapitulatif() {
        // Récupération et sauvegarde des données du formulaire
        // ... (logique de récapitulatif)
    }
    async soumettreFormulaire(event) {
        event.preventDefault();
        if (!this.colisData || !this.colisData.expediteur) {
            showError('Données du formulaire manquantes');
            return;
        }
        try {
            const codeTracking = ColisService.genererCodeTracking();
            const optionCargaison = this.cargaisonUIManager.getOptionSelectionnee();
            if (optionCargaison === 'existante') {
                await this.ajouterAColisExistant(codeTracking);
            }
            else {
                await this.creerNouvelleCargaisonAvecColis(codeTracking);
            }
            this.afficherModalSucces(codeTracking);
            this.colisData.code = codeTracking;
            showSuccess(`Colis enregistré avec succès ! Code de suivi: ${codeTracking}`);
        }
        catch (error) {
            console.error('Erreur:', error);
            showError('Erreur lors de l\'enregistrement du colis. Veuillez réessayer.');
        }
    }
    async ajouterAColisExistant(codeTracking) {
        const cargaisonId = this.cargaisonUIManager.getCargaisonSelectionnee();
        if (!cargaisonId) {
            throw new Error('Aucune cargaison sélectionnée');
        }
        const donneesAPI = ColisService.preparerDonneesAPI(this.colisData, codeTracking, cargaisonId);
        const nouveauColis = await ColisService.creerColis(donneesAPI);
        await CargaisonService.mettreAJourCargaison(cargaisonId, nouveauColis.id);
    }
    async creerNouvelleCargaisonAvecColis(codeTracking) {
        // Implémentation de la création d'une nouvelle cargaison
        // ... (logique simplifiée)
    }
    afficherModalSucces(code) {
        const modal = document.getElementById('modalSucces');
        const codeElement = document.getElementById('codeGenere');
        if (modal && codeElement) {
            codeElement.textContent = code;
            modal.classList.remove('hidden');
        }
    }
    /**
     * Obtient les données du colis actuel
     */
    getColisData() {
        return this.colisData || null;
    }
}
//# sourceMappingURL=AjouterColisController.js.map