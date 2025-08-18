export declare function obtenirIconeTypeTransport(type: string): string;
export declare function obtenirLabelTypeTransport(type: string): string;
export declare function obtenirCouleurTypeTransport(type: string): string;
export declare function obtenirLabelEtat(etat: string): string;
export declare function obtenirCouleurEtat(etat: string): string;
export declare function obtenirStyleEtatGlobal(etatGlobal: string): {
    couleur: string;
    icone: string;
};
export declare function formaterPrix(prix: number): string;
export declare function afficherCargaisons(cargaisons: any[]): void;
export declare function filtrerCargaisons(): void;
export declare function filtrerParType(type: string): Promise<void>;
export declare function filtrerParEtat(etat: string): Promise<void>;
declare function chargerCargaisons(): Promise<void>;
declare function voirDetailsCargaison(id: number): void;
declare function modifierCargaison(id: number): void;
declare function fermerCargaisonAction(id: number): Promise<void>;
declare function rouvrirCargaisonAction(id: number): Promise<void>;
export declare function rafraichirCargaisons(): Promise<void>;
export { chargerCargaisons, voirDetailsCargaison, modifierCargaison, fermerCargaisonAction, rouvrirCargaisonAction };
//# sourceMappingURL=listeCargaisons.d.ts.map