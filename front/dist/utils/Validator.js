import { ErreurMessages } from "./erreurMessages.js";
export class Validator {
    static isEmail(value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(value);
    }
    static minLength(value, length) {
        return value.length >= length;
    }
    static required(value) {
        return value !== null && value !== undefined && value.trim() !== "";
    }
    // Nouvelle méthode pour valider un tableau de règles
    static validateRules(rules) {
        let valid = true;
        for (const { element, validator, message } of rules) {
            const errorEl = element.parentElement?.querySelector(".error-message");
            if (!validator()) {
                if (errorEl) {
                    errorEl.textContent = message;
                }
                else {
                    const p = document.createElement("p");
                    p.className = "error-message text-red-500 text-sm mt-1";
                    p.textContent = message;
                    element.parentElement?.appendChild(p);
                }
                valid = false;
            }
            else if (errorEl) {
                errorEl.textContent = "";
            }
        }
        return valid;
    }
}
//# sourceMappingURL=Validator.js.map