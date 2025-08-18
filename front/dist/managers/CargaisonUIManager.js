import { CargaisonService } from "../service/CargaisonService.js";
export class CargaisonUIManager {
    cargaisonsDisponibles = [];
    async initialiser() {
        await this.chargerCargaisonsDisponibles();
        this.configurerEventListeners();
    }
    async chargerCargaisonsDisponibles() {
        this.cargaisonsDisponibles = await CargaisonService.obtenirCargaisonsDisponibles();
        this.remplirSelectCargaisons();
    }
    remplirSelectCargaisons() {
        const select = document.getElementById('cargaison_existante');
        if (select) {
            select.innerHTML = '<option value="">Sélectionner une cargaison...</option>';
            this.cargaisonsDisponibles.forEach(cargaison => {
                const option = document.createElement('option');
                option.value = cargaison.id;
                option.textContent = `${cargaison.numero} - ${cargaison.type} (${cargaison.lieuDepart} → ${cargaison.lieuArrivee})`;
                select.appendChild(option);
            });
        }
    }
    configurerEventListeners() {
        const radioButtons = document.querySelectorAll('input[name="option_cargaison"]');
        radioButtons.forEach(radio => {
            radio.addEventListener('change', () => this.changerOptionCargaison());
        });
        const selectCargaison = document.getElementById('cargaison_existante');
        if (selectCargaison) {
            selectCargaison.addEventListener('change', () => this.chargerInfosCargaison());
        }
    }
    changerOptionCargaison() {
        const radioButtons = document.getElementsByName('option_cargaison');
        const selectionExistante = document.getElementById('selection_cargaison_existante');
        const typeCargaisonField = document.getElementById('type_cargaison');
        let optionSelectionnee = '';
        radioButtons.forEach(radio => {
            if (radio.checked) {
                optionSelectionnee = radio.value;
            }
        });
        if (optionSelectionnee === 'existante') {
            selectionExistante?.classList.remove('hidden');
            typeCargaisonField.disabled = true;
            typeCargaisonField.required = false;
        }
        else {
            selectionExistante?.classList.add('hidden');
            typeCargaisonField.disabled = false;
            typeCargaisonField.required = true;
            this.cacherInfosCargaison();
        }
    }
    chargerInfosCargaison() {
        const select = document.getElementById('cargaison_existante');
        const infoCargaison = document.getElementById('info_cargaison_selectionnee');
        if (select.value && infoCargaison) {
            const cargaisonId = parseInt(select.value);
            const cargaison = this.cargaisonsDisponibles.find(c => c.id === cargaisonId);
            if (cargaison) {
                const poidsDisponible = CargaisonService.calculerPoidsDisponible(cargaison);
                infoCargaison.innerHTML = `
                    <div class="text-sm space-y-1">
                        <p><strong>Type:</strong> ${cargaison.type}</p>
                        <p><strong>Trajet:</strong> ${cargaison.lieuDepart} → ${cargaison.lieuArrivee}</p>
                        <p><strong>Poids disponible:</strong> ${poidsDisponible} kg / ${cargaison.poidsMax} kg</p>
                        <p><strong>État:</strong> ${cargaison.etatAvancement}</p>
                        <p><strong>Date de départ prévue:</strong> ${cargaison.dateDepart ? new Date(cargaison.dateDepart).toLocaleDateString() : 'Non définie'}</p>
                    </div>
                `;
                infoCargaison.classList.remove('hidden');
                this.preremplirTypeCargaison(cargaison.type);
            }
        }
        else {
            this.cacherInfosCargaison();
        }
    }
    preremplirTypeCargaison(typeCargaison) {
        const typeCargaisonSelect = document.getElementById('type_cargaison');
        if (typeCargaison && typeCargaisonSelect) {
            switch (typeCargaison.toLowerCase()) {
                case 'maritime':
                    typeCargaisonSelect.value = 'maritime';
                    break;
                case 'aérienne':
                    typeCargaisonSelect.value = 'aerien';
                    break;
                case 'routière':
                    typeCargaisonSelect.value = 'routier';
                    break;
            }
        }
    }
    cacherInfosCargaison() {
        const infoCargaison = document.getElementById('info_cargaison_selectionnee');
        infoCargaison?.classList.add('hidden');
    }
    getOptionSelectionnee() {
        const radioButtons = document.getElementsByName('option_cargaison');
        let optionSelectionnee = '';
        radioButtons.forEach(radio => {
            if (radio.checked) {
                optionSelectionnee = radio.value;
            }
        });
        return optionSelectionnee;
    }
    getCargaisonSelectionnee() {
        const select = document.getElementById('cargaison_existante');
        return select.value ? parseInt(select.value) : null;
    }
    getCargaisonsDisponibles() {
        return this.cargaisonsDisponibles;
    }
}
//# sourceMappingURL=CargaisonUIManager.js.map