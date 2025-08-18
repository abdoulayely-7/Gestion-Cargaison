import { Colis } from "../../models/Colis.js";
import { Cargaison } from "../../models/Cargaison.js";
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