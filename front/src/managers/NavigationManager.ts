export class NavigationManager {
    
    private etapeActuelle: number = 1;
    private readonly NOMBRE_ETAPES = 4;

    constructor() {
        this.initialiserEventListeners();
    }

    private initialiserEventListeners(): void {
        const nextButton = document.querySelector('.next-button') as HTMLButtonElement;
        const prevButton = document.querySelector('.prev-button') as HTMLButtonElement;

        if (nextButton) {
            nextButton.addEventListener('click', () => this.allerEtapeSuivante());
        }
        
        if (prevButton) {
            prevButton.addEventListener('click', () => this.allerEtapePrecedente());
        }
    }

    allerEtapeSuivante(): void {
        if (this.etapeActuelle < this.NOMBRE_ETAPES) {
            this.cacherEtapeActuelle();
            this.etapeActuelle++;
            this.afficherEtape(this.etapeActuelle);
            this.mettreAJourIndicateurEtapes();
        }
    }

    allerEtapePrecedente(): void {
        if (this.etapeActuelle > 1) {
            this.cacherEtapeActuelle();
            this.etapeActuelle--;
            this.afficherEtape(this.etapeActuelle);
            this.mettreAJourIndicateurEtapes();
        }
    }

    private cacherEtapeActuelle(): void {
        const etapeElement = document.getElementById(`etape${this.etapeActuelle}`);
        if (etapeElement) {
            etapeElement.classList.add('hidden');
        }
    }

    private afficherEtape(etape: number): void {
        const etapeElement = document.getElementById(`etape${etape}`);
        if (etapeElement) {
            etapeElement.classList.remove('hidden');
            etapeElement.classList.add('fade-in');
        }
    }

    private mettreAJourIndicateurEtapes(): void {
        for (let i = 1; i <= this.NOMBRE_ETAPES; i++) {
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
        
        this.mettreAJourLabels();
    }

    private mettreAJourLabels(): void {
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

    getEtapeActuelle(): number {
        return this.etapeActuelle;
    }

    setEtapeActuelle(etape: number): void {
        if (etape >= 1 && etape <= this.NOMBRE_ETAPES) {
            this.cacherEtapeActuelle();
            this.etapeActuelle = etape;
            this.afficherEtape(etape);
            this.mettreAJourIndicateurEtapes();
        }
    }
}
