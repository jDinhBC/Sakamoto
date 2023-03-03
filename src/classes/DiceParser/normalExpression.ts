import { iDiceExpression } from "../../interfaces";

export class normalExpression implements iDiceExpression{
    private theNumber: number;

    constructor(number: number) {
        this.theNumber = number;
    }

    public Evaluate(): number {
        return this.theNumber;
    }

    public GetAverage(): number {
        return this.theNumber;
    }
}