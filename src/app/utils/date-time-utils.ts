import { DateUtils } from "./date-utils";

export class DateTimeUtils {
    public static equals(d1: Date, d2: Date): boolean {
        return DateUtils.equals(d1, d2) &&
            d1.getHours() == d2.getHours() &&
            d1.getMinutes() == d2.getMinutes();
    }

    public static before(d1: Date, d2: Date, equals: boolean): boolean {
        return DateUtils.before(d1, d2, true) &&
            d1.getHours() <= d2.getHours() &&
            ((equals && d1.getMinutes() <= d2.getMinutes()) || (!equals && d1.getMinutes() < d2.getMinutes()));
    }

    public static after(d1: Date, d2: Date, equals: boolean): boolean {
        return this.before(d2, d1, equals);
    }

    public static between(d: Date, inicio: Date, fin: Date, equals: string) {
        return this.after(d, inicio, equals === 'inicio' || equals === 'ambos') && this.before(d, fin, equals === 'inicio' || equals === 'ambos');
    }

    public static toIsoString(date: Date): string {
        var tzo = -date.getTimezoneOffset(),
            dif = tzo >= 0 ? '+' : '-',
            pad = function (num) {
                return (num < 10 ? '0' : '') + num;
            };

        return date.getFullYear() +
            '-' + pad(date.getMonth() + 1) +
            '-' + pad(date.getDate()) +
            'T' + pad(date.getHours()) +
            ':' + pad(date.getMinutes()) +
            ':' + pad(date.getSeconds()) +
            dif + pad(Math.floor(Math.abs(tzo) / 60)) +
            ':' + pad(Math.abs(tzo) % 60);
    }

    public static toExcelString(date: Date): string {
        var tzo = -date.getTimezoneOffset(),
            dif = tzo >= 0 ? '+' : '-',
            pad = function (num) {
                return (num < 10 ? '0' : '') + num;
            };
        return date.getFullYear() +
            '-' + pad(date.getMonth() + 1) +
            '-' + pad(date.getDate()) +
            ' ' + pad(date.getHours()) +
            ':' + pad(date.getMinutes());
    }

}
