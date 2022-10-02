export interface IGame {
    reSpinChance: number
    possibleSymbols: string[]

    spin(): string[]
}