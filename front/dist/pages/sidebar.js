import { logout } from "../api/auth/connexion.js";
import { getUserId } from "../api/auth/connexion.js";
const nameGestionnaire = document.getElementById("nameGestionnaire");
const logoutButton = document.getElementById("logout");
logoutButton.addEventListener("click", () => {
    logout();
    window.location.href = "/";
});
const storedId = localStorage.getItem("currentUser");
if (storedId) {
    const userId = Number(storedId);
    const infoUser = await getUserId(userId);
    if (infoUser) {
        nameGestionnaire.textContent = ` ${infoUser.prenom} ${infoUser.nom}`;
    }
}
//# sourceMappingURL=sidebar.js.map