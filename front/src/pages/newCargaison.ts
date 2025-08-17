import {RouteService} from "../service/RouteService.js";
import {MaritimeService} from "../service/MaritimeService.js";

const typeTransport = document.getElementById("typeTransport") as HTMLSelectElement;
const mapContainer = document.getElementById("mapContainer") as HTMLDivElement;

let routeService: RouteService | null = null;
let maritimeService: MaritimeService | null = null;

mapContainer.style.display = "none"; // cacher par défaut

typeTransport.addEventListener("change", () => {
    if (typeTransport.value === "routier") {
        mapContainer.style.display = "block";
        maritimeService = null;
        if (!routeService) routeService = new RouteService("map", "distance", "erreur_api");
        routeService.map.invalidateSize();
    } else if (typeTransport.value === "maritime") {
        mapContainer.style.display = "block";
        routeService = null;
        if (!maritimeService) maritimeService = new MaritimeService("map", "distance", "lieuDepart", "lieuArrivee", "erreur_api");
        maritimeService.map.invalidateSize();
    } else {
        mapContainer.style.display = "none";
    }
});
