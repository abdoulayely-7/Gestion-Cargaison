import { Cargaison } from '../../models/Cargaison.js';
/**
 * Récupère toutes les cargaisons depuis l'API
 */
export declare function obtenirToutesCargaisons(): Promise<Cargaison[]>;
/**
 * Récupère une cargaison par son ID
 */
export declare function obtenirCargaisonParId(id: number): Promise<Cargaison | null>;
/**
 * Récupère les cargaisons par type
 */
export declare function obtenirCargaisonsParType(type: string): Promise<Cargaison[]>;
/**
 * Récupère les cargaisons par état d'avancement
 */
export declare function obtenirCargaisonsParEtat(etat: string): Promise<Cargaison[]>;
/**
 * Crée une nouvelle cargaison
 */
/**
 * Met à jour une cargaison existante
 */
export declare function mettreAJourCargaison(id: number, cargaison: Partial<Cargaison>): Promise<Cargaison>;
/**
 * Supprime une cargaison
 */
export declare function supprimerCargaison(id: number): Promise<void>;
/**
 * Ferme une cargaison (change l'état global à "Fermé")
 */
export declare function fermerCargaison(id: number): Promise<Cargaison>;
/**
 * Rouvre une cargaison (change l'état global à "Ouvert")
 * Seulement possible si l'état d'avancement est "En attente"
 */
export declare function rouvrirCargaison(id: number): Promise<Cargaison>;
/**
 * Vérifie si une cargaison peut être rouverte
 */
export declare function peutEtreRouverte(cargaison: any): boolean;
/**
 * Fonction utilitaire pour formater les coordonnées
 */
export declare function formaterCoordonnees(lieuDepart: string, lieuArrivee: string): {
    depart: string;
    arrivee: string;
};
/**
 * Fonction utilitaire pour calculer le pourcentage d'avancement
 */
export declare function calculerPourcentageAvancement(etatAvancement: string): number;
/**
 * Fonction utilitaire pour générer un numéro de cargaison
 */
export declare function genererNumeroCargaison(type: string): string;
//# sourceMappingURL=cargaison.d.ts.map