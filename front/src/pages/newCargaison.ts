import {RouteService} from "../service/RouteService.js";

const typeTransport = document.getElementById("typeTransport") as HTMLSelectElement;
const mapContainer = document.getElementById("mapContainer") as HTMLDivElement;

let routeService: RouteService | null = null;

// Initialiser la carte seulement une fois
routeService = new RouteService("map", "distance", "erreur_api");
mapContainer.style.display = "none"; // cacher par défaut

typeTransport.addEventListener("change", () => {
    if (typeTransport.value === "routier") {
        mapContainer.style.display = "block";
        routeService!.map.invalidateSize();
    } else {
        mapContainer.style.display = "none";
    }

    if (typeTransport.value === "aerien") {
        alert("Transport aérien choisi");
    }
});
