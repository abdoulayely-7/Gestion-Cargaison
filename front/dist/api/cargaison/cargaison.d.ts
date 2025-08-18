import type { Cargaison } from "../../models/Cargaison.js";
import type { Colis } from "../../models/Colis.js";
export declare function getAll(): Promise<Cargaison[]>;
export declare function createCargaison(cargaison: Cargaison, premierColis: Colis): Promise<Cargaison>;
export declare function update(cargaison: Cargaison): Promise<Cargaison>;
//# sourceMappingURL=cargaison.d.ts.map