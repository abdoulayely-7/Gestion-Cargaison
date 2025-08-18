import { showSuccess, showError } from "../utils/messages.js";
// Imports des modules séparés
import {} from "./ajouterColis/types.js";
import { FormValidator } from "./ajouterColis/validation.js";
import { StepNavigator } from "./ajouterColis/navigation.js";
import { TARIFS_CONFIG } from "./ajouterColis/tarifs.js";
import { BusinessRulesManager } from "./ajouterColis/businessRules.js";
import { RecapManager } from "./ajouterColis/recap.js";
import { ColisApiManager } from "./ajouterColis/api.js";
import { ReceiptManager } from "./ajouterColis/receipt.js";
import { DOMEventManager } from "./ajouterColis/eventManager.js";
import { CargaisonAttribution } from "./ajouterColis/cargaisonAttribution.js";
// Variables globales
let navigator;
let colisData = {};
// Initialisation
document.addEventListener('DOMContentLoaded', function () {
    initializePage();
});
function initializePage() {
    // Initialiser Lucide icons
    if (typeof window.lucide !== 'undefined') {
        window.lucide.createIcons();
    }
    // Initialiser le navigateur d'étapes
    navigator = new StepNavigator();
    // Charger les cargaisons disponibles
    chargerCargaisonsDisponibles();
    // Ajouter le listener pour la soumission du formulaire
    const form = document.getElementById('ajouterColisForm');
    if (form) {
        form.addEventListener('submit', soumettreFormulaire);
    }
    // Initialiser les gestionnaires d'événements
    DOMEventManager.initializeEventListeners({
        allerEtapeSuivante: allerEtapeSuivante,
        allerEtapePrecedente: allerEtapePrecedente,
        afficherSousOptions: afficherSousOptions,
        afficherContraintesMetier: afficherContraintesMetier,
        calculerTarif: calculerTarif,
        genererRecu: genererRecu,
        nouveauColis: nouveauColis,
        retourDashboard: retourDashboard,
        annulerFormulaire: annulerFormulaire
    });
    // Validation du formulaire en temps réel
    ajouterValidationFormulaire();
}
// Navigation entre les étapes
function allerEtapeSuivante(etape) {
    navigator.allerEtapeSuivante(etape, validerEtapeActuelle, () => {
        if (etape === 4) {
            RecapManager.genererRecapitulatif();
        }
    });
}
function allerEtapePrecedente(etape) {
    navigator.allerEtapePrecedente(etape);
}
// Validation
function validerEtapeActuelle() {
    const etapeActuelle = navigator.getEtapeActuelle();
    return FormValidator.validerEtapeVisible(etapeActuelle);
}
// Gestion des sous-options et contraintes métier
function afficherSousOptions() {
    BusinessRulesManager.afficherSousOptions();
}
function afficherContraintesMetier() {
    BusinessRulesManager.afficherContraintesMetier();
}
// Calcul des tarifs
function calculerTarif() {
    const nombreColis = parseInt(document.getElementById('nombre_colis').value) || 0;
    const poids = parseFloat(document.getElementById('poids').value) || 0;
    const typeProduit = document.getElementById('type_produit').value;
    const typeCargaison = document.getElementById('type_cargaison').value;
    const sousTypeProduit = document.getElementById('sous_type_materiel').value;
    if (!nombreColis || !poids || !typeProduit || !typeCargaison) {
        cacherAffichageTarif();
        return;
    }
    try {
        // Validation des contraintes métier avant calcul
        const validation = TARIFS_CONFIG.validerContraintes(typeProduit, sousTypeProduit, typeCargaison);
        if (!validation.valide) {
            showError(validation.erreur);
            cacherAffichageTarif();
            return;
        }
        // Distance par défaut
        const distance = 100;
        // Calculer le prix selon les règles métier
        const prixParColis = TARIFS_CONFIG.calculerPrix(poids, typeProduit, typeCargaison, distance);
        const prixTotal = prixParColis * nombreColis;
        afficherTarif(prixParColis, prixParColis, prixTotal, nombreColis);
    }
    catch (error) {
        if (error instanceof Error) {
            showError(error.message);
        }
        cacherAffichageTarif();
    }
}
function afficherTarif(prixParColis, prixCalcule, prixTotal, nombreColis = 1) {
    const affichageTarif = document.getElementById('affichage_tarif');
    if (affichageTarif) {
        affichageTarif.classList.remove('hidden');
        document.getElementById('prix_base').textContent = `${prixParColis.toLocaleString('fr-FR')} FCFA/colis`;
        document.getElementById('prix_calcule').textContent = `${prixCalcule.toLocaleString('fr-FR')} FCFA/colis`;
        document.getElementById('prix_final').textContent = `${prixTotal.toLocaleString('fr-FR')} FCFA`;
    }
}
function cacherAffichageTarif() {
    const affichageTarif = document.getElementById('affichage_tarif');
    if (affichageTarif) {
        affichageTarif.classList.add('hidden');
    }
}
// Soumission du formulaire
async function soumettreFormulaire(event) {
    event.preventDefault();
    try {
        // Collecter toutes les données du formulaire
        colisData = collecterDonneesFormulaire();
        if (!colisData || !colisData.expediteur) {
            showError('Données du formulaire manquantes');
            return;
        }
        // Valider toutes les étapes
        if (!validerToutesLesEtapes()) {
            showError('Veuillez compléter correctement toutes les étapes');
            return;
        }
        // Obtenir la cargaison sélectionnée
        const cargaisonSelectionnee = obtenirCargaisonSelectionnee();
        // Envoyer à l'API avec l'ID de cargaison si sélectionné
        const codeTracking = await ColisApiManager.enregistrerColis(colisData, cargaisonSelectionnee);
        if (codeTracking) {
            colisData.code = codeTracking;
            if (cargaisonSelectionnee) {
                showSuccess(`Colis enregistré et attribué à la cargaison avec succès !`);
            }
            else {
                showSuccess('Colis enregistré avec succès !');
            }
            ReceiptManager.afficherModalSucces(codeTracking);
        }
    }
    catch (error) {
        console.error('Erreur:', error);
        showError('Erreur lors de l\'enregistrement du colis. Veuillez réessayer.');
    }
}
// Fonctions utilitaires
function collecterDonneesFormulaire() {
    const expediteur = {
        nom: document.getElementById('expediteur_nom').value,
        prenom: document.getElementById('expediteur_prenom').value,
        telephone: document.getElementById('expediteur_telephone').value,
        email: document.getElementById('expediteur_email').value,
        adresse: document.getElementById('expediteur_adresse').value
    };
    const destinataire = {
        nom: document.getElementById('destinataire_nom').value,
        prenom: document.getElementById('destinataire_prenom').value,
        telephone: document.getElementById('destinataire_telephone').value,
        email: document.getElementById('destinataire_email').value,
        adresse: document.getElementById('destinataire_adresse').value
    };
    const nombreColis = parseInt(document.getElementById('nombre_colis').value);
    const poids = parseFloat(document.getElementById('poids').value);
    const typeProduit = document.getElementById('type_produit').value;
    const typeCargaison = document.getElementById('type_cargaison').value;
    const libelleProduit = document.getElementById('libelle_produit').value;
    const notes = document.getElementById('notes').value;
    // Calculer le prix final
    const prixFinalText = document.getElementById('prix_final').textContent || '0 FCFA';
    const prix = parseInt(prixFinalText.replace(/[^\d]/g, ''));
    let donnees = {
        expediteur,
        destinataire,
        nombreColis,
        poids,
        typeProduit,
        libelleProduit,
        typeCargaison,
        notes,
        prix
    };
    // Gérer les options spécifiques
    if (typeProduit === 'materiel') {
        donnees.sousTypeProduit = document.getElementById('sous_type_materiel').value;
    }
    else if (typeProduit === 'chimique') {
        donnees.degreToxicite = parseInt(document.getElementById('toxicite').value);
    }
    return donnees;
}
function validerToutesLesEtapes() {
    try {
        // Valider chaque étape
        FormValidator.validerEtapeExpediteur();
        FormValidator.validerEtapeDestinataire();
        FormValidator.validerEtapeColis();
        return true;
    }
    catch (error) {
        console.error('Validation échouée:', error);
        return false;
    }
}
// Validation du formulaire en temps réel
function ajouterValidationFormulaire() {
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
// Actions du modal
function genererRecu() {
    if (!colisData || !colisData.code) {
        showError('Données du reçu manquantes');
        return;
    }
    ReceiptManager.genererRecu(colisData);
}
function nouveauColis() {
    reinitialiserFormulaire();
    navigator.reinitialiser();
    colisData = {};
}
function reinitialiserFormulaire() {
    const modal = document.getElementById('modalSucces');
    if (modal) {
        modal.classList.add('hidden');
    }
    // Réinitialiser le formulaire
    const form = document.getElementById('ajouterColisForm');
    if (form) {
        form.reset();
    }
    // Cacher l'affichage du tarif
    cacherAffichageTarif();
}
function retourDashboard() {
    window.location.href = '../dashboard/dashboard.html';
}
function annulerFormulaire() {
    if (confirm('Êtes-vous sûr de vouloir annuler ? Toutes les données saisies seront perdues.')) {
        retourDashboard();
    }
}
// Fonction pour obtenir la cargaison sélectionnée
function obtenirCargaisonSelectionnee() {
    const selectCargaison = document.getElementById('cargaison_existante');
    if (selectCargaison && selectCargaison.value) {
        return selectCargaison.value;
    }
    return undefined;
}
// Fonction pour charger les cargaisons disponibles
async function chargerCargaisonsDisponibles() {
    try {
        const cargaisonsDisponibles = await CargaisonAttribution.obtenirCargaisonsDisponiblesPourAffichage();
        const selectCargaison = document.getElementById('cargaison_existante');
        if (selectCargaison) {
            // Vider les options existantes
            selectCargaison.innerHTML = '<option value="">Sélectionner une cargaison...</option>';
            // Ajouter les cargaisons disponibles
            cargaisonsDisponibles.forEach(cargaison => {
                const option = document.createElement('option');
                option.value = cargaison.id;
                option.textContent = `${cargaison.numero} - ${cargaison.type} (${cargaison.poidsDisponible}kg dispo)`;
                selectCargaison.appendChild(option);
            });
            // Ajouter option pour créer une nouvelle cargaison
            const optionNouvelle = document.createElement('option');
            optionNouvelle.value = 'nouvelle';
            optionNouvelle.textContent = '+ Créer une nouvelle cargaison';
            selectCargaison.appendChild(optionNouvelle);
        }
    }
    catch (error) {
        console.error('Erreur lors du chargement des cargaisons:', error);
    }
}
// Rendre les fonctions disponibles globalement
window.allerEtapeSuivante = allerEtapeSuivante;
window.allerEtapePrecedente = allerEtapePrecedente;
window.afficherSousOptions = afficherSousOptions;
window.afficherContraintesMetier = afficherContraintesMetier;
window.calculerTarif = calculerTarif;
window.genererRecu = genererRecu;
window.nouveauColis = nouveauColis;
window.retourDashboard = retourDashboard;
window.annulerFormulaire = annulerFormulaire;
//# sourceMappingURL=ajouterColis.js.map