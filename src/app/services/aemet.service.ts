import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PrediccionHoras } from '../entities/prediccionHoras';
import { DateTimeUtils } from '../utils/date-time-utils';
import { StorageService } from './storage.service';

const AEMET_URL_MUNICIPIO = "https://opendata.aemet.es/opendata/api/prediccion/especifica/municipio";

const API_KEY = "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJtaWd1ZWwuaXpxdWllcmRvLmhpZGFsZ29AZ21haWwuY29tIiwianRpIjoiMzFlZjBlN2MtYWU4NS00NGUxLWJiOGQtODFkNTJhMzQ2NWQyIiwiaXNzIjoiQUVNRVQiLCJpYXQiOjE2NTUwNDc2NTksInVzZXJJZCI6IjMxZWYwZTdjLWFlODUtNDRlMS1iYjhkLTgxZDUyYTM0NjVkMiIsInJvbGUiOiIifQ.sXpIpwBI-tJfv_x1QYZ7vku_RDbMlQvJdPuIjvFFP_w";

@Injectable({
  providedIn: 'root'
})
export class AemetService {

  descripcionesEstadoCielo: Map<string, string>;

  constructor(private http: HttpClient, private storageService: StorageService) {
    this.descripcionesEstadoCielo = new Map<string, string>();
    this.descripcionesEstadoCielo.set('11', 'Despejado');
    this.descripcionesEstadoCielo.set('11n', 'Despejado noche');
    this.descripcionesEstadoCielo.set('12', 'Poco nuboso');
    this.descripcionesEstadoCielo.set('12n', 'Poco nuboso noche');
    this.descripcionesEstadoCielo.set('13', 'Intervalos nubosos');
    this.descripcionesEstadoCielo.set('13n', 'Intervalos nubosos noche');
    this.descripcionesEstadoCielo.set('14', 'Nuboso');
    this.descripcionesEstadoCielo.set('14n', 'Nuboso noche');
    this.descripcionesEstadoCielo.set('15', 'Muy nuboso');
    this.descripcionesEstadoCielo.set('16', 'Cubierto');
    this.descripcionesEstadoCielo.set('17', 'Nubes altas');
    this.descripcionesEstadoCielo.set('17n', 'Nubes altas noche');
    this.descripcionesEstadoCielo.set('43', 'Intervalos nubosos con lluvia escasa');
    this.descripcionesEstadoCielo.set('43n', 'Intervalos nubosos con lluvia escasa noche');
    this.descripcionesEstadoCielo.set('44', 'Nuboso con lluvia escasa');
    this.descripcionesEstadoCielo.set('44n', 'Nuboso con lluvia escasa noche');
    this.descripcionesEstadoCielo.set('45', 'Muy nuboso con lluvia escasa');
    this.descripcionesEstadoCielo.set('46', 'Cubierto con lluvia escasa');
    this.descripcionesEstadoCielo.set('23', 'Intervalos nubosos con lluvia');
    this.descripcionesEstadoCielo.set('23n', 'Intervalos nubosos con lluvia noche');
    this.descripcionesEstadoCielo.set('24', 'Nuboso con lluvia');
    this.descripcionesEstadoCielo.set('24n', 'Nuboso con lluvia noche');
    this.descripcionesEstadoCielo.set('25', 'Muy nuboso con lluvia');
    this.descripcionesEstadoCielo.set('26', 'Cubierto con lluvia');
    this.descripcionesEstadoCielo.set('71', 'Intervalos nubosos con nieve escasa');
    this.descripcionesEstadoCielo.set('71n', 'Intervalos nubosos con nieve escasa noche');
    this.descripcionesEstadoCielo.set('72', 'Nuboso con nieve escasa');
    this.descripcionesEstadoCielo.set('72n', 'Nuboso con nieve escasa noche');
    this.descripcionesEstadoCielo.set('73', 'Muy nuboso con nieve escasa');
    this.descripcionesEstadoCielo.set('74', 'Cubierto con nieve escasa');
    this.descripcionesEstadoCielo.set('33', 'Intervalos nubosos con nieve');
    this.descripcionesEstadoCielo.set('33n', 'Intervalos nubosos con nieve noche');
    this.descripcionesEstadoCielo.set('34', 'Nuboso con nieve');
    this.descripcionesEstadoCielo.set('34n', 'Nuboso con nieve noche');
    this.descripcionesEstadoCielo.set('35', 'Muy nuboso con nieve');
    this.descripcionesEstadoCielo.set('36', 'Cubierto con nieve');
    this.descripcionesEstadoCielo.set('51', 'Intervalos nubosos con tormenta');
    this.descripcionesEstadoCielo.set('51n', 'Intervalos nubosos con tormenta noche');
    this.descripcionesEstadoCielo.set('52', 'Nuboso con tormenta');
    this.descripcionesEstadoCielo.set('52n', 'Nuboso con tormenta noche');
    this.descripcionesEstadoCielo.set('53', 'Muy nuboso con tormenta');
    this.descripcionesEstadoCielo.set('54', 'Cubierto con tormenta');
    this.descripcionesEstadoCielo.set('61', 'Intervalos nubosos con tormenta y lluvia escasa');
    this.descripcionesEstadoCielo.set('61n', 'Intervalos nubosos con tormenta y lluvia escasa noche');
    this.descripcionesEstadoCielo.set('62', 'Nuboso con tormenta y lluvia escasa');
    this.descripcionesEstadoCielo.set('62n', 'Nuboso con tormenta y lluvia escasa noche');
    this.descripcionesEstadoCielo.set('63', 'Muy nuboso con tormenta y lluvia escasa');
    this.descripcionesEstadoCielo.set('64', 'Cubierto con tormenta y lluvia escasa');
    this.descripcionesEstadoCielo.set('81', 'Niebla');
    this.descripcionesEstadoCielo.set('82', 'Bruma');
    this.descripcionesEstadoCielo.set('83', 'Calima');
  }

  public getPrediccionesDiarias(): Promise<PrediccionHoras[]> {


    return new Promise<PrediccionHoras[]>(resolve => {
      const url = AEMET_URL_MUNICIPIO + "/diaria/27066?api_key=" + API_KEY;
      this.http.get(url).subscribe(datos => {
        this.http.get(datos['datos']).subscribe(resultado => {
          const dias = resultado[0]['prediccion']['dia'];
          let predicciones: PrediccionHoras[] = [];
          for (const dia of dias) {

            let fechaDia: Date = new Date(dia['fecha']);


            if (dia.estadoCielo.length == 1 && !dia.estadoCielo[0].periodo) {
              const indexPrediccion = PrediccionHoras.find(predicciones, fechaDia);
              if (indexPrediccion != -1) {
                predicciones[indexPrediccion].estadoCielo = dia.estadoCielo[0].value;
                predicciones[indexPrediccion].estadoCieloDesc = !!dia.estadoCielo[0].descpcion ? dia.estadoCielo[0].descpcion : this.descripcionesEstadoCielo.get(dia.estadoCielo[0].value);
              } else {
                let prediccion = new PrediccionHoras();
                prediccion.hora = fechaDia;
                prediccion.estadoCielo = dia.estadoCielo[0].value;
                prediccion.estadoCieloDesc = !!dia.estadoCielo[0].descpcion ? dia.estadoCielo[0].descpcion : this.descripcionesEstadoCielo.get(dia.estadoCielo[0].value);
                predicciones.push(prediccion);
              }
            } else {
              let periodosEstadoCielo = new Set(dia.estadoCielo.filter(e => !!e.value && e.value.length > 0).map(e => Number.parseInt(e.periodo.substring(0, 2))).sort());
              for (const periodo of periodosEstadoCielo) {
                let estadoCielo;
                let diferencia;
                for (const estadoCieloBucle of dia.estadoCielo.filter(e => !!e.value && e.value.length > 0 && Number.parseInt(e.periodo.substring(0, 2)) == periodo)) {
                  const periodo = estadoCieloBucle.periodo.split("-").map(p => Number.parseInt(p));
                  const diff = periodo[1] - periodo[0];
                  if (!diferencia || diff < diferencia) {
                    diferencia = diff;
                    estadoCielo = estadoCieloBucle;
                  }
                  let hora: Date = new Date(fechaDia);
                  hora.setHours(estadoCielo.periodo.substring(0, 2));
                  const indexPrediccion = PrediccionHoras.find(predicciones, hora);
                  if (indexPrediccion != -1) {
                    predicciones[indexPrediccion].estadoCielo = estadoCielo.value;
                    predicciones[indexPrediccion].estadoCieloDesc = !!estadoCielo.descpcion ? estadoCielo.descpcion : this.descripcionesEstadoCielo.get(estadoCielo.value);
                  } else {
                    let prediccion = new PrediccionHoras();
                    prediccion.hora = hora;
                    prediccion.estadoCielo = estadoCielo.value;
                    prediccion.estadoCieloDesc = !!estadoCielo.descpcion ? estadoCielo.descpcion : this.descripcionesEstadoCielo.get(estadoCielo.value);
                    predicciones.push(prediccion);
                  }

                }
              }

            }
            if (!dia.temperatura.dato || dia.temperatura.dato.length == 0) {
              const indexPrediccion = PrediccionHoras.find(predicciones, fechaDia);
              if (indexPrediccion != -1) {
                predicciones[indexPrediccion].temperatura = `${dia.temperatura.minima}º / ${dia.temperatura.maxima}º`;
              } else {
                let prediccion = new PrediccionHoras();
                prediccion.hora = fechaDia;
                prediccion.temperatura = `${dia.temperatura.minima}º / ${dia.temperatura.maxima}º`;
                predicciones.push(prediccion);
              }

            } else {
              for (const temp of dia.temperatura.dato) {
                let hora: Date = new Date(fechaDia);
                hora.setHours(temp.hora);
                const indexPrediccion = PrediccionHoras.find(predicciones, hora);
                if (indexPrediccion != -1) {
                  predicciones[indexPrediccion].temperatura = temp.value;
                } else {
                  let prediccion = new PrediccionHoras();
                  prediccion.hora = hora;
                  prediccion.temperatura = temp.value;
                  predicciones.push(prediccion);
                }
              }
            }

            if (dia.probPrecipitacion.length == 1) {
              const indexPrediccion = PrediccionHoras.find(predicciones, fechaDia);
              if (indexPrediccion != -1) {
                predicciones[indexPrediccion].probPrecipitacion = dia.probPrecipitacion[0].value;
              } else {
                let prediccion = new PrediccionHoras();
                prediccion.hora = fechaDia;
                prediccion.probPrecipitacion = dia.probPrecipitacion[0].value;
                predicciones.push(prediccion);
              }
            } else {
              let periodosPrecipitacion = new Set(dia.probPrecipitacion.map(e => Number.parseInt(e.periodo.substring(0, 2))).sort());
              for (const periodo of periodosPrecipitacion) {
                let probPrecipitacion;
                let diferencia;
                for (const probPrecipitacionBucle of dia.probPrecipitacion.filter(e => Number.parseInt(e.periodo.substring(0, 2)) == periodo)) {
                  const periodo = probPrecipitacionBucle.periodo.split("-").map(p => Number.parseInt(p));
                  const diff = periodo[1] - periodo[0];
                  if (!diferencia || diff < diferencia) {
                    diferencia = diff;
                    probPrecipitacion = probPrecipitacionBucle;
                  }
                  let hora: Date = new Date(fechaDia);
                  hora.setHours(probPrecipitacion.periodo.substring(0, 2));
                  const indexPrediccion = PrediccionHoras.find(predicciones, hora);
                  if (indexPrediccion != -1) {
                    predicciones[indexPrediccion].probPrecipitacion = probPrecipitacion.value;
                  } else {
                    let prediccion = new PrediccionHoras();
                    prediccion.hora = hora;
                    prediccion.probPrecipitacion = probPrecipitacion.value;
                    predicciones.push(prediccion);
                  }

                }
              }


            }

          }
          predicciones = predicciones.sort((a, b) => DateTimeUtils.before(a.hora, b.hora, false) ? -1 : 1);
          resolve(predicciones);

        });

      });
    })
  }

  public getPrediccionesHorarias(predicciones: PrediccionHoras[]): Promise<PrediccionHoras[]> {


    return new Promise<PrediccionHoras[]>(resolve => {
      const url = AEMET_URL_MUNICIPIO + "/horaria/27066?api_key=" + API_KEY;
      this.http.get(url).subscribe(datos => {
        if (datos['estado'] !== 200) {
          alert("Error en llamada a Aemet");
        } else {
          this.http.get(datos['datos']).subscribe(resultado => {
            const dias = resultado[0]['prediccion']['dia'];
            for (const dia of dias) {
              let fechaDia: Date = new Date(dia['fecha']);

              for (const estadoCielo of dia.estadoCielo) {
                let hora: Date = new Date(fechaDia);
                hora.setHours(estadoCielo.periodo);
                const indexPrediccion = PrediccionHoras.find(predicciones, hora);
                if (indexPrediccion != -1) {
                  predicciones[indexPrediccion].estadoCielo = estadoCielo.value;
                  predicciones[indexPrediccion].estadoCieloDesc = !!estadoCielo.descpcion ? estadoCielo.descpcion : this.descripcionesEstadoCielo.get(estadoCielo.value);
                } else {
                  let prediccion = new PrediccionHoras();
                  prediccion.hora = hora;
                  prediccion.estadoCielo = estadoCielo.value;
                  prediccion.estadoCieloDesc = !!estadoCielo.descpcion ? estadoCielo.descpcion : this.descripcionesEstadoCielo.get(estadoCielo.value);
                  predicciones.push(prediccion);
                }
              }
              for (const temp of dia.temperatura) {
                let hora: Date = new Date(fechaDia);
                hora.setHours(temp.periodo);
                const indexPrediccion = PrediccionHoras.find(predicciones, hora);
                if (indexPrediccion != -1) {
                  predicciones[indexPrediccion].temperatura = temp.value + "º";
                } else {
                  let prediccion = new PrediccionHoras();
                  prediccion.hora = hora;
                  prediccion.temperatura = temp.value + "º";
                  predicciones.push(prediccion);
                }
              }

              for (const probPrecipitacion of dia.probPrecipitacion) {
                let inicio = new Date(fechaDia);
                const periodoInicio = Number.parseInt(probPrecipitacion.periodo.substring(0, 2));
                inicio.setHours(periodoInicio);
                let fin = new Date(fechaDia);
                const periodoFin = Number.parseInt(probPrecipitacion.periodo.substring(2, 4));
                if (periodoFin < periodoInicio) {
                  fin.setDate(fin.getDay() + 1)
                }
                fin.setHours(periodoFin);
                const prediccionesFiltradas: PrediccionHoras[] = predicciones.filter(p => DateTimeUtils.between(p.hora, inicio, fin, 'inicio'))

                for (const prediccion of prediccionesFiltradas) {
                  const pIndex = predicciones.indexOf(prediccion);
                  predicciones[pIndex].probPrecipitacion = probPrecipitacion.value;

                }

              }



            }
            predicciones = predicciones.sort((a, b) => DateTimeUtils.before(a.hora, b.hora, false) ? -1 : 1);

            resolve(predicciones);

          });
        }

      });
    });
  }

  getPrediccionesTotales(): Promise<PrediccionHoras[]> {
    return new Promise<PrediccionHoras[]>(resolve => {
      this.getPrediccionesDiarias().then(prediccionesDiarias => {
        this.getPrediccionesHorarias(prediccionesDiarias).then(prediccionesTotales => {
          const predicciones = prediccionesTotales.sort((a, b) => a.hora.getTime() - b.hora.getTime() > 0 ? 1 : -1);
          this.storageService.set("PREDICCION_AEMET", predicciones);
          this.storageService.set("ULTIMA_CONSULTA_AEMET", new Date());
          resolve(predicciones);

        });
      });
    });
  }

  getPrediccionHoraria(): Promise<PrediccionHoras[]> {

    return new Promise<PrediccionHoras[]>(resolve => {
      this.storageService.get("ULTIMA_CONSULTA_AEMET").then(consulta => {

        if (!!consulta && (new Date().getTime() - consulta.getTime()) / 60000 < 30) {
          this.storageService.get("PREDICCION_AEMET").then(prediccion => resolve(prediccion));
        } else {
          this.getPrediccionesTotales().then(predicciones => resolve(predicciones));
        }

      });

    });


  }

  getPrediccion(inicio: Date, predicciones: PrediccionHoras[]): PrediccionHoras {
    let prediccion: PrediccionHoras;
    for (let i = 0; i < predicciones.length - 1; i++) {
      if (predicciones[i].hora.getTime() <= inicio.getTime() && predicciones[i + 1].hora.getTime() > inicio.getTime()) {
        prediccion = predicciones[i];
        break;
      }
    }
    if (!prediccion && inicio.getDate() == predicciones[predicciones.length - 1].hora.getDate()) {
      prediccion = predicciones[predicciones.length - 1];
    }
    return (prediccion);

  }

  getIcono(estadoCielo: string) {
    let icono = null;
    const despejado = ["11", "17"];
    const pocoNuboso = ["12", "13", "14"];
    const cubierto = ["15", "16"];
    const lluvia = ["43", "44", "45", "46"];


    if (!!despejado.find(i => i === estadoCielo.substring(0, 2))) {
      icono = "sunny-outline";
    }
    if (!!pocoNuboso.find(i => i === estadoCielo.substring(0, 2))) {
      icono = "cloudy-night-outline";
    }

    if (!!cubierto.find(i => i === estadoCielo.substring(0, 2))) {
      icono = "cloudy-outline";
    }

    return icono;
  }

}
