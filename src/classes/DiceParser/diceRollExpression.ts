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

    public Evaluate(): number {
        let result: number = 0;
        for (let numberDie = 0; numberDie < this._numberOfDice; ++numberDie) {
            result += this.RandomNumber(this._diceType+1);
        }
        return result;
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
        let valueToHash = seed1.toString() + seed2.toString();
        let hash = createHash('sha256').update(valueToHash).digest('hex');
        let selection = Math.floor(Math.random()*50)+11;
        let seed = parseInt(hash.slice(selection-10,selection));
        let random = seedrandom(seed);
        let rng = random();
        return Math.floor(rng*max);
    }
}