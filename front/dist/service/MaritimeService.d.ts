export declare class MaritimeService {
    map: L.Map;
    private startMarker;
    private endMarker;
    private routeLine;
    private distanceInput;
    private departInput;
    private arriveeInput;
    private erreurSpan;
    constructor(mapContainerId: string, distanceInputId: string, departInputId: string, arriveeInputId: string, erreurSpanId: string);
    private initClick;
    private updateRoute;
    private haversineDistance;
}
//# sourceMappingURL=MaritimeService.d.ts.map