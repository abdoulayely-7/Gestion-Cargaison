import { Colis } from "../../models/Colis.js";
import { Cargaison } from "../../models/Cargaison.js";
export declare function createColis(cargaisonId: number, colis: Colis): Promise<Colis>;
export declare function getByCargaison(cargaisonId: number): Promise<Colis[]>;
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
export declare function obtenirTousColis(): Promise<any[]>;
/**
 * Marquer un colis comme récupéré
 */
export declare function marquerColisRecupere(id: number): Promise<any>;
/**
 * Marquer un colis comme perdu
 */
export declare function marquerColisPerdu(id: number, raisonPerte: string): Promise<any>;
/**
 * Archiver un colis manuellement
 */
export declare function archiverColis(id: number): Promise<any>;
/**
 * Changer l'état d'un colis
 */
export declare function changerEtatColis(id: number, nouvelEtat: string): Promise<any>;
/**
 * Obtenir un colis par son ID
 */
export declare function obtenirColisParId(id: number): Promise<any | null>;
/**
 * Annuler un colis (seulement si la cargaison n'est pas fermée)
 */
export declare function annulerColis(id: number): Promise<any>;
/**
 * Calculer les informations d'avancement détaillées
 */
export declare function calculerInfosAvancement(colis: any, cargaison: any): {
    etat: string;
    message: string;
    estimation?: string;
    retard?: string;
    pourcentage: number;
};
/**
 * Rechercher un colis par code avec informations complètes
 */
export declare function rechercherColisAvecInfos(code: string): Promise<{
    colis: any | null;
    cargaison: any | null;
    infosAvancement: any | null;
    existe: boolean;
    message?: string;
}>;
export declare function rechercherParCode(code: string): Promise<ColisAPIResponse | null>;
export declare function obtenirCargaison(cargaisonId: number): Promise<CargaisonAPIResponse | null>;
export declare function obtenirProgressionEtat(etatCargaison: string): {
    step: number;
    message: string;
};
export declare function obtenirIconeTransport(type: string): string;
export declare function obtenirLabelTypeProduit(type: string): string;
export declare function obtenirLabelTransport(type: string): string;
export declare function obtenirCoordonnees(address: string): Promise<{
    lat: number;
    lng: number;
} | null>;
export declare function simulerPositionActuelle(departure: {
    lat: number;
    lng: number;
}, arrival: {
    lat: number;
    lng: number;
}, etat: string): {
    lat: number;
    lng: number;
};
export declare function convertirReponseAPIVersColis(apiResponse: ColisAPIResponse): Colis;
export declare function convertirReponseAPIVersCargaison(apiResponse: CargaisonAPIResponse): Cargaison;
export declare function rechercherModeleColisModel(code: string): Promise<Colis | null>;
export declare function obtenirModeleCargaison(cargaisonId: number): Promise<Cargaison | null>;
export declare function obtenirColisAvecCargaison(code: string): Promise<{
    colis: Colis;
    cargaison: Cargaison;
} | null>;
export {};
//# sourceMappingURL=colis.d.ts.map