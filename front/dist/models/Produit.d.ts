import type { ColisType } from "../enums/ColisType.js";
export declare class Produit {
    id: number;
    libelle: string;
    poids: number;
    type: ColisType;
    constructor(id: number, libelle: string, poids: number, type: ColisType);
    getId(): number;
    getLibelle(): string;
    getPoids(): number;
    getType(): ColisType;
    setLibelle(libelle: string): void;
    setPoids(poids: number): void;
    setType(type: ColisType): void;
}
//# sourceMappingURL=Produit.d.ts.map