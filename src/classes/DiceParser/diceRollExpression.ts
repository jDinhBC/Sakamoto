import { iDiceExpression } from "../../interfaces";
import { createHash } from 'crypto';
import seedrandom from 'seedrandom';

export class diceRollExpression implements iDiceExpression{
    private _numberOfDice: number;
    private _diceType: number;

    constructor(numberOfDice: number, diceType: number) {
        this._numberOfDice = numberOfDice;
        this._diceType = diceType;
    }

    public Evaluate(): [number, number[]] {
        let result: number = 0;
        let dice: number[] = [];
        for (let numberDie = 0; numberDie < this._numberOfDice; ++numberDie) {
            let rng = this.RandomNumber(this._diceType);
            // number will always be at least 1
            let number = rng < 1 ? 1 : rng;
            dice.push(number);
            result += number;
        }
        return [result, dice];
    }

    public GetAverage(): number {
        return this._numberOfDice * ((this._diceType + 1) / 2);
    }

    public get NumberOfDice(): number {
        return this._numberOfDice;
    }

    public get DiceType(): number {
        return this._diceType;
    }

    public RandomNumber(max: number) {
        let seed1 = Math.floor(Math.random() * 100000);
        let seed2 = Math.floor(Math.random() * 100000);
        let hash = createHash('sha256')
        .update(seed1.toString() + seed2.toString())
        .digest('hex');
        let rng = seedrandom(parseInt(hash.slice(0,Math.floor(Math.random()*50)+10)));
        return Math.round(rng()*max);
    }
}