import { iDiceExpression } from "../../interfaces";
import { diceRollExpression } from "./diceRollExpression";
import { normalExpression } from "./normalExpression";

export class DiceExpression {
    private static readonly numberExpression: RegExp = new RegExp("^[0-9]+$");
    private static readonly diceExpression: RegExp = new RegExp("^([0-9]*)d([0-9]+|%)$");

    private nodes: Map<number, iDiceExpression> = new Map<number, iDiceExpression>();
    
    public DiceExpressionParsing(expression: string) {
        // Reformats input
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
            if (DiceExpression.numberExpression.test(operand)) {
                this.nodes.set(multiplier, new normalExpression(+operand));
            } else if (DiceExpression.diceExpression.test(operand)) {
                let regexParsed = operand.match(DiceExpression.diceExpression);
                let numberOfDice = regexParsed == null ? 1 : +regexParsed[1];
                let dieType = regexParsed == null ? 100 : +regexParsed[2];
                this.nodes.set(multiplier, new diceRollExpression(numberOfDice, dieType));
            } else {
                throw new Error("Dice expression was not in expected format.");
            }
        }
    }

    public Evaluate() {
        let result: number = 0;
        this.nodes.forEach((value, key) => {
            result += key * value.Evaluate();
        })
        return result;
    }
}