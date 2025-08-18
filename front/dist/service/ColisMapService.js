export class ColisMapService {
    map = null;
    departureMarker = null;
    arrivalMarker = null;
    currentMarker = null;
    routeLine = null;
    initMap(containerId) {
        if (this.map) {
            this.map.remove();
        }
        this.map = L.map(containerId).setView([14.6928, -17.4467], 6);
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            attribution: "© OpenStreetMap contributors",
            maxZoom: 19,
        }).addTo(this.map);
    }
    async displayRoute(departureCoords, arrivalCoords, currentCoords, transportType) {
        if (!this.map)
            return;
        // Nettoyer les marqueurs précédents
        this.clearMarkers();
        // Icônes personnalisées
        const departureIcon = L.divIcon({
            html: '<div class="marker-departure"><i data-lucide="map-pin" class="h-4 w-4"></i></div>',
            className: 'custom-div-icon',
            iconSize: [30, 30],
            iconAnchor: [15, 30]
        });
        const arrivalIcon = L.divIcon({
            html: '<div class="marker-arrival"><i data-lucide="flag" class="h-4 w-4"></i></div>',
            className: 'custom-div-icon',
            iconSize: [30, 30],
            iconAnchor: [15, 30]
        });
        const currentIcon = L.divIcon({
            html: `<div class="marker-current"><i data-lucide="${this.getTransportIcon(transportType)}" class="h-4 w-4"></i></div>`,
            className: 'custom-div-icon',
            iconSize: [35, 35],
            iconAnchor: [17, 35]
        });
        // Ajouter les marqueurs
        this.departureMarker = L.marker([departureCoords.lat, departureCoords.lng], { icon: departureIcon })
            .addTo(this.map)
            .bindPopup("Point de départ");
        this.arrivalMarker = L.marker([arrivalCoords.lat, arrivalCoords.lng], { icon: arrivalIcon })
            .addTo(this.map)
            .bindPopup("Point d'arrivée");
        this.currentMarker = L.marker([currentCoords.lat, currentCoords.lng], { icon: currentIcon })
            .addTo(this.map)
            .bindPopup("Position actuelle du colis");
        // Tracer la route
        this.routeLine = L.polyline([
            [departureCoords.lat, departureCoords.lng],
            [currentCoords.lat, currentCoords.lng]
        ], {
            color: '#0ea5e9',
            weight: 4,
            opacity: 0.8
        }).addTo(this.map);
        // Route restante (pointillée)
        L.polyline([
            [currentCoords.lat, currentCoords.lng],
            [arrivalCoords.lat, arrivalCoords.lng]
        ], {
            color: '#94a3b8',
            weight: 3,
            opacity: 0.5,
            dashArray: '10, 10'
        }).addTo(this.map);
        // Ajuster la vue pour inclure tous les points
        const group = L.featureGroup([this.departureMarker, this.arrivalMarker, this.currentMarker]);
        this.map.fitBounds(group.getBounds().pad(0.1));
        // Réinitialiser les icônes après ajout des marqueurs
        if (typeof window.lucide !== 'undefined') {
            window.lucide.createIcons();
        }
    }
    getTransportIcon(transportType) {
        switch (transportType) {
            case 'AERIEN': return 'plane';
            case 'MARITIME': return 'ship';
            case 'ROUTIER': return 'truck';
            default: return 'package';
        }
    }
    clearMarkers() {
        if (this.departureMarker) {
            this.map?.removeLayer(this.departureMarker);
            this.departureMarker = null;
        }
        if (this.arrivalMarker) {
            this.map?.removeLayer(this.arrivalMarker);
            this.arrivalMarker = null;
        }
        if (this.currentMarker) {
            this.map?.removeLayer(this.currentMarker);
            this.currentMarker = null;
        }
        if (this.routeLine) {
            this.map?.removeLayer(this.routeLine);
            this.routeLine = null;
        }
    }
    destroy() {
        if (this.map) {
            this.map.remove();
            this.map = null;
        }
    }
}
//# sourceMappingURL=ColisMapService.js.map