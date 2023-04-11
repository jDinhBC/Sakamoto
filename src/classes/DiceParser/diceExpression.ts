import { iDiceExpression } from "../../interfaces";
import { Result } from "../other/Result";
import { diceRollExpression } from "./diceRollExpression";
import { normalExpression } from "./normalExpression";
import { logMethod } from "../other/commandLogger";

enum DiceExpressionOptions {
    none,
    SimplifyDiceExpression,
    OrderDiceExpression
}

export class DiceExpression {
    private static readonly _numberExpression: RegExp = /^[0-9]+$/;
    private static readonly _diceExpression: RegExp = /^([0-9]*)d([0-9]+|%)$/;
    private static readonly _validCharacters: RegExp = /^[0-9d\s\-+]+$/;

    private parsedDiceExpressions: Array<Map<string,[number, iDiceExpression]>> = new Array<Map<string,[number, iDiceExpression]>>();
    
    @logMethod
    public DiceExpressionParsing(_expression: string, options: DiceExpressionOptions): Result<[number, Array<[number, Array<number>]>]> {
        let expression = _expression;
        if (!expression) {
            return Result.fail("Dice Expression was not processed.");
        }

        if (!DiceExpression._validCharacters.test(expression)) {
            return Result.fail("Dice Expression contained illegal characters.");
        }

        // Reformat input
        let expressions = expression.trim().replace(/\s/g,'').replace(/\+/g, ' + ').replace(/\-/g, ' - ').split(' ');
        
        // If empty
        expressions = expressions.length ? expressions : ['0'];
        
        // Making sure first operator-operand pair is a operator defaulting to '+'
        if (expressions[0] != '+' && expressions[0] != '-') {
            expressions.unshift("+");
        }

        // Making sure there are equal amounts of pairs
        if (expressions.length % 2 != 0) {
            return Result.fail("Dice expression was in an unexpected format.");
        }

        const operators = {
            '+': 1,
            '-': -1,
        };

        // Parsing pairs
        for (let exprIndex = 0; exprIndex < expressions.length; exprIndex+=2) {
            const operator = expressions[exprIndex];
            const operand = expressions[exprIndex+1];

            if (operator !== '+' && operator !== '-') {
                return Result.fail("Dice expression was in a invalid format.");
            }

            // Sets negative or positive
            const multiplier = operators[operator];

            // if operand match regex, number or diceRoll
            if (DiceExpression._numberExpression.test(operand)) {
                this.parsedDiceExpressions.push(new Map<string, [number,iDiceExpression]>([["dice",[multiplier, new normalExpression(+operand)]]]));
            } else if (DiceExpression._diceExpression.test(operand)) {
                // _ = whole match, and others are resulting groups
                const [_, numberOfDice = 1, dieType = 100] = operand.match(DiceExpression._diceExpression) ?? [];
                this.parsedDiceExpressions.push(new Map<string, [number,iDiceExpression]>([["dice",[multiplier, new diceRollExpression(+numberOfDice, +dieType)]]]));
            } else {
                return Result.fail("Dice expression was in a invalid format.");
            }
        }

        // Add functionality to order highest to lowest dice
        if (options == DiceExpressionOptions.OrderDiceExpression) {
            
        }
        // Add functionality to combine same dice
        // element: [ 1 || -1 , object( normalExpression || diceRollExpression) ]
        /* parsedDiceExpression:
        [ 
            {1, diceRollExpression(diceType = 6, numDice = 3) },
            {1, diceRollExpression(diceType = 6, numDice = 5) },
            {1, normalExpression(number = 3) },
            {1, normalExpression(number = 8) },
            {1, diceRollExpression(diceType = 20, numDice = 2) },
            {-1, diceRollExpression(diceType = 4, numDice = 2) },
            {-1, diceRollExpression(diceType = 8, numDice = 3) },
            {-1, diceRollExpression(diceType = 6, numDice = 1) },
            {-1, normalExpression(number = 5) },
            {-1, normalExpression(number = 2) }
        ]
        */
        if (options == DiceExpressionOptions.SimplifyDiceExpression) {
            let diceTypes = this.parsedDiceExpressions.filter(map => {
                const value = map.get('dice');
                return value instanceof iDiceExpression;
            })
        }

       return this.Evaluate();
    }

    public Evaluate(): Result<[number, Array<[number, Array<number>]>]> {
        //value[1] returns [number, number[]]
        // dices: [multiplier, diceRolledNumbers/number ]
        const dices: Array<[number , Array<number>]> = [];
        let result: number = 0;
        // value = multiplier, evaluated = iDiceExpression
        this.parsedDiceExpressions.forEach((map: Map<number, iDiceExpression>) => {
            for (const [multiplier, evaluate] of map) {
                // evalu = [total, diceRolled]
                const evaluated = evaluate.Evaluate().value;
                dices.push([multiplier, Array.isArray(evaluated[1]) ? evaluated[1] : evaluated]);
                result += multiplier * (Array.isArray(evaluated) ? evaluated[0] : evaluated);
            }
        })
        return Result.success([result, dices]);
    }

    public GetAverage(): number {
        return 0;
    }

    public static diceReply(dices: Array<[number, Array<number>]>): Result<string> {
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
        return Result.success(diceReply);
        // Dices Rolled: +1 +3 +5 -1 +2 = 10 
    }
}