import type { ColisData, Expediteur, Destinataire } from './types.js';

/**
 * Gestionnaire du récapitulatif et affichage des données
 */
export class RecapManager {
    
    /**
     * Génère le récapitulatif complet
     */
    static genererRecapitulatif(): ColisData {
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

        // Créer l'objet ColisData
        const colisData: ColisData = {
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
        this.afficherRecapExpediteur(expediteur);
        this.afficherRecapDestinataire(destinataire);
        this.afficherRecapColis(colisData);

        return colisData;
    }

    /**
     * Affiche le récapitulatif de l'expéditeur
     */
    private static afficherRecapExpediteur(expediteur: Expediteur): void {
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

    /**
     * Affiche le récapitulatif du destinataire
     */
    private static afficherRecapDestinataire(destinataire: Destinataire): void {
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

    /**
     * Affiche le récapitulatif du colis
     */
    private static afficherRecapColis(colisData: ColisData): void {
        const container = document.getElementById('recap_colis');
        if (container) {
            let detailsProduit = this.obtenirLabelTypeProduit(colisData.typeProduit);
            
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
                    <p><strong>Transport:</strong> ${this.obtenirLabelTransport(colisData.typeCargaison)}</p>
                </div>
                <div>
                    <p><strong>Produit:</strong> ${colisData.libelleProduit}</p>
                    <p><strong>Prix:</strong> <span class="text-lg font-bold text-cyan-700">${colisData.prix.toLocaleString('fr-FR')} FCFA</span></p>
                </div>
                ${colisData.notes ? `<div class="md:col-span-3"><p><strong>Notes:</strong> ${colisData.notes}</p></div>` : ''}
            `;
        }
    }

    /**
     * Obtient le label du type de produit
     */
    private static obtenirLabelTypeProduit(type: string): string {
        const labels: { [key: string]: string } = {
            'alimentaire': 'Alimentaire',
            'chimique': 'Chimique',
            'materiel': 'Matériel'
        };
        return labels[type] || type;
    }

    /**
     * Obtient le label du type de transport
     */
    private static obtenirLabelTransport(type: string): string {
        const labels: { [key: string]: string } = {
            'maritime': 'Maritime',
            'aerien': 'Aérien',
            'routier': 'Routier'
        };
        return labels[type] || type;
    }
}
