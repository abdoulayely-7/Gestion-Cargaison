import { showError } from "../../utils/messages.js";
import type { ColisData } from './types.js';

/**
 * Gestionnaire du reçu et modal de succès
 */
export class ReceiptManager {

    /**
     * Affiche le modal de succès
     */
    static afficherModalSucces(code: string): void {
        const modal = document.getElementById('modalSucces');
        const codeElement = document.getElementById('codeGenere');
        
        if (modal && codeElement) {
            codeElement.textContent = code;
            modal.classList.remove('hidden');
        }
    }

    /**
     * Génère et imprime le reçu
     */
    static genererRecu(colisData: ColisData): void {
        if (!colisData || !colisData.code) {
            showError('Données du reçu manquantes');
            return;
        }

        // Créer le contenu du reçu
        const contenuRecu = this.genererContenuRecu(colisData);
        
        // Ouvrir dans une nouvelle fenêtre pour impression
        const fenetreImpression = window.open('', '_blank');
        if (fenetreImpression) {
            fenetreImpression.document.write(contenuRecu);
            fenetreImpression.document.close();
            fenetreImpression.print();
        }
    }

    /**
     * Génère le contenu HTML du reçu
     */
    private static genererContenuRecu(colisData: ColisData): string {
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
                    <p><span class="label">Type de produit:</span> ${this.obtenirLabelTypeProduit(colisData.typeProduit)}</p>
                    <p><span class="label">Type de transport:</span> ${this.obtenirLabelTransport(colisData.typeCargaison)}</p>
                    <p><span class="label">Produit:</span> ${colisData.libelleProduit}</p>
                    <p class="prix">Prix: ${colisData.prix.toLocaleString('fr-FR')} FCFA</p>
                </div>
                
                <div class="grid">
                    <div class="section">
                        <h3>Expéditeur</h3>
                        <p><span class="label">Nom:</span> ${colisData.expediteur.nom} ${colisData.expediteur.prenom}</p>
                        <p><span class="label">Téléphone:</span> ${colisData.expediteur.telephone}</p>
                        ${colisData.expediteur.email ? `<p><span class="label">Email:</span> ${colisData.expediteur.email}</p>` : ''}
                        <p><span class="label">Adresse:</span> ${colisData.expediteur.adresse}</p>
                    </div>
                    
                    <div class="section">
                        <h3>Destinataire</h3>
                        <p><span class="label">Nom:</span> ${colisData.destinataire.nom} ${colisData.destinataire.prenom}</p>
                        <p><span class="label">Téléphone:</span> ${colisData.destinataire.telephone}</p>
                        ${colisData.destinataire.email ? `<p><span class="label">Email:</span> ${colisData.destinataire.email}</p>` : ''}
                        <p><span class="label">Adresse:</span> ${colisData.destinataire.adresse}</p>
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
