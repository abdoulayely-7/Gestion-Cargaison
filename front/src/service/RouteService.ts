import {ErreurMessages} from "../utils/erreurMessages.js";
import {succesMessages} from "../utils/succesMessages.js";

declare const L: typeof import("leaflet");

export class RouteService {
    public map: L.Map;
    private startMarker: L.Marker | null = null;
    private endMarker: L.Marker | null = null;
    private routeLine: L.Polyline | null = null;
    private distanceInput: HTMLInputElement;
    private erreurSpan: HTMLSpanElement;

    constructor(mapContainerId: string, distanceInputId: string, erreurSpanId: string) {
        this.distanceInput = document.getElementById(distanceInputId) as HTMLInputElement;
        this.erreurSpan = document.getElementById(erreurSpanId) as HTMLSpanElement;

        this.map = L.map(mapContainerId).setView([14.6928, -17.4467], 13);

        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            attribution: "© OpenStreetMap",
            maxZoom: 19,
        }).addTo(this.map);

        this.initClick();
    }

    private initClick() {
        this.map.on("click", (e: L.LeafletMouseEvent) => {
            if (!this.startMarker) {
                this.startMarker = L.marker(e.latlng, { draggable: true }).addTo(this.map);
                this.startMarker.on("dragend", () => this.calculerDistance());
            } else if (!this.endMarker) {
                this.endMarker = L.marker(e.latlng, { draggable: true }).addTo(this.map);
                this.endMarker.on("dragend", () => this.calculerDistance());
                this.calculerDistance();
            } else {
                alert("Déjà deux points placés. Déplacez-les pour recalculer.");
            }
        });
    }

    private async calculerDistance() {
        if (!this.startMarker || !this.endMarker) return;

        const start = this.startMarker.getLatLng();
        const end = this.endMarker.getLatLng();


        try {
            const url = `https://router.project-osrm.org/route/v1/driving/${start.lng},${start.lat};${end.lng},${end.lat}?overview=full&geometries=geojson`;
            const res = await fetch(url);
            if (!res.ok) throw new Error("Erreur API OSRM");

            const data = await res.json();
            const route = data.routes[0];
            const distanceKm = (route.distance / 1000).toFixed(2);

            this.distanceInput.value = distanceKm;

            if (this.routeLine) {
                this.map.removeLayer(this.routeLine);
            }
            this.routeLine = L.polyline(route.geometry.coordinates.map((c: number[]) => [c[1], c[0]]), {
                color: "blue",
                weight: 4,
            }).addTo(this.map);

            this.map.fitBounds(this.routeLine.getBounds());
            this.erreurSpan.classList.add("mt-1", "text-green-500");
            this.erreurSpan.textContent = `${succesMessages.FR.distance_calculer}`;
        } catch (err) {
            console.error(err);
            this.distanceInput.value = "";
            this.erreurSpan.textContent = `${ErreurMessages.FR.erreur_api}`;
        }
    }
}
