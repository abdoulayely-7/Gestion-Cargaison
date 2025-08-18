// Gestionnaire pour exposer les fonctions au contexte global de manière typée

// Interface pour les fonctions globales
interface GlobalFunctions {
    allerEtapeSuivante: (etape: number) => void;
    allerEtapePrecedente: (etape: number) => void;
    afficherSousOptions: () => void;
    afficherContraintesMetier: () => void;
    calculerTarif: () => void;
    genererRecu: () => void;
    nouveauColis: () => void;
    retourDashboard: () => void;
    annulerFormulaire: () => void;
}

// Extension de l'interface Window pour inclure nos fonctions
declare global {
    interface Window {
        colisFormFunctions?: GlobalFunctions;
    }
}

/**
 * Classe pour gérer l'exposition des fonctions au contexte global
 */
export class GlobalFunctionManager {
    
    /**
     * Expose les fonctions dans le contexte global de manière typée
     */
    static exposeGlobalFunctions(functions: GlobalFunctions): void {
        // Créer un namespace pour éviter la pollution globale
        window.colisFormFunctions = functions;
        
        // Pour la compatibilité avec le HTML existant, exposer aussi directement
        Object.entries(functions).forEach(([key, value]) => {
            (window as any)[key] = value;
        });
    }
    
    /**
     * Nettoie les fonctions globales
     */
    static cleanupGlobalFunctions(): void {
        if (window.colisFormFunctions) {
            Object.keys(window.colisFormFunctions).forEach(key => {
                delete (window as any)[key];
            });
            delete window.colisFormFunctions;
        }
    }
}
