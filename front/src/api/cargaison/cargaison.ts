import { API_URI } from "../../config/environnement.js";
import type { Cargaison } from "../../models/Cargaison.js";
import type { Colis } from "../../models/Colis.js";

// Récupérer toutes les cargaisons
export async function getAll(): Promise<Cargaison[]> {
    const res = await fetch(`${API_URI}/cargaisons?_embed=colis`);
    return res.json();
}

// Créer une cargaison avec un premier colis obligatoire
export async function createCargaison(cargaison: Cargaison, premierColis: Colis): Promise<Cargaison> {
    // 1️⃣ Ajouter le premier colis à la cargaison pour calculer le prix
    cargaison.ajouterColis(premierColis);

    // 2️⃣ Créer la cargaison sans les colis
    const resCarg = await fetch(`${API_URI}/cargaisons`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            ...cargaison,
            colis: [],
            prixTotalCargaison: cargaison.prixTotalCargaison
        }),
    });

    const newCargaison = await resCarg.json();

    // 3️⃣ Créer le colis avec le lien vers la cargaison
    const resColis = await fetch(`${API_URI}/colis`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...premierColis, cargaisonId: newCargaison.id }),
    });

    const newColis = await resColis.json();

    // 4️⃣ Mettre à jour la cargaison avec l’ID du colis
    const resUpdate = await fetch(`${API_URI}/cargaisons/${newCargaison.id}`, {
        method: "PATCH", // PATCH pour ne mettre à jour que le champ colis
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            colis: [newColis.id] // tableau avec juste l’ID
        }),
    });

    const cargaisonFinale = await resUpdate.json();
    return cargaisonFinale;
}





// Mettre à jour une cargaison
export async function update(cargaison: Cargaison): Promise<Cargaison> {
    const res = await fetch(`${API_URI}/cargaisons/${cargaison.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cargaison),
    });
    return res.json();
}
