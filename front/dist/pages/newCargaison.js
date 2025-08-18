import { RouteService } from "../service/RouteService.js";
import { MaritimeService } from "../service/MaritimeService.js";
import { Colis } from "../models/Colis.js";
import { CargaisonType } from "../enums/CargaisonType.js";
import { Cargaison } from "../models/Cargaison.js";
import { ColisType } from "../enums/ColisType.js";
import { ColisEtat } from "../enums/ColisEtat.js";
import { CargaisonEtatAvancement } from "../enums/CargaisonEtatAvancement.js";
import { createCargaison } from "../api/cargaison/cargaison.js";
import { Validator } from "../utils/Validator.js";
import { ErreurMessages } from "../utils/erreurMessages.js";
// const typeTransport = document.getElementById("typeTransport") as HTMLSelectElement;
const mapContainer = document.getElementById("mapContainer");
const numeroCargaison = document.querySelector("#numeroCargaison");
// --- Inputs ---
const form = document.getElementById("form");
const typeTransport = document.getElementById("typeTransport");
const poidsMax = document.getElementById("poidsMax");
const lieuDepart = document.getElementById("lieuDepart");
const lieuArrivee = document.getElementById("lieuArrivee");
const distance = document.getElementById("distance");
// Colis
const expediteurNom = document.getElementById("expediteur_nom");
const expediteurPrenom = document.getElementById("expediteur_prenom");
const expediteurEmail = document.getElementById("expediteur_email");
const expediteurTel = document.getElementById("expediteur_telephone");
const destinataireNom = document.getElementById("destinataire_nom");
const destinatairePrenom = document.getElementById("destinataire_prenom");
const destinataireEmail = document.getElementById("destinataire_email");
const destinataireTel = document.getElementById("destinataire_telephone");
const poidsColis = document.getElementById("poids");
const typeProduit = document.getElementById("typeProduit");
let routeService = null;
let maritimeService = null;
mapContainer.style.display = "none"; // cacher par défaut
typeTransport.addEventListener("change", () => {
    if (typeTransport.value === "routier") {
        mapContainer.style.display = "block";
        maritimeService = null;
        if (!routeService)
            routeService = new RouteService("map", "distance", "erreur_api");
        routeService.map.invalidateSize();
    }
    else if (typeTransport.value === "maritime") {
        mapContainer.style.display = "block";
        routeService = null;
        if (!maritimeService)
            maritimeService = new MaritimeService("map", "distance", "lieuDepart", "lieuArrivee", "erreur_api");
        maritimeService.map.invalidateSize();
    }
    else {
        mapContainer.style.display = "none";
    }
});
numeroCargaison.value = `CARG${Date.now()}${Math.floor(Math.random() * 1000)}`;
form.addEventListener("submit", async (e) => {
    e.preventDefault();
    // --- Définir toutes les règles ---
    const rules = [
        // 🚚 Cargaison
        { element: typeTransport, validator: () => Validator.required(typeTransport.value), message: ErreurMessages.FR.typeTransport_required },
        { element: poidsMax, validator: () => Validator.required(poidsMax.value) && Number(poidsMax.value) > 0, message: ErreurMessages.FR.poidsMax_required },
        { element: lieuDepart, validator: () => Validator.required(lieuDepart.value), message: ErreurMessages.FR.lieuDepart_required },
        { element: lieuArrivee, validator: () => Validator.required(lieuArrivee.value), message: ErreurMessages.FR.lieuArrivee_required },
        { element: distance, validator: () => Validator.required(distance.value) && Number(distance.value) > 0, message: ErreurMessages.FR.distance_required },
        // 📦 Colis – Expéditeur
        { element: expediteurNom, validator: () => Validator.required(expediteurNom.value), message: ErreurMessages.FR.expediteur_nom_required },
        { element: expediteurPrenom, validator: () => Validator.required(expediteurPrenom.value), message: ErreurMessages.FR.expediteur_prenom_required },
        { element: expediteurEmail, validator: () => Validator.required(expediteurEmail.value), message: ErreurMessages.FR.expediteur_email_required },
        { element: expediteurEmail, validator: () => Validator.isEmail(expediteurEmail.value), message: ErreurMessages.FR.expediteur_email_invalid },
        { element: expediteurTel, validator: () => Validator.required(expediteurTel.value), message: ErreurMessages.FR.expediteur_tel_required },
        // 📦 Colis – Destinataire
        { element: destinataireNom, validator: () => Validator.required(destinataireNom.value), message: ErreurMessages.FR.destinataire_nom_required },
        { element: destinatairePrenom, validator: () => Validator.required(destinatairePrenom.value), message: ErreurMessages.FR.destinataire_prenom_required },
        { element: destinataireEmail, validator: () => Validator.required(destinataireEmail.value), message: ErreurMessages.FR.destinataire_email_required },
        { element: destinataireEmail, validator: () => Validator.isEmail(destinataireEmail.value), message: ErreurMessages.FR.destinataire_email_invalid },
        { element: destinataireTel, validator: () => Validator.required(destinataireTel.value), message: ErreurMessages.FR.destinataire_tel_required },
        // 📦 Infos colis
        { element: poidsColis, validator: () => Validator.required(poidsColis.value) && Number(poidsColis.value) > 0, message: ErreurMessages.FR.poidsColis_required },
        { element: typeProduit, validator: () => Validator.required(typeProduit.value), message: ErreurMessages.FR.typeProduit_required },
        {
            element: typeProduit,
            validator: () => {
                const transport = typeTransport.value;
                const produit = typeProduit.value;
                if (produit === ColisType.CHIMIQUE && transport === CargaisonType.MARITIME)
                    return false;
                if (produit === ColisType.MATERIEL_FRAGILE && !(transport === CargaisonType.AERIENNE || transport === CargaisonType.MARITIME))
                    return false;
                // if (produit === "alimentaire" && transport === "aerienne") return false;
                return true;
            },
            message: ErreurMessages.FR.colis_incompatible_transport
        }
    ];
    // --- Validation ---
    if (!Validator.validateRules(rules)) {
        return; // stoppe la soumission si une règle échoue
    }
    // --- Création de la cargaison ---
    const cargaison = new Cargaison(Number(poidsMax.value), typeTransport.value, lieuDepart.value, lieuArrivee.value, Number(distance.value), CargaisonEtatAvancement.EN_ATTENTE, "", "");
    // --- Création du premier colis ---
    const expediteur = {
        id: 0,
        nom: expediteurNom.value,
        prenom: expediteurPrenom.value,
        email: expediteurEmail.value,
        telephone: expediteurTel.value,
        adresse: "",
        password: ""
    };
    const destinataire = {
        id: 0,
        nom: destinataireNom.value,
        prenom: destinatairePrenom.value,
        email: destinataireEmail.value,
        telephone: destinataireTel.value,
        adresse: "",
        password: ""
    };
    const premierColis = new Colis(ColisEtat.EN_ATTENTE, Number(poidsColis.value), expediteur, destinataire, typeProduit.value, cargaison.type, new Date().toISOString(), "", "");
    // 🔎 Validation métier (poids colis vs cargaison)
    if (premierColis.poids > cargaison.poidsMax) {
        alert(ErreurMessages.FR.colis_poids_excede);
        return;
    }
    try {
        const nouvelleCargaison = await createCargaison(cargaison, premierColis);
        console.log("✅ Cargaison créée :", nouvelleCargaison);
        form.reset();
    }
    catch (err) {
        console.error("❌ Erreur lors de la création :", err);
        alert(ErreurMessages.FR.erreur_api);
    }
});
//# sourceMappingURL=newCargaison.js.map