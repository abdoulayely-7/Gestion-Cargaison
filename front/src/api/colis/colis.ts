import { Colis } from "../../models/Colis.js";
import { API_URI } from "../../config/environnement.js";
import { ColisEtat } from "../../enums/ColisEtat.js";
import { ColisType } from "../../enums/ColisType.js";
import { CargaisonType } from "../../enums/CargaisonType.js";
import { CargaisonEtatAvancement } from "../../enums/CargaisonEtatAvancement.js";
import { Cargaison } from "../../models/Cargaison.js";
import type { User } from "../../interface/User.js";

export async function createColis(cargaisonId: number, colis: Colis): Promise<Colis> {
    const colisAvecLien = { ...colis, cargaisonId };
    const res = await fetch(`${API_URI}/colis`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(colisAvecLien),
    });
    return res.json();
}

export async function getByCargaison(cargaisonId: number): Promise<Colis[]> {
    const res = await fetch(`${API_URI}/colis?cargaisonId=${cargaisonId}`);
    return res.json();
}



interface ColisAPIResponse {
    id: number;
    code: string;
    typeProduit: string;
    poids: number;
    cargaisonId: number;
    etat: string;
    expediteur: {
        nom: string;
        prenom: string;
        telephone: string;
        adresse: string;
    };
    destinataire: {
        nom: string;
        prenom: string;
        telephone: string;
        adresse: string;
    };
    dateEnregistrement: string;
    dateLivraisonPrev?: string;
}

interface CargaisonAPIResponse {
    id: number;
    type: string;
    etat: string;
    distance: number;
    lieuDepart: string;
    lieuArrivee: string;
    dateDepart: string;
    dateArrivee: string;
    coordonneesDepart?: {
        lat: number;
        lng: number;
    };
    coordonneesArrivee?: {
        lat: number;
        lng: number;
    };
    positionActuelle?: {
        lat: number;
        lng: number;
        ville: string;
    };
}


/**
 * Récupère tous les colis depuis l'API
 */
export async function obtenirTousColis(): Promise<any[]> {
    try {
        const response = await fetch(`${API_URI}/colis`);
        if (!response.ok) {
            throw new Error(`Erreur HTTP: ${response.status}`);
        }
        const colis = await response.json();
        return colis;
    } catch (error) {
        console.error('Erreur lors de la récupération des colis:', error);
        throw error;
    }
}

/**
 * Marquer un colis comme récupéré
 */
export async function marquerColisRecupere(id: number): Promise<any> {
    try {
        const response = await fetch(`${API_URI}/colis/${id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
                etat: 'Récupéré',
                dateRecuperation: new Date().toISOString()
            }),
        });
        if (!response.ok) {
            throw new Error(`Erreur HTTP: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Erreur lors de la récupération du colis:', error);
        throw error;
    }
}

/**
 * Marquer un colis comme perdu
 */
export async function marquerColisPerdu(id: number, raisonPerte: string): Promise<any> {
    try {
        const response = await fetch(`${API_URI}/colis/${id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
                etat: 'Perdu',
                datePerte: new Date().toISOString(),
                raisonPerte: raisonPerte
            }),
        });
        if (!response.ok) {
            throw new Error(`Erreur HTTP: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Erreur lors du marquage du colis comme perdu:', error);
        throw error;
    }
}

/**
 * Archiver un colis manuellement
 */
export async function archiverColis(id: number): Promise<any> {
    try {
        const response = await fetch(`${API_URI}/colis/${id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
                etat: 'Archivé',
                dateArchivage: new Date().toISOString(),
                archivageManuel: true
            }),
        });
        if (!response.ok) {
            throw new Error(`Erreur HTTP: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Erreur lors de l\'archivage du colis:', error);
        throw error;
    }
}

/**
 * Changer l'état d'un colis
 */
export async function changerEtatColis(id: number, nouvelEtat: string): Promise<any> {
    try {
        const response = await fetch(`${API_URI}/colis/${id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
                etat: nouvelEtat,
                dateChangementEtat: new Date().toISOString()
            }),
        });
        if (!response.ok) {
            throw new Error(`Erreur HTTP: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Erreur lors du changement d\'état du colis:', error);
        throw error;
    }
}

/**
 * Obtenir un colis par son ID
 */
export async function obtenirColisParId(id: number): Promise<any | null> {
    try {
        const response = await fetch(`${API_URI}/colis/${id}`);
        if (!response.ok) {
            if (response.status === 404) {
                return null;
            }
            throw new Error(`Erreur HTTP: ${response.status}`);
        }
        const colis = await response.json();
        return colis;
    } catch (error) {
        console.error('Erreur lors de la récupération du colis:', error);
        throw error;
    }
}

/**
 * Annuler un colis (seulement si la cargaison n'est pas fermée)
 */
export async function annulerColis(id: number): Promise<any> {
    try {
        // D'abord, récupérer le colis pour vérifier sa cargaison
        const colis = await obtenirColisParId(id);
        if (!colis) {
            throw new Error('Colis non trouvé');
        }

        // Récupérer la cargaison pour vérifier son état
        const cargaisonResponse = await fetch(`${API_URI}/cargaisons/${colis.cargaisonId}`);
        if (!cargaisonResponse.ok) {
            throw new Error('Cargaison non trouvée');
        }
        const cargaison = await cargaisonResponse.json();

        // Vérifier si la cargaison est fermée
        if (cargaison.etatGlobal === 'Fermé') {
            throw new Error('Impossible d\'annuler : la cargaison est fermée');
        }

        // Annuler le colis
        const response = await fetch(`${API_URI}/colis/${id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
                etat: 'Annulé',
                dateAnnulation: new Date().toISOString()
            }),
        });
        
        if (!response.ok) {
            throw new Error(`Erreur HTTP: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Erreur lors de l\'annulation du colis:', error);
        throw error;
    }
}

/**
 * Calculer les informations d'avancement détaillées
 */
export function calculerInfosAvancement(colis: any, cargaison: any): {
    etat: string;
    message: string;
    estimation?: string;
    retard?: string;
    pourcentage: number;
} {
    const maintenant = new Date();
    const dateDepart = cargaison.dateDepart ? new Date(cargaison.dateDepart) : null;
    const dateArrivee = cargaison.dateArrivee ? new Date(cargaison.dateArrivee) : null;

    switch (colis.etat.toLowerCase()) {
        case 'en attente':
            return {
                etat: 'En attente',
                message: 'Votre colis est enregistré et en attente de traitement',
                pourcentage: 10
            };

        case 'en cours':
            if (dateArrivee) {
                const diffTime = dateArrivee.getTime() - maintenant.getTime();
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                const diffHours = Math.ceil(diffTime / (1000 * 60 * 60));

                if (diffTime > 0) {
                    // En avance ou à l'heure
                    if (diffDays > 1) {
                        return {
                            etat: 'En cours',
                            message: 'Votre colis est en transit',
                            estimation: `Arrive dans ${diffDays} jours`,
                            pourcentage: 50
                        };
                    } else if (diffHours > 1) {
                        return {
                            etat: 'En cours',
                            message: 'Votre colis est en transit',
                            estimation: `Arrive dans ${diffHours} heures`,
                            pourcentage: 75
                        };
                    } else {
                        return {
                            etat: 'En cours',
                            message: 'Votre colis arrive bientôt',
                            estimation: 'Arrive dans moins d\'une heure',
                            pourcentage: 90
                        };
                    }
                } else {
                    // En retard
                    const retardDays = Math.abs(diffDays);
                    const retardHours = Math.abs(diffHours);
                    
                    if (retardDays > 1) {
                        return {
                            etat: 'En cours',
                            message: 'Votre colis est en transit',
                            retard: `En retard de ${retardDays} jours`,
                            pourcentage: 60
                        };
                    } else {
                        return {
                            etat: 'En cours',
                            message: 'Votre colis est en transit',
                            retard: `En retard de ${retardHours} heures`,
                            pourcentage: 60
                        };
                    }
                }
            } else {
                return {
                    etat: 'En cours',
                    message: 'Votre colis est en transit',
                    pourcentage: 50
                };
            }

        case 'arrivé':
        case 'livré':
            return {
                etat: 'Arrivé',
                message: 'Votre colis est arrivé à destination et peut être récupéré',
                pourcentage: 100
            };

        case 'récupéré':
            return {
                etat: 'Récupéré',
                message: 'Votre colis a été récupéré avec succès',
                pourcentage: 100
            };

        case 'perdu':
            return {
                etat: 'Perdu',
                message: 'Malheureusement, votre colis a été signalé comme perdu. Veuillez contacter notre service client.',
                pourcentage: 0
            };

        case 'archivé':
            return {
                etat: 'Archivé',
                message: 'Votre colis a été archivé',
                pourcentage: 100
            };

        case 'annulé':
            return {
                etat: 'Annulé',
                message: 'Votre colis a été annulé',
                pourcentage: 0
            };

        default:
            return {
                etat: 'Inconnu',
                message: 'État inconnu',
                pourcentage: 0
            };
    }
}

/**
 * Rechercher un colis par code avec informations complètes
 */
export async function rechercherColisAvecInfos(code: string): Promise<{
    colis: any | null;
    cargaison: any | null;
    infosAvancement: any | null;
    existe: boolean;
    message?: string;
}> {
    try {
        // Rechercher le colis par code
        const colisResponse = await fetch(`${API_URI}/colis?code=${code}`);
        if (!colisResponse.ok) {
            throw new Error(`Erreur HTTP: ${colisResponse.status}`);
        }
        
        const colisList = await colisResponse.json();
        
        if (colisList.length === 0) {
            return {
                colis: null,
                cargaison: null,
                infosAvancement: null,
                existe: false,
                message: "Aucun colis trouvé avec ce code. Veuillez vérifier le code saisi."
            };
        }

        const colis = colisList[0];

        // Vérifier si le colis est annulé
        if (colis.etat === 'Annulé') {
            return {
                colis: colis,
                cargaison: null,
                infosAvancement: null,
                existe: false,
                message: "Ce colis a été annulé. Pour plus d'informations, veuillez contacter notre service client."
            };
        }

        // Récupérer la cargaison associée
        const cargaisonResponse = await fetch(`${API_URI}/cargaisons/${colis.cargaisonId}`);
        let cargaison = null;
        
        if (cargaisonResponse.ok) {
            cargaison = await cargaisonResponse.json();
        }

        // Calculer les informations d'avancement
        const infosAvancement = calculerInfosAvancement(colis, cargaison || {});

        return {
            colis: colis,
            cargaison: cargaison,
            infosAvancement: infosAvancement,
            existe: true
        };

    } catch (error) {
        console.error('Erreur lors de la recherche du colis:', error);
        throw error;
    }
}

export async function rechercherParCode(code: string): Promise<ColisAPIResponse | null> {
    try {
        const response = await fetch(`${API_URI}/colis?code=${code}`);
        
        if (!response.ok) {
            throw new Error(`HTTP Error: ${response.status}`);
        }
        
        const colis = await response.json();
        return colis.length > 0 ? colis[0] : null;
    } catch (error) {
        console.error('Erreur lors de la recherche de colis:', error);
        throw error;
    }
}

export async function obtenirCargaison(cargaisonId: number): Promise<CargaisonAPIResponse | null> {
    try {
        const response = await fetch(`${API_URI}/cargaisons/${cargaisonId}`);
        
        if (!response.ok) {
            throw new Error(`HTTP Error: ${response.status}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error('Erreur lors de la récupération de la cargaison:', error);
        throw error;
    }
}

export function obtenirProgressionEtat(etatCargaison: string): { step: number, message: string } {
    switch (etatCargaison) {
        case 'EN_ATTENTE':
            return { step: 1, message: 'Colis enregistré et en attente de traitement' };
        case 'EN_COURS':
            return { step: 2, message: 'En cours de transport - Arrivée prévue dans 2-3 jours' };
        case 'TRANSPORT':
            return { step: 3, message: 'Colis en transit vers sa destination' };
        case 'LIVRE':
            return { step: 4, message: 'Colis livré avec succès' };
        default:
            return { step: 1, message: 'État inconnu' };
    }
}

export function obtenirIconeTransport(type: string): string {
    switch (type) {
        case 'AERIEN': return 'plane';
        case 'MARITIME': return 'ship';
        case 'ROUTIER': return 'truck';
        default: return 'package';
    }
}

export function obtenirLabelTypeProduit(type: string): string {
    switch (type) {
        case 'ALIMENTAIRE': return 'Produit Alimentaire';
        case 'CHIMIQUE': return 'Produit Chimique';
        case 'MATERIEL_FRAGILE': return 'Matériel Fragile';
        case 'MATERIEL_INCASSABLE': return 'Matériel Incassable';
        default: return type;
    }
}

export function obtenirLabelTransport(type: string): string {
    switch (type) {
        case 'AERIEN': return 'Aérien';
        case 'MARITIME': return 'Maritime';
        case 'ROUTIER': return 'Routier';
        default: return type;
    }
}

export async function obtenirCoordonnees(address: string): Promise<{lat: number, lng: number} | null> {
    const coordinates: { [key: string]: {lat: number, lng: number} } = {};

    return coordinates[address] || null;
}

export function simulerPositionActuelle(departure: {lat: number, lng: number}, arrival: {lat: number, lng: number}, etat: string): {lat: number, lng: number} {
    // Simulation de position basée sur l'état
    let progress = 0;
    switch (etat) {
        case 'EN_ATTENTE':
            progress = 0;
            break;
        case 'EN_COURS':
            progress = 0.3; // 30% du trajet
            break;
        case 'TRANSPORT':
            progress = 0.7; // 70% du trajet
            break;
        case 'LIVRE':
            progress = 1;
            break;
        default:
            progress = 0;
    }

    const lat = departure.lat + (arrival.lat - departure.lat) * progress;
    const lng = departure.lng + (arrival.lng - departure.lng) * progress;
    
    return { lat, lng };
}

// Convertir les données API vers le modèle Colis
export function convertirReponseAPIVersColis(apiResponse: ColisAPIResponse): Colis {
    // Créer un objet User pour l'expéditeur et le destinataire
    const expediteur = {
        id: 0, // ID temporaire
        nom: apiResponse.expediteur.nom,
        prenom: apiResponse.expediteur.prenom,
        email: '', // Non disponible dans l'API
        password: '', // Non applicable
        telephone: apiResponse.expediteur.telephone,
        adresse: apiResponse.expediteur.adresse
    };

    const destinataire = {
        id: 0, // ID temporaire
        nom: apiResponse.destinataire.nom,
        prenom: apiResponse.destinataire.prenom,
        email: '', // Non disponible dans l'API
        password: '', // Non applicable
        telephone: apiResponse.destinataire.telephone,
        adresse: apiResponse.destinataire.adresse
    };

    const colis = new Colis(
        apiResponse.etat as ColisEtat,
        apiResponse.poids,
        expediteur,
        destinataire,
        apiResponse.typeProduit as any, 
        '' as any, 
        apiResponse.dateEnregistrement,
        apiResponse.dateLivraisonPrev
    );

    // Définir les propriétés calculées
    (colis as any).id = apiResponse.id;
    colis.code = apiResponse.code;

    return colis;
}

// Convertir les données API vers le modèle Cargaison
export function convertirReponseAPIVersCargaison(apiResponse: CargaisonAPIResponse): Cargaison {
    const cargaison = new Cargaison(
        0, // poidsMax - à définir selon les besoins
        // [], // colis - sera rempli séparément
        apiResponse.type as any, // Cast vers CargaisonType
        apiResponse.lieuDepart,
        apiResponse.lieuArrivee,
        apiResponse.distance,
        apiResponse.etat as any, // Cast vers CargaisonEtatAvancement
        apiResponse.dateDepart,
        apiResponse.dateArrivee
    );
    

    // Définir les propriétés calculées
    (cargaison as any).id = apiResponse.id;

    return cargaison;
}

export async function rechercherModeleColisModel(code: string): Promise<Colis | null> {
    const apiResponse = await rechercherParCode(code);
    return apiResponse ? convertirReponseAPIVersColis(apiResponse) : null;
}

export async function obtenirModeleCargaison(cargaisonId: number): Promise<Cargaison | null> {
    const apiResponse = await obtenirCargaison(cargaisonId);
    return apiResponse ? convertirReponseAPIVersCargaison(apiResponse) : null;
}

export async function obtenirColisAvecCargaison(code: string): Promise<{colis: Colis, cargaison: Cargaison} | null> {
    try {
        const colisApi = await rechercherParCode(code);
        if (!colisApi) return null;

        const cargaisonApi = await obtenirCargaison(colisApi.cargaisonId);
        if (!cargaisonApi) return null;

        const colis = convertirReponseAPIVersColis(colisApi);
        const cargaison = convertirReponseAPIVersCargaison(cargaisonApi);

        return { colis, cargaison };
    } catch (error) {
        console.error('Erreur lors de la récupération des données:', error);
        return null;
    }
}