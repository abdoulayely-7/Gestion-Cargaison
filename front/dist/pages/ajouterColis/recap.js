/**
 * Gestionnaire du récapitulatif et affichage des données
 */
export class RecapManager {
    /**
     * Génère le récapitulatif complet
     */
    static genererRecapitulatif() {
        // Récupérer toutes les données du formulaire
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
        // Créer l'objet ColisData
        const colisData = {
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
            colisData.sousTypeProduit = document.getElementById('sous_type_materiel').value;
        }
        else if (typeProduit === 'chimique') {
            colisData.degreToxicite = parseInt(document.getElementById('toxicite').value);
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
    static afficherRecapExpediteur(expediteur) {
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
    static afficherRecapDestinataire(destinataire) {
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
    static afficherRecapColis(colisData) {
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
    static obtenirLabelTypeProduit(type) {
        const labels = {
            'alimentaire': 'Alimentaire',
            'chimique': 'Chimique',
            'materiel': 'Matériel'
        };
        return labels[type] || type;
    }
    /**
     * Obtient le label du type de transport
     */
    static obtenirLabelTransport(type) {
        const labels = {
            'maritime': 'Maritime',
            'aerien': 'Aérien',
            'routier': 'Routier'
        };
        return labels[type] || type;
    }
}
//# sourceMappingURL=recap.js.map