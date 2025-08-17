export declare class OpenRouteService {
    private static readonly KEY;
    private static readonly URL;
    /**
     * Calcule la distance entre deux points GPS via OSRM
     * @param startLat latitude de départ
     * @param startLng longitude de départ
     * @param endLat latitude d'arrivée
     * @param endLng longitude d'arrivée
     * @returns distance en kilomètres
     */
    static getDistanceOSRM(startLat: number, startLng: number, endLat: number, endLng: number): Promise<number>;
    /**
     * Récupère le nom d'un lieu depuis ses coordonnées via Nominatim (géocodage inverse)
     * @param lat latitude
     * @param lng longitude
     * @returns nom complet du lieu
     */
    static getPlaceName(lat: number, lng: number): Promise<string>;
    /**
     * Méthode pratique pour calculer distance + noms lieux
     */
    static getRouteInfo(startLat: number, startLng: number, endLat: number, endLng: number): Promise<{
        distanceKm: number;
        depart: string;
        arrivee: string;
    }>;
}
//# sourceMappingURL=OpenRouteService.d.ts.map