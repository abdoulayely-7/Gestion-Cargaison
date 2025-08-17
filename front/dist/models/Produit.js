export class Produit {
    id;
    libelle;
    poids;
    type;
    constructor(id, libelle, poids, type) {
        this.id = id;
        this.libelle = libelle;
        this.poids = poids;
        this.type = type;
    }
    getId() {
        return this.id;
    }
    getLibelle() {
        return this.libelle;
    }
    getPoids() {
        return this.poids;
    }
    getType() {
        return this.type;
    }
    // ---- Setters ----
    setLibelle(libelle) {
        this.libelle = libelle;
    }
    setPoids(poids) {
        this.poids = poids;
    }
    setType(type) {
        this.type = type;
    }
}
//# sourceMappingURL=Produit.js.map