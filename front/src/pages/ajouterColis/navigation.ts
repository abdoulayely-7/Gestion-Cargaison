/**
 * Gestionnaire de navigation entre les étapes du formulaire
 */
export class StepNavigator {
    private etapeActuelle: number = 1;
    private readonly nombreEtapes: number = 4;

    /**
     * Aller à l'étape suivante
     */
    allerEtapeSuivante(etape: number, validationCallback: () => boolean, recapCallback?: () => void): void {
        if (validationCallback()) {
            this.cacherEtapeActuelle();
            this.etapeActuelle = etape;
            this.afficherEtape(etape);
            this.mettreAJourIndicateurEtapes();
            
            if (etape === 4 && recapCallback) {
                recapCallback();
            }
        }
    }

    /**
     * Aller à l'étape précédente
     */
    allerEtapePrecedente(etape: number): void {
        this.cacherEtapeActuelle();
        this.etapeActuelle = etape;
        this.afficherEtape(etape);
        this.mettreAJourIndicateurEtapes();
    }

    /**
     * Cacher l'étape actuelle
     */
    private cacherEtapeActuelle(): void {
        const etapeElement = document.getElementById(`etape${this.etapeActuelle}`);
        if (etapeElement) {
            etapeElement.classList.add('hidden');
        }
    }

    /**
     * Afficher une étape
     */
    private afficherEtape(etape: number): void {
        const etapeElement = document.getElementById(`etape${etape}`);
        if (etapeElement) {
            etapeElement.classList.remove('hidden');
            etapeElement.classList.add('fade-in');
        }
    }

    /**
     * Mettre à jour les indicateurs d'étapes
     */
    private mettreAJourIndicateurEtapes(): void {
        for (let i = 1; i <= this.nombreEtapes; i++) {
            const indicator = document.querySelector(`.step-indicator:nth-child(${i * 2 - 1})`) as HTMLElement;
            if (indicator) {
                indicator.classList.remove('active', 'completed');
                if (i < this.etapeActuelle) {
                    indicator.classList.add('completed');
                } else if (i === this.etapeActuelle) {
                    indicator.classList.add('active');
                }
            }
        }
        
        // Mettre à jour les labels
        const labelElements = document.querySelectorAll('.flex.items-center.justify-center.space-x-8 span');
        labelElements.forEach((label, index) => {
            label.classList.remove('text-cyan-600', 'text-green-600', 'text-gray-500');
            if (index + 1 < this.etapeActuelle) {
                label.classList.add('text-green-600');
            } else if (index + 1 === this.etapeActuelle) {
                label.classList.add('text-cyan-600');
            } else {
                label.classList.add('text-gray-500');
            }
        });
    }

    /**
     * Réinitialiser à la première étape
     */
    reinitialiser(): void {
        this.cacherEtapeActuelle();
        this.etapeActuelle = 1;
        this.afficherEtape(1);
        this.mettreAJourIndicateurEtapes();
    }

    /**
     * Obtenir l'étape actuelle
     */
    getEtapeActuelle(): number {
        return this.etapeActuelle;
    }
}
