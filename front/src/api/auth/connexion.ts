import {API_URI} from "../../config/environnement.js";
import type {User} from "../../interface/User.js";

export async function login(email: string, password: string): Promise<User | null> {
    const url = `${API_URI}/gestionnaire?email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`;

    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`Erreur serveur: ${response.status}`);

        const users: User[] = await response.json();
        const user = users[0] ?? null;

        if (user) {
            localStorage.setItem("currentUser", String(user.id));
        }
        return user;
    } catch (err) {
        console.error("Erreur lors de la connexion:", err);
        return null;
    }
}


export function logout() {
    localStorage.removeItem("currentUser");
}

export async function getUserId(id: number):Promise< User | null> {
   const url = `${API_URI}/gestionnaire?id=${id}`;
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`Erreur serveur: ${response.status}`);

        const users: User[] = await response.json();
        return users[0] ?? null;

    } catch (err) {
        console.error("Erreur lors de la récupération de l'utilisateur:", err);
        return null;
    }
}
