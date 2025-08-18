import type { Colis } from "../../models/Colis.js";
import { API_URI } from "../../config/environnement.js";

export async function createColis(cargaisonId: number, colis: Colis): Promise<Colis> {
    const colisAvecLien = { ...colis, cargaisonId };
    const res = await fetch(`${API_URI}/colis`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(colisAvecLien),
    });
    return res.json();
}

export async function getByCargaison(cargaisonId: number): Promise<Colis[]> {
    const res = await fetch(`${API_URI}/colis?cargaisonId=${cargaisonId}`);
    return res.json();
}
