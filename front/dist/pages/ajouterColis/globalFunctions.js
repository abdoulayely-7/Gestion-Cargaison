// Gestionnaire pour exposer les fonctions au contexte global de manière typée
/**
 * Classe pour gérer l'exposition des fonctions au contexte global
 */
export class GlobalFunctionManager {
    /**
     * Expose les fonctions dans le contexte global de manière typée
     */
    static exposeGlobalFunctions(functions) {
        // Créer un namespace pour éviter la pollution globale
        window.colisFormFunctions = functions;
        // Pour la compatibilité avec le HTML existant, exposer aussi directement
        Object.entries(functions).forEach(([key, value]) => {
            window[key] = value;
        });
    }
    /**
     * Nettoie les fonctions globales
     */
    static cleanupGlobalFunctions() {
        if (window.colisFormFunctions) {
            Object.keys(window.colisFormFunctions).forEach(key => {
                delete window[key];
            });
            delete window.colisFormFunctions;
        }
    }
}
//# sourceMappingURL=globalFunctions.js.map