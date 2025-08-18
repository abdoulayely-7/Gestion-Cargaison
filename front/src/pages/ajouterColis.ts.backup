import { showSuccess, showError } from "../utils/messages.js";

// Types et interfaces
interface Expediteur {
    nom: string;
    prenom: string;
    telephone: string;
    email?: string;
    adresse: string;
}

interface Destinataire {
    nom: string;
    prenom: string;
    telephone: string;
    email?: string;
    adresse: string;
}

interface ColisData {
    expediteur: Expediteur;
    destinataire: Destinataire;
    nombreColis: number;
    poids: number;
    typeProduit: string;
    sousTypeProduit?: string;
    libelleProduit: string;
    degreToxicite?: number;
    typeCargaison: string;
    notes?: string;
    prix: number;
    code?: string;
}

// Configuration des tarifs - Mise à jour selon les règles métier
const TARIFS_CONFIG = {
    prixMinimum: 10000,
    // Calculs selon les règles métier définies dans Cargaison.ts
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

        // Appliquer le prix minimum
        return Math.max(prix, TARIFS_CONFIG.prixMinimum);
    },
    
    // Validation des contraintes métier
    validerContraintes: (typeProduit: string, sousTypeProduit: string | undefined, typeCargaison: string): { valide: boolean; erreur?: string } => {
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

// Variables globales
let etapeActuelle = 1;
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

    // Ajouter les écouteurs d'événements
    const form = document.getElementById('ajouterColisForm') as HTMLFormElement;
    if (form) {
        form.addEventListener('submit', soumettreFormulaire);
    }

    // Valider le formulaire à chaque étape
    ajouterValidationFormulaire();
}

// Navigation entre les étapes
function allerEtapeSuivante(etape: number): void {
    if (validerEtapeActuelle()) {
        cacherEtapeActuelle();
        etapeActuelle = etape;
        afficherEtape(etape);
        mettreAJourIndicateurEtapes();
        
        if (etape === 4) {
            genererRecapitulatif();
        }
    }
}

function allerEtapePrecedente(etape: number): void {
    cacherEtapeActuelle();
    etapeActuelle = etape;
    afficherEtape(etape);
    mettreAJourIndicateurEtapes();
}

function cacherEtapeActuelle(): void {
    const etapeElement = document.getElementById(`etape${etapeActuelle}`);
    if (etapeElement) {
        etapeElement.classList.add('hidden');
    }
}

function afficherEtape(etape: number): void {
    const etapeElement = document.getElementById(`etape${etape}`);
    if (etapeElement) {
        etapeElement.classList.remove('hidden');
        etapeElement.classList.add('fade-in');
    }
}

function mettreAJourIndicateurEtapes(): void {
    for (let i = 1; i <= 4; i++) {
        const indicator = document.querySelector(`.step-indicator:nth-child(${i * 2 - 1})`) as HTMLElement;
        if (indicator) {
            indicator.classList.remove('active', 'completed');
            if (i < etapeActuelle) {
                indicator.classList.add('completed');
            } else if (i === etapeActuelle) {
                indicator.classList.add('active');
            }
        }
    }
    
    // Mettre à jour les labels
    const labels = ['Client', 'Destinataire', 'Colis', 'Confirmation'];
    const labelElements = document.querySelectorAll('.flex.items-center.justify-center.space-x-8 span');
    labelElements.forEach((label, index) => {
        label.classList.remove('text-cyan-600', 'text-green-600', 'text-gray-500');
        if (index + 1 < etapeActuelle) {
            label.classList.add('text-green-600');
        } else if (index + 1 === etapeActuelle) {
            label.classList.add('text-cyan-600');
        } else {
            label.classList.add('text-gray-500');
        }
    });
}

// Validation des étapes
function validerEtapeActuelle(): boolean {
    switch (etapeActuelle) {
        case 1:
            return validerEtapeExpediteur();
        case 2:
            return validerEtapeDestinataire();
        case 3:
            return validerEtapeColis();
        default:
            return true;
    }
}

function validerEtapeExpediteur(): boolean {
    const champs = ['expediteur_nom', 'expediteur_prenom', 'expediteur_telephone', 'expediteur_adresse'];
    return validerChamps(champs);
}

function validerEtapeDestinataire(): boolean {
    const champs = ['destinataire_nom', 'destinataire_prenom', 'destinataire_telephone', 'destinataire_adresse'];
    return validerChamps(champs);
}

function validerEtapeColis(): boolean {
    const champs = ['nombre_colis', 'poids', 'type_produit', 'type_cargaison', 'libelle_produit'];
    
    // Validation des champs de base
    if (!validerChamps(champs)) {
        return false;
    }

    const typeProduit = (document.getElementById('type_produit') as HTMLSelectElement).value;
    const typeCargaison = (document.getElementById('type_cargaison') as HTMLSelectElement).value;
    let sousTypeProduit = '';

    // Validation conditionnelle
    if (typeProduit === 'materiel') {
        const sousType = (document.getElementById('sous_type_materiel') as HTMLSelectElement).value;
        if (!sousType) {
            showError('Veuillez sélectionner le type de matériel');
            return false;
        }
        sousTypeProduit = sousType;
    }
    
    if (typeProduit === 'chimique') {
        const toxicite = (document.getElementById('toxicite') as HTMLSelectElement).value;
        if (!toxicite) {
            showError('Veuillez sélectionner le degré de toxicité');
            return false;
        }
    }

    // Validation des contraintes métier
    const validation = TARIFS_CONFIG.validerContraintes(typeProduit, sousTypeProduit, typeCargaison);
    if (!validation.valide) {
        showError(validation.erreur!);
        return false;
    }

    return true;
}

function validerChamps(champs: string[]): boolean {
    for (const champ of champs) {
        const element = document.getElementById(champ) as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;
        if (element && element.hasAttribute('required') && !element.value.trim()) {
            showError(`Le champ "${element.previousElementSibling?.textContent?.replace(' *', '') || champ}" est requis`);
            element.focus();
            return false;
        }
    }
    return true;
}

// Gestion des sous-options et contraintes métier
function afficherSousOptions(): void {
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

// Afficher les contraintes métier en temps réel
function afficherContraintesMetier(): void {
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

// Calcul des tarifs selon les règles métier
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

        // Distance par défaut (peut être récupérée d'une API géographique)
        const distance = 100; // km par défaut
        
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

// Génération du récapitulatif
function genererRecapitulatif(): void {
    // Récupérer toutes les données du formulaire
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

    // Sauvegarder les données
    colisData = {
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
        colisData.sousTypeProduit = (document.getElementById('sous_type_materiel') as HTMLSelectElement).value;
    } else if (typeProduit === 'chimique') {
        colisData.degreToxicite = parseInt((document.getElementById('toxicite') as HTMLSelectElement).value);
    }

    // Afficher le récapitulatif
    afficherRecapExpediteur(expediteur);
    afficherRecapDestinataire(destinataire);
    afficherRecapColis();
}

function afficherRecapExpediteur(expediteur: Expediteur): void {
    const container = document.getElementById('recap_expediteur');
    if (container) {
        container.innerHTML = `
            <p><strong>Nom:</strong> ${expediteur.nom} ${expediteur.prenom}</p>
            <p><strong>Téléphone:</strong> ${expediteur.telephone}</p>
            ${expediteur.email ? `<p><strong>Email:</strong> ${expediteur.email}</p>` : ''}
            <p><strong>Adresse:</strong> ${expediteur.adresse}</p>
        `;
    }
}

function afficherRecapDestinataire(destinataire: Destinataire): void {
    const container = document.getElementById('recap_destinataire');
    if (container) {
        container.innerHTML = `
            <p><strong>Nom:</strong> ${destinataire.nom} ${destinataire.prenom}</p>
            <p><strong>Téléphone:</strong> ${destinataire.telephone}</p>
            ${destinataire.email ? `<p><strong>Email:</strong> ${destinataire.email}</p>` : ''}
            <p><strong>Adresse:</strong> ${destinataire.adresse}</p>
        `;
    }
}

function afficherRecapColis(): void {
    const container = document.getElementById('recap_colis');
    if (container && colisData) {
        let detailsProduit = obtenirLabelTypeProduit(colisData.typeProduit!);
        
        if (colisData.sousTypeProduit) {
            detailsProduit += ` (${colisData.sousTypeProduit})`;
        }
        
        if (colisData.degreToxicite) {
            detailsProduit += ` (Toxicité: ${colisData.degreToxicite}/5)`;
        }

        container.innerHTML = `
            <div>
                <p><strong>Nombre:</strong> ${colisData.nombreColis} colis</p>
                <p><strong>Poids total:</strong> ${colisData.poids} kg</p>
            </div>
            <div>
                <p><strong>Type:</strong> ${detailsProduit}</p>
                <p><strong>Transport:</strong> ${obtenirLabelTransport(colisData.typeCargaison!)}</p>
            </div>
            <div>
                <p><strong>Produit:</strong> ${colisData.libelleProduit}</p>
                <p><strong>Prix:</strong> <span class="text-lg font-bold text-cyan-700">${colisData.prix!.toLocaleString('fr-FR')} FCFA</span></p>
            </div>
            ${colisData.notes ? `<div class="md:col-span-3"><p><strong>Notes:</strong> ${colisData.notes}</p></div>` : ''}
        `;
    }
}

// Soumission du formulaire
async function soumettreFormulaire(event: Event): Promise<void> {
    event.preventDefault();
    
    if (!colisData || !colisData.expediteur) {
        showError('Données du formulaire manquantes');
        return;
    }

    try {
        // Générer un code de suivi unique
        const codeTracking = genererCodeTracking();
        
        // Préparer les données pour l'API
        const donneesAPI = {
            code: codeTracking,
            etat: 'En attente',
            poids: colisData.poids,
            expediteur: {
                ...colisData.expediteur,
                id: Date.now() // ID temporaire
            },
            destinataire: {
                ...colisData.destinataire,
                id: Date.now() + 1 // ID temporaire
            },
            typeProduit: obtenirValeurTypeProduit(colisData.typeProduit!),
            souTypeProduit: colisData.sousTypeProduit || null,
            libelleProduit: colisData.libelleProduit,
            degreToxicite: colisData.degreToxicite || null,
            typeCargaison: colisData.typeCargaison,
            dateEnregistrement: new Date().toISOString(),
            notes: colisData.notes || '',
            cargaisonId: null, // Sera attribué lors de l'affectation à une cargaison
            prix: colisData.prix
        };

        // Envoyer à l'API
        const response = await fetch('http://localhost:3000/colis', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(donneesAPI)
        });

        if (response.ok) {
            const colisEnregistre = await response.json();
            afficherModalSucces(codeTracking);
            
            // Sauvegarder pour le reçu
            colisData.code = codeTracking;
        } else {
            throw new Error('Erreur lors de l\'enregistrement');
        }
    } catch (error) {
        console.error('Erreur:', error);
        showError('Erreur lors de l\'enregistrement du colis. Veuillez réessayer.');
    }
}

// Génération du code de tracking
function genererCodeTracking(): string {
    const prefix = 'COL';
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.floor(Math.random() * 100).toString().padStart(2, '0');
    return `${prefix}${timestamp}${random}`;
}

// Fonctions utilitaires
function obtenirLabelTypeProduit(type: string): string {
    const labels: { [key: string]: string } = {
        'alimentaire': 'Alimentaire',
        'chimique': 'Chimique',
        'materiel': 'Matériel'
    };
    return labels[type] || type;
}

function obtenirLabelTransport(type: string): string {
    const labels: { [key: string]: string } = {
        'maritime': 'Maritime',
        'aerien': 'Aérien',
        'routier': 'Routier'
    };
    return labels[type] || type;
}

function obtenirValeurTypeProduit(type: string): string {
    // Conversion pour l'API
    const mapping: { [key: string]: string } = {
        'alimentaire': 'Alimentaire',
        'chimique': 'Chimique',
        'materiel': 'Materiel'
    };
    return mapping[type] || type;
}

// Modal de succès
function afficherModalSucces(code: string): void {
    const modal = document.getElementById('modalSucces');
    const codeElement = document.getElementById('codeGenere');
    
    if (modal && codeElement) {
        codeElement.textContent = code;
        modal.classList.remove('hidden');
    }
}

// Actions du modal
function genererRecu(): void {
    if (!colisData || !colisData.code) {
        showError('Données du reçu manquantes');
        return;
    }

    // Créer le contenu du reçu
    const contenuRecu = genererContenuRecu();
    
    // Ouvrir dans une nouvelle fenêtre pour impression
    const fenetreImpression = window.open('', '_blank');
    if (fenetreImpression) {
        fenetreImpression.document.write(contenuRecu);
        fenetreImpression.document.close();
        fenetreImpression.print();
    }
}

function genererContenuRecu(): string {
    const date = new Date().toLocaleDateString('fr-FR');
    const heure = new Date().toLocaleTimeString('fr-FR');
    
    return `
        <!DOCTYPE html>
        <html>
        <head>
            <title>Reçu de Colis - ${colisData.code}</title>
            <style>
                body { font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { text-align: center; border-bottom: 2px solid #0891b2; padding-bottom: 10px; margin-bottom: 20px; }
                .section { margin-bottom: 20px; }
                .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
                .label { font-weight: bold; }
                .code { font-size: 18px; font-weight: bold; color: #0891b2; }
                .prix { font-size: 20px; font-weight: bold; color: #059669; }
                .footer { text-align: center; font-size: 12px; color: #666; margin-top: 30px; border-top: 1px solid #ccc; padding-top: 10px; }
            </style>
        </head>
        <body>
            <div class="header">
                <h1>REÇU DE COLIS</h1>
                <p>Date: ${date} - ${heure}</p>
                <p class="code">Code de suivi: ${colisData.code}</p>
            </div>
            
            <div class="section">
                <h3>Informations du Colis</h3>
                <p><span class="label">Nombre de colis:</span> ${colisData.nombreColis}</p>
                <p><span class="label">Poids total:</span> ${colisData.poids} kg</p>
                <p><span class="label">Type de produit:</span> ${obtenirLabelTypeProduit(colisData.typeProduit!)}</p>
                <p><span class="label">Type de transport:</span> ${obtenirLabelTransport(colisData.typeCargaison!)}</p>
                <p><span class="label">Produit:</span> ${colisData.libelleProduit}</p>
                <p class="prix">Prix: ${colisData.prix!.toLocaleString('fr-FR')} FCFA</p>
            </div>
            
            <div class="grid">
                <div class="section">
                    <h3>Expéditeur</h3>
                    <p><span class="label">Nom:</span> ${colisData.expediteur!.nom} ${colisData.expediteur!.prenom}</p>
                    <p><span class="label">Téléphone:</span> ${colisData.expediteur!.telephone}</p>
                    ${colisData.expediteur!.email ? `<p><span class="label">Email:</span> ${colisData.expediteur!.email}</p>` : ''}
                    <p><span class="label">Adresse:</span> ${colisData.expediteur!.adresse}</p>
                </div>
                
                <div class="section">
                    <h3>Destinataire</h3>
                    <p><span class="label">Nom:</span> ${colisData.destinataire!.nom} ${colisData.destinataire!.prenom}</p>
                    <p><span class="label">Téléphone:</span> ${colisData.destinataire!.telephone}</p>
                    ${colisData.destinataire!.email ? `<p><span class="label">Email:</span> ${colisData.destinataire!.email}</p>` : ''}
                    <p><span class="label">Adresse:</span> ${colisData.destinataire!.adresse}</p>
                </div>
            </div>
            
            ${colisData.notes ? `<div class="section"><h3>Notes</h3><p>${colisData.notes}</p></div>` : ''}
            
            <div class="footer">
                <p>Le destinataire sera notifié par email ou SMS lors de l'arrivée du colis à destination.</p>
                <p>Conservez ce reçu pour toute réclamation. Code de suivi: ${colisData.code}</p>
            </div>
        </body>
        </html>
    `;
}

function nouveauColis(): void {
    const modal = document.getElementById('modalSucces');
    if (modal) {
        modal.classList.add('hidden');
    }
    
    // Réinitialiser le formulaire
    const form = document.getElementById('ajouterColisForm') as HTMLFormElement;
    if (form) {
        form.reset();
    }
    
    // Retourner à la première étape
    cacherEtapeActuelle();
    etapeActuelle = 1;
    afficherEtape(1);
    mettreAJourIndicateurEtapes();
    
    // Réinitialiser les données
    colisData = {};
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

// Validation du formulaire en temps réel
function ajouterValidationFormulaire(): void {
    // Validation du téléphone
    const telephones = ['expediteur_telephone', 'destinataire_telephone'];
    telephones.forEach(id => {
        const element = document.getElementById(id) as HTMLInputElement;
        if (element) {
            element.addEventListener('input', function() {
                // Supprimer tous les caractères non numériques sauf espaces et +
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
