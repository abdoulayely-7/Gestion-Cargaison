import { ErreurMessages } from "../utils/erreurMessages.js";
import { succesMessages } from "../utils/succesMessages.js";
export class MaritimeService {
    map;
    startMarker = null;
    endMarker = null;
    routeLine = null;
    distanceInput;
    departInput;
    arriveeInput;
    erreurSpan;
    constructor(mapContainerId, distanceInputId, departInputId, arriveeInputId, erreurSpanId) {
        this.distanceInput = document.getElementById(distanceInputId);
        this.departInput = document.getElementById(departInputId);
        this.arriveeInput = document.getElementById(arriveeInputId);
        this.erreurSpan = document.getElementById(erreurSpanId);
        this.map = L.map(mapContainerId).setView([14.6928, -17.4467], 3); // zoom plus large pour maritime
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            attribution: "© OpenStreetMap",
            maxZoom: 19,
        }).addTo(this.map);
        this.initClick();
    }
    initClick() {
        this.map.on("click", (e) => {
            if (!this.startMarker) {
                this.startMarker = L.marker(e.latlng, { draggable: true }).addTo(this.map);
                this.startMarker.on("dragend", () => this.updateRoute());
            }
            else if (!this.endMarker) {
                this.endMarker = L.marker(e.latlng, { draggable: true }).addTo(this.map);
                this.endMarker.on("dragend", () => this.updateRoute());
                this.updateRoute();
            }
            else {
                alert("Déjà deux points placés. Déplacez-les pour recalculer.");
            }
        });
    }
    updateRoute() {
        if (!this.startMarker || !this.endMarker)
            return;
        const start = this.startMarker.getLatLng();
        const end = this.endMarker.getLatLng();
        // Supprimer ancienne ligne
        if (this.routeLine) {
            this.map.removeLayer(this.routeLine);
        }
        // Dessiner la ligne droite
        this.routeLine = L.polyline([start, end], { color: "blue", weight: 3 }).addTo(this.map);
        this.map.fitBounds(this.routeLine.getBounds());
        // Calcul distance haversine
        const distanceKm = this.haversineDistance(start.lat, start.lng, end.lat, end.lng).toFixed(2);
        this.distanceInput.value = distanceKm;
        // Remplir les inputs lat/lng
        this.departInput.value = `${start.lat.toFixed(6)}, ${start.lng.toFixed(6)}`;
        this.arriveeInput.value = `${end.lat.toFixed(6)}, ${end.lng.toFixed(6)}`;
        this.erreurSpan.classList.add("mt-1", "text-green-500");
        this.erreurSpan.textContent = succesMessages.FR.distance_calculer;
    }
    haversineDistance(lat1, lon1, lat2, lon2) {
        const toRad = (deg) => deg * Math.PI / 180;
        const R = 6371; // rayon terre en km
        const dLat = toRad(lat2 - lat1);
        const dLon = toRad(lon2 - lon1);
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
                Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }
}
//# sourceMappingURL=MaritimeService.js.map