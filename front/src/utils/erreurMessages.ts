export const ErreurMessages = {
    FR: {
        email_required: "L'email est requis.",
        email_invalid: "L'email n'est pas valide.",
        password_required: "Le mot de passe est requis.",
        password_min: "Le mot de passe doit contenir au moins 6 caractères.",
        login_failed: "Email ou mot de passe incorrect.",
        erreur_api: "Impossible de calculer un itinéraire routier pour ces points..",

        // --- Ajout Cargaison ---
        typeTransport_required: "Le type de transport est requis.",
        poidsMax_required: "Le poids maximum est requis et doit être supérieur à 0.",
        lieuDepart_required: "Le lieu de départ est requis.",
        lieuArrivee_required: "Le lieu d'arrivée est requis.",
        distance_required: "La distance doit être supérieure à 0.",

        // Colis - Expéditeur
        expediteur_nom_required: "Le nom de l'expéditeur est requis.",
        expediteur_prenom_required: "Le prénom de l'expéditeur est requis.",
        expediteur_email_required: "L'email de l'expéditeur est requis.",
        expediteur_email_invalid: "L'email de l'expéditeur n'est pas valide.",
        expediteur_tel_required: "Le téléphone de l'expéditeur est requis.",

        // Colis - Destinataire
        destinataire_nom_required: "Le nom du destinataire est requis.",
        destinataire_prenom_required: "Le prénom du destinataire est requis.",
        destinataire_email_required: "L'email du destinataire est requis.",
        destinataire_email_invalid: "L'email du destinataire n'est pas valide.",
        destinataire_tel_required: "Le téléphone du destinataire est requis.",

        // Colis - Infos colis
        poidsColis_required: "Le poids du colis est requis et doit être supérieur à 0.",
        typeProduit_required: "Le type de produit est requis.",
        colis_incompatible_transport: "Le type de produit n'est pas compatible avec ce type de transport.",
        colis_poids_excede: "Le poids du colis dépasse le poids maximum autorisé pour cette cargaison."
    },
    EN: {
        email_required: "Email is required.",
        email_invalid: "Email is not valid.",
        password_required: "Password is required.",
        password_min: "Password must be at least 6 characters.",
        login_failed: "Incorrect email or password."
        // Tu peux ajouter la version anglaise des messages cargaison si besoin
    }
};
