
export class DOMEventManager {
    
    /**
     * Initialise tous les event listeners
     */
    static initializeEventListeners(handlers: {
        allerEtapeSuivante: (etape: number) => void;
        allerEtapePrecedente: (etape: number) => void;
        afficherSousOptions: () => void;
        afficherContraintesMetier: () => void;
        calculerTarif: () => void;
        genererRecu: () => void;
        nouveauColis: () => void;
        retourDashboard: () => void;
        annulerFormulaire: () => void;
    }): void {
        
        // Event listeners pour les boutons de navigation
        document.addEventListener('click', (event) => {
            const target = event.target as HTMLElement;
            
            // Gestion des boutons "Suivant"
            if (target.matches('[data-action="etape-suivante"]')) {
                const etape = parseInt(target.getAttribute('data-etape') || '1');
                handlers.allerEtapeSuivante(etape);
            }
            
            // Gestion des boutons "Précédent"
            if (target.matches('[data-action="etape-precedente"]')) {
                const etape = parseInt(target.getAttribute('data-etape') || '1');
                handlers.allerEtapePrecedente(etape);
            }
            
            // Gestion des autres actions
            switch (target.getAttribute('data-action')) {
                case 'generer-recu':
                    handlers.genererRecu();
                    break;
                case 'nouveau-colis':
                    handlers.nouveauColis();
                    break;
                case 'retour-dashboard':
                    handlers.retourDashboard();
                    break;
                case 'annuler-formulaire':
                    handlers.annulerFormulaire();
                    break;
            }
        });
        
        // Event listeners pour les changements de formulaire
        document.addEventListener('change', (event) => {
            const target = event.target as HTMLElement;
            
            if (target.matches('#type_produit, #sous_type_materiel')) {
                handlers.afficherSousOptions();
            }
            
            if (target.matches('#type_produit, #type_cargaison, #sous_type_materiel')) {
                handlers.afficherContraintesMetier();
            }
            
            if (target.matches('#nombre_colis, #poids, #type_produit, #type_cargaison')) {
                handlers.calculerTarif();
            }
        });
        
        // Event listeners pour les inputs en temps réel
        document.addEventListener('input', (event) => {
            const target = event.target as HTMLElement;
            
            if (target.matches('#nombre_colis, #poids')) {
                handlers.calculerTarif();
            }
        });
    }
}
