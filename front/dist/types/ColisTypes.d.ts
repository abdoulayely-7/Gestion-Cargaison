export interface Expediteur {
    nom: string;
    prenom: string;
    telephone: string;
    email?: string;
    adresse: string;
}
export interface Destinataire {
    nom: string;
    prenom: string;
    telephone: string;
    email?: string;
    adresse: string;
}
export interface ColisData {
    expediteur: Expediteur;
    destinataire: Destinataire;
    nombreColis: number;
    poids: number;
    typeProduit: string;
    sousTypeProduit?: string;
    libelleProduit: string;
    degreToxicite?: number;
    typeCargaison: string;
    notes?: string;
    prix: number;
    code?: string;
}
export interface ValidationResult {
    valide: boolean;
    erreur?: string;
}
//# sourceMappingURL=ColisTypes.d.ts.map