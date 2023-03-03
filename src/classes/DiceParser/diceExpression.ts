import { iDiceExpression } from "../../interfaces";
import { diceRollExpression } from "./diceRollExpression";
import { normalExpression } from "./normalExpression";

export class DiceExpression {
    private static readonly _numberExpression: RegExp = new RegExp("^[0-9]+$");
    private static readonly _diceExpression: RegExp = new RegExp("^([0-9]*)d([0-9]+|%)$");

    private nodes: Array<[number, iDiceExpression]> = new Array<[number, iDiceExpression]>();
    
    constructor (expression: string) {
        this.DiceExpressionParsing(expression);
    }

    public DiceExpressionParsing(expression: string) {
        // Reformats input
        if (!expression) {
            throw new Error("Dice Expression was not successfully processed.");
        }

        let expressions = expression.trim().replace('+', ' + ').replace('-', ' - ').split(' ');
        // If empty
        if (!expressions) {
            expressions = new Array('0');
        }
        
        // Making sure first operator-operand pair is a operator defaulting to '+'
        if (expressions[0] != '+' && expressions[0] != '-') {
            expressions.unshift("+");
        }

        // Making sure there are equal amounts of pairs
        if (expressions.length % 2 != 0) {
            throw new Error("Dice expression was not in expected format.");
        }

        // Parsing pairs
        for (let exprIndex = 0; exprIndex < expressions.length; exprIndex+=2) {
            let operator = expressions[exprIndex];
            let operand = expressions[exprIndex+1];

            if (operator != '+' && operator != '-') {
                throw new Error("Dice expression was not in expected format.");
            }

            // Sets negative or positive
            let multiplier = operator == '+' ? +1 : -1;

            // if operand match regex, number or diceRoll
            if (DiceExpression._numberExpression.test(operand)) {
                this.nodes.push([multiplier, new normalExpression(+operand)]);
            } else if (DiceExpression._diceExpression.test(operand)) {
                let regexParsed = operand.match(DiceExpression._diceExpression);
                let numberOfDice = regexParsed == null ? 1 : +regexParsed[1];
                let dieType = regexParsed == null ? 100 : +regexParsed[2];
                this.nodes.push([multiplier, new diceRollExpression(numberOfDice, dieType)]);
            } else {
                throw new Error("Dice expression was not in expected format.");
            }
        }
    }

    public Evaluate() {
        let result: number = 0;
        this.nodes.forEach((value) => {
            result += value[0] * value[1].Evaluate();
        })
        return result;
    }
}