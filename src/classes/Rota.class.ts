class Rota {
    coordenadaPartida: { x: number, y: number };
    coordenadaDestino: { x: number, y: number };
    rotaLineString: Array<{ x: number, y: number }>;
    polyline: string;

    constructor(coordenadaPartida: { x: number, y: number }, coordenadaDestino: { x: number, y: number }, rotaLineString: Array<{ x: number, y: number }>, polyline: string) {
        this.coordenadaPartida = coordenadaPartida;
        this.coordenadaDestino = coordenadaDestino;
        this.rotaLineString = rotaLineString;
        this.polyline = polyline;
    }
}

export default Rota;
