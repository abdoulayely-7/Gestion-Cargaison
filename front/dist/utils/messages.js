/**
 * Fonctions utilitaires pour afficher des messages à l'utilisateur
 */
// Fonction pour afficher les messages de succès
export function showSuccess(message) {
    afficherMessage(message, 'success');
}
// Fonction pour afficher les messages d'erreur
export function showError(message) {
    afficherMessage(message, 'error');
}
// Fonction pour afficher les messages d'information
export function showInfo(message) {
    afficherMessage(message, 'info');
}
// Fonction générique pour afficher un message
function afficherMessage(message, type) {
    // Créer ou récupérer le conteneur de messages
    let messageContainer = document.getElementById('messageContainer');
    if (!messageContainer) {
        messageContainer = document.createElement('div');
        messageContainer.id = 'messageContainer';
        messageContainer.className = 'fixed top-4 right-4 z-50';
        document.body.appendChild(messageContainer);
    }
    // Configuration des styles selon le type
    const configs = {
        success: {
            bgColor: 'bg-green-100',
            borderColor: 'border-green-400',
            textColor: 'text-green-700',
            icon: `<svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                     <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
                   </svg>`
        },
        error: {
            bgColor: 'bg-red-100',
            borderColor: 'border-red-400',
            textColor: 'text-red-700',
            icon: `<svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                     <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"></path>
                   </svg>`
        },
        info: {
            bgColor: 'bg-blue-100',
            borderColor: 'border-blue-400',
            textColor: 'text-blue-700',
            icon: `<svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                     <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"></path>
                   </svg>`
        }
    };
    const config = configs[type];
    // Créer le message
    const messageElement = document.createElement('div');
    messageElement.className = `${config.bgColor} border ${config.borderColor} ${config.textColor} px-4 py-3 rounded mb-2 shadow-md max-w-sm`;
    messageElement.innerHTML = `
        <div class="flex items-center">
            ${config.icon}
            <span class="text-sm">${message}</span>
            <button onclick="this.parentElement.parentElement.remove()" class="ml-4 text-lg font-bold hover:opacity-70">&times;</button>
        </div>
    `;
    messageContainer.appendChild(messageElement);
    // Supprimer le message après 5 secondes
    setTimeout(() => {
        if (messageElement.parentNode) {
            messageElement.parentNode.removeChild(messageElement);
        }
    }, 5000);
}
// Fonction pour effacer tous les messages
export function clearMessages() {
    const messageContainer = document.getElementById('messageContainer');
    if (messageContainer) {
        messageContainer.innerHTML = '';
    }
}
//# sourceMappingURL=messages.js.map