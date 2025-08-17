import {logout} from "../api/auth/connexion.js";
import {getUserId} from "../api/auth/connexion.js";
import type {User} from "../interface/User.js";

const nameGestionnaire = document.getElementById("nameGestionnaire") as HTMLParagraphElement;
const logoutButton = document.getElementById("logout") as HTMLButtonElement;
logoutButton.addEventListener("click", () => {
    logout();
    window.location.href = "/";
});
const storedId: string|null = localStorage.getItem("currentUser");
if (storedId) {
    const userId: number = Number(storedId);
    const infoUser: User | null = await getUserId(userId);
    if (infoUser) {
        nameGestionnaire.textContent= ` ${infoUser.prenom} ${infoUser.nom}`;
    }
}
