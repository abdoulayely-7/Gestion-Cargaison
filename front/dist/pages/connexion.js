// src/pages/connexion.ts
import { login } from "../api/auth/connexion.js";
import { Validator } from "../utils/Validator.js";
import { ErreurMessages } from "../utils/erreurMessages.js";
import { getUserId } from "../api/auth/connexion.js";
const form = document.getElementById("loginForm");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const erreurConnexion = document.getElementById("erreurConnexion");
// Affiche un message d'erreur sous le champ
function setError(htmlEL, message) {
    let errorEl = htmlEL.nextElementSibling;
    if (!errorEl || !errorEl.classList.contains("error-message")) {
        errorEl = document.createElement("p");
        errorEl.className = "error-message text-red-500 text-sm mt-1";
        htmlEL.parentElement?.appendChild(errorEl);
    }
    errorEl.textContent = message;
}
// Supprime le message d'erreur
function clearError(input) {
    const errorEl = input.parentElement?.querySelector(".error-message");
    if (errorEl)
        errorEl.textContent = "";
}
form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const rules = [
        { element: emailInput, validator: () => Validator.required(emailInput.value), message: ErreurMessages.FR.email_required },
        { element: emailInput, validator: () => Validator.isEmail(emailInput.value), message: ErreurMessages.FR.email_invalid },
        { element: passwordInput, validator: () => Validator.required(passwordInput.value), message: ErreurMessages.FR.password_required },
    ];
    if (!Validator.validateRules(rules))
        return;
    const user = await login(emailInput.value, passwordInput.value);
    if (!user) {
        setError(erreurConnexion, ErreurMessages.FR.login_failed);
        return;
    }
    window.location.href = "/dashboard";
});
//# sourceMappingURL=connexion.js.map