import {ErreurMessages} from "./erreurMessages.js";
type Rule = {
    element: HTMLElement;
    validator: () => boolean;

    message: string;
};

export class Validator {
    static isEmail(value: string): boolean {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(value);
    }

    static minLength(value: string, length: number): boolean {
        return value.length >= length;
    }

    static required(value: string | null | undefined): boolean {
        return value !== null && value !== undefined && value.trim() !== "";
    }

    // Nouvelle méthode pour valider un tableau de règles
    static validateRules(rules: Rule[]): boolean {
        let valid = true;

        for (const { element, validator, message } of rules) {
            const errorEl = element.parentElement?.querySelector(".error-message") as HTMLElement;

            if (!validator()) {
                // afficher l'erreur
                if (errorEl) {
                    errorEl.textContent = message;
                } else {
                    const p = document.createElement("p");
                    p.className = "error-message text-red-500 text-sm mt-1";
                    p.textContent = message;
                    element.parentElement?.appendChild(p);
                }
                valid = false;
            } else if (errorEl) {
                errorEl.textContent = "";
            }
        }

        return valid;
    }
}