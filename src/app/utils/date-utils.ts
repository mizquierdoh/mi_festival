export class DateUtils {

    public static equals(d1: Date, d2: Date): boolean {
        return d1.getFullYear() == d2.getFullYear()
            && d1.getMonth() == d2.getMonth()
            && d1.getDate() == d2.getDate();
    }

    public static before(d1: Date, d2: Date, equals: boolean): boolean {
        return d1.getFullYear() <= d2.getFullYear()
            && d1.getMonth() <= d2.getMonth()
            && (!equals && d1.getDate() < d2.getDate() || equals && d1.getDate() <= d2.getDate());
    }

    public static after(d1: Date, d2: Date, equals: boolean): boolean {
        return this.before(d2, d1, equals);
    }

    public static between(d: Date, inicio: Date, fin: Date, equals: string) {
        return this.after(inicio, d, equals === 'inicio' || equals === 'ambos') && this.before(d, fin, equals === 'inicio' || equals === 'ambos');
    }


}
