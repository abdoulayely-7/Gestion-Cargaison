import { API_OPEN_ROUTE_KEY, API_OPEN_ROUTE_URI } from "../config/environnement.js";
export class OpenRouteService {
    static KEY = API_OPEN_ROUTE_KEY;
    static URL = API_OPEN_ROUTE_URI;
    /**
     * Calcule la distance entre deux points GPS via OSRM
     * @param startLat latitude de départ
     * @param startLng longitude de départ
     * @param endLat latitude d'arrivée
     * @param endLng longitude d'arrivée
     * @returns distance en kilomètres
     */
    static async getDistanceOSRM(startLat, startLng, endLat, endLng) {
        const url = `https://router.project-osrm.org/route/v1/driving/${startLng},${startLat};${endLng},${endLat}?overview=false`;
        const res = await fetch(url);
        if (!res.ok)
            throw new Error(`Erreur OSRM: ${res.status}`);
        const data = await res.json();
        const distanceMeters = data.routes[0].distance;
        return distanceMeters / 1000; // km
    }
    /**
     * Récupère le nom d'un lieu depuis ses coordonnées via Nominatim (géocodage inverse)
     * @param lat latitude
     * @param lng longitude
     * @returns nom complet du lieu
     */
    static async getPlaceName(lat, lng) {
        const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`;
        const res = await fetch(url, {
            headers: {
                "Accept": "application/json"
            }
        });
        if (!res.ok)
            throw new Error(`Erreur Nominatim: ${res.status}`);
        const data = await res.json();
        return data.display_name || "Lieu inconnu";
    }
    /**
     * Méthode pratique pour calculer distance + noms lieux
     */
    static async getRouteInfo(startLat, startLng, endLat, endLng) {
        const distanceKm = await this.getDistanceOSRM(startLat, startLng, endLat, endLng);
        const depart = await this.getPlaceName(startLat, startLng);
        const arrivee = await this.getPlaceName(endLat, endLng);
        return { distanceKm, depart, arrivee };
    }
}
//# sourceMappingURL=OpenRouteService.js.map