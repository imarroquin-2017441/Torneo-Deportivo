
export class equipoModel{
    constructor(
        public id: string,
        public name: string,
        public puntos: number,
        public golesAnotados: number,
        public golesEncontra: number,
        public user: string,
        public liga: string
    ){ }
}