import { CargaisonEtatGlobal } from "../enums/CargaisonEtatGlobal.js";
import { CargaisonEtatAvancement } from "../enums/CargaisonEtatAvancement.js";
import { CargaisonType } from "../enums/CargaisonType.js";
import type { Colis } from "./Colis.js";
export declare class Cargaison {
    poidsMax: number;
    type: CargaisonType;
    lieuDepart: string;
    lieuArrivee: string;
    distance: number;
    etatAvancement: CargaisonEtatAvancement;
    dateDepart?: string | undefined;
    dateArrivee?: string | undefined;
    id?: number;
    numero: string;
    etatGlobal: CargaisonEtatGlobal;
    colis: Colis[];
    prixTotalCargaison: number;
    constructor(poidsMax: number, type: CargaisonType, lieuDepart: string, lieuArrivee: string, distance: number, etatAvancement?: CargaisonEtatAvancement, dateDepart?: string | undefined, dateArrivee?: string | undefined);
    private calculerPrixColis;
    ajouterColis(colis: Colis): void;
    fermer(): void;
    rouvrir(): void;
}
//# sourceMappingURL=Cargaison.d.ts.map