import { ArtistSpotify } from "./artist-spotify";
import { Escenarios } from "./escenarios";
import { PrediccionHoras } from "./prediccionHoras";

export class Grupo {
    uuid: string;
    nombre: string;
    dia: Date;
    inicio: Date;
    fin: Date;
    escenario: Escenarios;
    relevancia: number;
    procedencia: string;
    descripcion: string;
    colspan: number = 1;
    prediccion: PrediccionHoras;
    infoSpotify: ArtistSpotify;


}
