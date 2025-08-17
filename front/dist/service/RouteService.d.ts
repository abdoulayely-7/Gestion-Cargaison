export declare class RouteService {
    map: L.Map;
    private startMarker;
    private endMarker;
    private routeLine;
    private distanceInput;
    private erreurSpan;
    constructor(mapContainerId: string, distanceInputId: string, erreurSpanId: string);
    private initClick;
    private calculerDistance;
}
//# sourceMappingURL=RouteService.d.ts.map