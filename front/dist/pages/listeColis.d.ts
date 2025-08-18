interface ColisAPIResponse {
    id: number;
    code: string;
    etat: string;
    poids: number;
    expediteur: {
        id: number;
        nom: string;
        prenom: string;
        email: string;
        telephone: string;
        adresse: string;
        password: string;
    };
    destinataire: {
        id: number;
        nom: string;
        prenom: string;
        email: string;
        telephone: string;
        adresse: string;
        password: string;
    };
    typeProduit: string;
    souTypeProduit?: string;
    libelleProduit: string;
    degreToxicite?: number;
    typeCargaison: string;
    dateEnregistrement: string;
    notes: string;
    cargaisonId: number;
}
/**
 * Récupère un colis par son code
 */
export declare function obtenirColisParCode(code: string): Promise<ColisAPIResponse | null>;
/**
 * Récupère les colis par état
 */
export declare function obtenirColisParEtat(etat: string): Promise<ColisAPIResponse[]>;
/**
 * Récupère les colis par cargaison
 */
export declare function obtenirColisParCargaison(cargaisonId: number): Promise<ColisAPIResponse[]>;
export declare function obtenirIconeTypeProduit(typeProduit: string, souType?: string): string;
export declare function obtenirLabelTypeProduit(typeProduit: string, souType?: string): string;
export declare function obtenirCouleurTypeProduit(typeProduit: string, souType?: string): string;
export declare function obtenirLabelEtatColis(etat: string): string;
export declare function obtenirCouleurEtatColis(etat: string): string;
export declare function verifierReglesTransport(coli: ColisAPIResponse): {
    valide: boolean;
    message: string;
};
export declare function obtenirIndicateurToxicite(degre?: number): string;
export declare function formaterPoids(poids: number): string;
export declare function formaterDate(dateString: string): string;
export declare function afficherColis(colis: ColisAPIResponse[]): void;
export declare function filtrerColis(): void;
export declare function filtrerParEtat(etat: string): Promise<void>;
declare function chargerColis(): Promise<void>;
declare function voirDetailsColis(id: number): void;
declare function modifierColis(id: number): void;
export declare function rafraichirColis(): Promise<void>;
export { chargerColis, voirDetailsColis, modifierColis };
//# sourceMappingURL=listeColis.d.ts.map