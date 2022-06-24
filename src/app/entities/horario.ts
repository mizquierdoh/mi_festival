export class Horario {
    dia: Date;
    horas: Date[];

    public static findHora(inicio: Date, horario: Horario): Date {
        let hora: Date;
        for (let i = 0; i < horario.horas.length - 1; i++) {
            if (horario.horas[i].getTime() <= inicio.getTime() && horario.horas[i + 1].getTime() > inicio.getTime()) {
                hora = horario.horas[i];
                break;
            }
        }
        if (!hora && inicio.getDate() == horario.horas[horario.horas.length - 1].getDate()) {
            hora = horario.horas[horario.horas.length - 1];
        }
        return (hora);

    }
}


