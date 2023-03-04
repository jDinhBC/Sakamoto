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

        let expressions = expression.trim().replace(/\+/g, ' + ').replace(/\-/g, ' - ').split(' ');
        console.log(expressions);
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

        // Add functionality to order highest to lowest dice
        // Add functionality to combine same dice
    }

    public Evaluate(): [number, Array<[number, Array<number>]>] {
        //value[1] returns [number, number[]]
        // dices: [multiplier, diceRolledNumbers/number ]
        const dices: Array<[number , Array<number>]> = [];
        let result: number = 0;
        // value = multiplier, evaluated = iDiceExpression
        for (const [value, evaluate] of this.nodes) {
            // evalu = [total, diceRolled]
            const evaluated = evaluate.Evaluate();
            dices.push([value, Array.isArray(evaluated[1]) ? evaluated[1] : evaluated]);
            result += value * (Array.isArray(evaluated) ? evaluated[0] : evaluated);
        }
        return [result, dices];
    }

    public static diceReply(dices: Array<[number, Array<number>]>): string {
        /*
        Given:
        [
            [1, [2,5,6,2] ], 
            [1, [2,5,6,7] ],
            [-1, 1 ]
        ]
        Return:
        '+2 +5 +6 +2 +2 +5 +6 +7 -1'
        */
        let diceReply: string = '';
        dices.forEach(diceExprRolled => {
            let multiplier = diceExprRolled[0] == 1 ? '+' : '-';
            let dicesRolled = diceExprRolled[1];
            if (dicesRolled.length > 1) {
                diceReply += dicesRolled.map(diceValue => `${multiplier}${diceValue}`).join(' ').concat(' ');
            } else {
                diceReply += `${multiplier}${dicesRolled} `;
            };
        });
        return diceReply;
        // Dices Rolled: +1 +3 +5 -1 +2 = 10 
    }
}