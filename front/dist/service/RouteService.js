import { ErreurMessages } from "../utils/erreurMessages.js";
import { succesMessages } from "../utils/succesMessages.js";
export class RouteService {
    map;
    startMarker = null;
    endMarker = null;
    routeLine = null;
    distanceInput;
    erreurSpan;
    constructor(mapContainerId, distanceInputId, erreurSpanId) {
        this.distanceInput = document.getElementById(distanceInputId);
        this.erreurSpan = document.getElementById(erreurSpanId);
        this.map = L.map(mapContainerId).setView([14.6928, -17.4467], 13);
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
                this.startMarker.on("dragend", () => this.calculerDistance());
            }
            else if (!this.endMarker) {
                this.endMarker = L.marker(e.latlng, { draggable: true }).addTo(this.map);
                this.endMarker.on("dragend", () => this.calculerDistance());
                this.calculerDistance();
            }
            else {
                alert("Déjà deux points placés. Déplacez-les pour recalculer.");
            }
        });
    }
    async getAddress(lat, lng) {
        const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`;
        const res = await fetch(url);
        if (!res.ok)
            throw new Error("Erreur API Nominatim");
        const data = await res.json();
        // Filtrage pour ne garder que les infos utiles
        const address = data.address;
        let shortAddress = "";
        if (address.road)
            shortAddress += address.road + ", ";
        if (address.suburb)
            shortAddress += address.suburb + ", ";
        if (address.city)
            shortAddress += address.city;
        else if (address.town)
            shortAddress += address.town;
        else if (address.village)
            shortAddress += address.village;
        return shortAddress || data.display_name; // fallback complet si rien trouvé
    }
    async calculerDistance() {
        if (!this.startMarker || !this.endMarker)
            return;
        const start = this.startMarker.getLatLng();
        const end = this.endMarker.getLatLng();
        try {
            // Récupération des adresses
            const startAddress = await this.getAddress(start.lat, start.lng);
            const endAddress = await this.getAddress(end.lat, end.lng);
            // Calcul itinéraire via OSRM
            const url = `https://router.project-osrm.org/route/v1/driving/${start.lng},${start.lat};${end.lng},${end.lat}?overview=full&geometries=geojson`;
            const res = await fetch(url);
            if (!res.ok)
                throw new Error("Erreur API OSRM");
            const data = await res.json();
            const route = data.routes[0];
            const distanceKm = (route.distance / 1000).toFixed(2);
            this.distanceInput.value = distanceKm;
            if (this.routeLine) {
                this.map.removeLayer(this.routeLine);
            }
            this.routeLine = L.polyline(route.geometry.coordinates.map((c) => [c[1], c[0]]), {
                color: "blue",
                weight: 4,
            }).addTo(this.map);
            this.map.fitBounds(this.routeLine.getBounds());
            this.erreurSpan.classList.add("mt-1", "text-green-500");
            this.erreurSpan.textContent = `${succesMessages.FR.distance_calculer}`;
            // 👉 tu peux afficher les adresses dans ton interface
            const depart = document.getElementById("lieuDepart");
            const arrivee = document.getElementById("lieuArrivee");
            depart.value = startAddress;
            arrivee.value = endAddress;
        }
        catch (err) {
            console.error(err);
            this.distanceInput.value = "";
            this.erreurSpan.textContent = `${ErreurMessages.FR.erreur_api}`;
        }
    }
}
//# sourceMappingURL=RouteService.js.map