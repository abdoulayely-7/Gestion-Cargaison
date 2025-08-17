import { API_URI } from "../../config/environnement.js";
export async function login(email, password) {
    const url = `${API_URI}/gestionnaire?email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`;
    try {
        const response = await fetch(url);
        if (!response.ok)
            throw new Error(`Erreur serveur: ${response.status}`);
        const users = await response.json();
        const user = users[0] ?? null;
        if (user) {
            localStorage.setItem("currentUser", String(user.id));
        }
        return user;
    }
    catch (err) {
        console.error("Erreur lors de la connexion:", err);
        return null;
    }
}
export function logout() {
    localStorage.removeItem("currentUser");
}
export async function getUserId(id) {
    const url = `${API_URI}/gestionnaire?id=${id}`;
    try {
        const response = await fetch(url);
        if (!response.ok)
            throw new Error(`Erreur serveur: ${response.status}`);
        const users = await response.json();
        return users[0] ?? null;
    }
    catch (err) {
        console.error("Erreur lors de la récupération de l'utilisateur:", err);
        return null;
    }
}
//# sourceMappingURL=connexion.js.map