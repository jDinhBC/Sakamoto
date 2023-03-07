import { iDiceExpression } from "../../interfaces";
import { Result } from "../Other/Result";

export class normalExpression implements iDiceExpression{
    private theNumber: number;

    constructor(number: number) {
        this.theNumber = number;
    }

    public Evaluate(): Result<number> {
        return Result.success(this.theNumber);
    }

    public GetAverage(): Result<number> {
        return Result.success(this.theNumber);
    }
}