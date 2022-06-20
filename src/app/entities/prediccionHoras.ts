import { DateTimeUtils } from "../utils/date-time-utils";


export class PrediccionHoras {
    hora: Date;
    estadoCielo: string;
    estadoCieloDesc: string;
    probPrecipitacion: number;
    temperatura: string;

    public static find(predicciones: PrediccionHoras[], hora: Date): number {
        const prediccion = predicciones.find(p => {
            return DateTimeUtils.equals(p.hora, hora);
        });
        return predicciones.indexOf(prediccion);
    }
}
