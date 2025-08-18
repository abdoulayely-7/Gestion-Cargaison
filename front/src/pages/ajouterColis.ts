import { showSuccess, showError } from "../utils/messages.js";

// Imports des modules séparés
import { type ColisData, type Expediteur, type Destinataire } from "./ajouterColis/types.js";
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
let navigator: StepNavigator;
let colisData: Partial<ColisData> = {};

// Initialisation
document.addEventListener('DOMContentLoaded', function() {
    initializePage();
});

function initializePage(): void {
    // Initialiser Lucide icons
    if (typeof (window as any).lucide !== 'undefined') {
        (window as any).lucide.createIcons();
    }

    // Initialiser le navigateur d'étapes
    navigator = new StepNavigator();

    // Charger les cargaisons disponibles
    chargerCargaisonsDisponibles();

    // Ajouter le listener pour la soumission du formulaire
    const form = document.getElementById('ajouterColisForm') as HTMLFormElement;
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
function allerEtapeSuivante(etape: number): void {
    navigator.allerEtapeSuivante(etape, validerEtapeActuelle, () => {
        if (etape === 4) {
            RecapManager.genererRecapitulatif();
        }
    });
}

function allerEtapePrecedente(etape: number): void {
    navigator.allerEtapePrecedente(etape);
}

// Validation
function validerEtapeActuelle(): boolean {
    const etapeActuelle = navigator.getEtapeActuelle();
    return FormValidator.validerEtapeVisible(etapeActuelle);
}

// Gestion des sous-options et contraintes métier
function afficherSousOptions(): void {
    BusinessRulesManager.afficherSousOptions();
}

function afficherContraintesMetier(): void {
    BusinessRulesManager.afficherContraintesMetier();
}

// Calcul des tarifs
function calculerTarif(): void {
    const nombreColis = parseInt((document.getElementById('nombre_colis') as HTMLInputElement).value) || 0;
    const poids = parseFloat((document.getElementById('poids') as HTMLInputElement).value) || 0;
    const typeProduit = (document.getElementById('type_produit') as HTMLSelectElement).value;
    const typeCargaison = (document.getElementById('type_cargaison') as HTMLSelectElement).value;
    const sousTypeProduit = (document.getElementById('sous_type_materiel') as HTMLSelectElement).value;

    if (!nombreColis || !poids || !typeProduit || !typeCargaison) {
        cacherAffichageTarif();
        return;
    }

    try {
        // Validation des contraintes métier avant calcul
        const validation = TARIFS_CONFIG.validerContraintes(typeProduit, sousTypeProduit, typeCargaison);
        if (!validation.valide) {
            showError(validation.erreur!);
            cacherAffichageTarif();
            return;
        }

        // Distance par défaut
        const distance = 100;
        
        // Calculer le prix selon les règles métier
        const prixParColis = TARIFS_CONFIG.calculerPrix(poids, typeProduit, typeCargaison, distance);
        const prixTotal = prixParColis * nombreColis;

        afficherTarif(prixParColis, prixParColis, prixTotal, nombreColis);
        
    } catch (error) {
        if (error instanceof Error) {
            showError(error.message);
        }
        cacherAffichageTarif();
    }
}

function afficherTarif(prixParColis: number, prixCalcule: number, prixTotal: number, nombreColis: number = 1): void {
    const affichageTarif = document.getElementById('affichage_tarif');
    if (affichageTarif) {
        affichageTarif.classList.remove('hidden');
        
        (document.getElementById('prix_base') as HTMLElement).textContent = `${prixParColis.toLocaleString('fr-FR')} FCFA/colis`;
        (document.getElementById('prix_calcule') as HTMLElement).textContent = `${prixCalcule.toLocaleString('fr-FR')} FCFA/colis`;
        (document.getElementById('prix_final') as HTMLElement).textContent = `${prixTotal.toLocaleString('fr-FR')} FCFA`;
    }
}

function cacherAffichageTarif(): void {
    const affichageTarif = document.getElementById('affichage_tarif');
    if (affichageTarif) {
        affichageTarif.classList.add('hidden');
    }
}

// Soumission du formulaire
async function soumettreFormulaire(event: Event): Promise<void> {
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
        const codeTracking = await ColisApiManager.enregistrerColis(
            colisData as ColisData, 
            cargaisonSelectionnee
        );
        
        if (codeTracking) {
            colisData.code = codeTracking;
            
            if (cargaisonSelectionnee) {
                showSuccess(`Colis enregistré et attribué à la cargaison avec succès !`);
            } else {
                showSuccess('Colis enregistré avec succès !');
            }
            
            ReceiptManager.afficherModalSucces(codeTracking);
        }
        
    } catch (error) {
        console.error('Erreur:', error);
        showError('Erreur lors de l\'enregistrement du colis. Veuillez réessayer.');
    }
}

// Fonctions utilitaires
function collecterDonneesFormulaire(): Partial<ColisData> {
    const expediteur: Expediteur = {
        nom: (document.getElementById('expediteur_nom') as HTMLInputElement).value,
        prenom: (document.getElementById('expediteur_prenom') as HTMLInputElement).value,
        telephone: (document.getElementById('expediteur_telephone') as HTMLInputElement).value,
        email: (document.getElementById('expediteur_email') as HTMLInputElement).value,
        adresse: (document.getElementById('expediteur_adresse') as HTMLTextAreaElement).value
    };

    const destinataire: Destinataire = {
        nom: (document.getElementById('destinataire_nom') as HTMLInputElement).value,
        prenom: (document.getElementById('destinataire_prenom') as HTMLInputElement).value,
        telephone: (document.getElementById('destinataire_telephone') as HTMLInputElement).value,
        email: (document.getElementById('destinataire_email') as HTMLInputElement).value,
        adresse: (document.getElementById('destinataire_adresse') as HTMLTextAreaElement).value
    };

    const nombreColis = parseInt((document.getElementById('nombre_colis') as HTMLInputElement).value);
    const poids = parseFloat((document.getElementById('poids') as HTMLInputElement).value);
    const typeProduit = (document.getElementById('type_produit') as HTMLSelectElement).value;
    const typeCargaison = (document.getElementById('type_cargaison') as HTMLSelectElement).value;
    const libelleProduit = (document.getElementById('libelle_produit') as HTMLInputElement).value;
    const notes = (document.getElementById('notes') as HTMLTextAreaElement).value;

    // Calculer le prix final
    const prixFinalText = (document.getElementById('prix_final') as HTMLElement).textContent || '0 FCFA';
    const prix = parseInt(prixFinalText.replace(/[^\d]/g, ''));

    let donnees: Partial<ColisData> = {
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
        donnees.sousTypeProduit = (document.getElementById('sous_type_materiel') as HTMLSelectElement).value;
    } else if (typeProduit === 'chimique') {
        donnees.degreToxicite = parseInt((document.getElementById('toxicite') as HTMLSelectElement).value);
    }

    return donnees;
}

function validerToutesLesEtapes(): boolean {
    try {
        // Valider chaque étape
        FormValidator.validerEtapeExpediteur();
        FormValidator.validerEtapeDestinataire();
        FormValidator.validerEtapeColis();
        return true;
    } catch (error) {
        console.error('Validation échouée:', error);
        return false;
    }
}

// Validation du formulaire en temps réel
function ajouterValidationFormulaire(): void {
    // Validation du téléphone
    const telephones = ['expediteur_telephone', 'destinataire_telephone'];
    telephones.forEach(id => {
        const element = document.getElementById(id) as HTMLInputElement;
        if (element) {
            element.addEventListener('input', function() {
                this.value = this.value.replace(/[^\d\s+]/g, '');
            });
        }
    });

    // Validation du poids
    const poidsElement = document.getElementById('poids') as HTMLInputElement;
    if (poidsElement) {
        poidsElement.addEventListener('input', function() {
            if (parseFloat(this.value) <= 0) {
                this.setCustomValidity('Le poids doit être supérieur à 0');
            } else {
                this.setCustomValidity('');
            }
        });
    }

    // Validation du nombre de colis
    const nombreElement = document.getElementById('nombre_colis') as HTMLInputElement;
    if (nombreElement) {
        nombreElement.addEventListener('input', function() {
            if (parseInt(this.value) <= 0) {
                this.setCustomValidity('Le nombre de colis doit être supérieur à 0');
            } else {
                this.setCustomValidity('');
            }
        });
    }
}

// Actions du modal
function genererRecu(): void {
    if (!colisData || !colisData.code) {
        showError('Données du reçu manquantes');
        return;
    }
    ReceiptManager.genererRecu(colisData as ColisData);
}

function nouveauColis(): void {
    reinitialiserFormulaire();
    navigator.reinitialiser();
    colisData = {};
}

function reinitialiserFormulaire(): void {
    const modal = document.getElementById('modalSucces');
    if (modal) {
        modal.classList.add('hidden');
    }
    
    // Réinitialiser le formulaire
    const form = document.getElementById('ajouterColisForm') as HTMLFormElement;
    if (form) {
        form.reset();
    }
    
    // Cacher l'affichage du tarif
    cacherAffichageTarif();
}

function retourDashboard(): void {
    window.location.href = '../dashboard/dashboard.html';
}

function annulerFormulaire(): void {
    if (confirm('Êtes-vous sûr de vouloir annuler ? Toutes les données saisies seront perdues.')) {
        retourDashboard();
    }
}

// Fonction pour obtenir la cargaison sélectionnée
function obtenirCargaisonSelectionnee(): string | undefined {
    const selectCargaison = document.getElementById('cargaison_existante') as HTMLSelectElement;
    if (selectCargaison && selectCargaison.value) {
        return selectCargaison.value;
    }
    return undefined;
}

// Fonction pour charger les cargaisons disponibles
async function chargerCargaisonsDisponibles(): Promise<void> {
    try {
        const cargaisonsDisponibles = await CargaisonAttribution.obtenirCargaisonsDisponiblesPourAffichage();
        const selectCargaison = document.getElementById('cargaison_existante') as HTMLSelectElement;
        
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
    } catch (error) {
        console.error('Erreur lors du chargement des cargaisons:', error);
    }
}

// Rendre les fonctions disponibles globalement
(window as any).allerEtapeSuivante = allerEtapeSuivante;
(window as any).allerEtapePrecedente = allerEtapePrecedente;
(window as any).afficherSousOptions = afficherSousOptions;
(window as any).afficherContraintesMetier = afficherContraintesMetier;
(window as any).calculerTarif = calculerTarif;
(window as any).genererRecu = genererRecu;
(window as any).nouveauColis = nouveauColis;
(window as any).retourDashboard = retourDashboard;
(window as any).annulerFormulaire = annulerFormulaire;
