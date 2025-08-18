import { AjouterColisController } from "../controllers/AjouterColisController.js";
// Variables globales pour l'accès depuis HTML
let controllerInstance;
// Initialisation
document.addEventListener('DOMContentLoaded', function () {
    controllerInstance = new AjouterColisController();
});
// Fonctions globales exposées pour l'HTML
window.allerEtapeSuivante = () => controllerInstance?.allerEtapeSuivante();
window.allerEtapePrecedente = () => controllerInstance?.allerEtapePrecedente();
window.afficherSousOptions = () => controllerInstance?.afficherSousOptions();
window.afficherContraintesMetier = () => controllerInstance?.afficherContraintesMetier();
window.calculerTarif = () => controllerInstance?.calculerTarif();
// Fonctions utilitaires pour les modales
window.genererRecu = () => {
    // Implémentation de génération de reçu
    console.log('Génération du reçu...');
};
window.nouveauColis = () => {
    // Réinitialisation du formulaire
    window.location.reload();
};
window.retourDashboard = () => {
    window.location.href = '../dashboard/dashboard.html';
};
window.annulerFormulaire = () => {
    if (confirm('Êtes-vous sûr de vouloir annuler ? Toutes les données saisies seront perdues.')) {
        window.retourDashboard();
    }
};
//# sourceMappingURL=ajouterColisRefactored.js.map