export declare class ColisMapService {
    private map;
    private departureMarker;
    private arrivalMarker;
    private currentMarker;
    private routeLine;
    initMap(containerId: string): void;
    displayRoute(departureCoords: {
        lat: number;
        lng: number;
    }, arrivalCoords: {
        lat: number;
        lng: number;
    }, currentCoords: {
        lat: number;
        lng: number;
    }, transportType: string): Promise<void>;
    private getTransportIcon;
    private clearMarkers;
    destroy(): void;
}
//# sourceMappingURL=ColisMapService.d.ts.map