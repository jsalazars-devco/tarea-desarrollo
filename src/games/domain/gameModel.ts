export class Game {
    constructor(
        readonly id: string,
        readonly name: string,
        readonly stock: number,
        readonly price: number,
        readonly consolesIds: number[],
        readonly categoriesIds: number[],
        readonly imageUrl: string
    ){}
}