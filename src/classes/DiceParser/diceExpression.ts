import { iDiceExpression } from "../../interfaces";
import { Result } from "../other/Result";
import { diceRollExpression } from "./diceRollExpression";
import { normalExpression } from "./normalExpression";
import { logMethod } from "../other/commandLogger";

export enum DiceExpressionOptions {
    none,
    SimplifyDiceExpression
}

export class DiceExpression {
    private static readonly _numberExpression: RegExp = /^[0-9]+$/;
    private static readonly _diceExpression: RegExp = /^([0-9]*)d([0-9]+|%)$/;
    private static readonly _validCharacters: RegExp = /^[0-9d\s\-+]+$/;

    private parsedDiceExpressions: Array<Map<number, iDiceExpression>> = new Array<Map<number, iDiceExpression>>();
    
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
                this.parsedDiceExpressions.push(new Map<number, iDiceExpression>([[multiplier, new normalExpression(+operand)]]));
            } else if (DiceExpression._diceExpression.test(operand)) {
                // _ = whole match, and others are resulting groups
                const [_, numberOfDice = 1, dieType = 100] = operand.match(DiceExpression._diceExpression) ?? [];
                this.parsedDiceExpressions.push(new Map<number, iDiceExpression>([[multiplier, new diceRollExpression(+numberOfDice, +dieType)]]));
            } else {
                return Result.fail("Dice expression was in a invalid format.");
            }
        }

        // Sorts dice Roll Expressions
        const diceRolls = this.parsedDiceExpressions
        .filter(map => {
            const [key, value] = [...map][0];
            return value instanceof diceRollExpression;
        })
        .sort((a, b) => {
            //sort by multiplier decending
            const aKey = a.keys().next().value;
            const bKey = b.keys().next().value;
            if (aKey > bKey) {
              return -1;
            } else if (aKey < bKey) {
              return 1;
            } else {
                // if equal then sort by dice type decending
                const aDice = a.entries().next().value;
                const bDice = b.entries().next().value;
                if (aDice.DiceType < bDice.DiceType) {
                    return -1;
                } else if (aDice.DiceType > bDice.DiceType) {
                    return 1;
                } else {
                    // if equal then sort by number of dice decending
                    return aDice.NumberOfDice - bDice.NumberOfDice;
                }
            }
        });

        // Sorts normal expressions

        const normalRolls = this.parsedDiceExpressions.filter(map => {
            const [key, value] = [...map][0];
            return value instanceof normalExpression;
        }).sort((a,b) => {
            const aNum = a.entries().next().value;
            const bNum = b.entries().next().value;
            if (aNum < bNum) {
                return -1;
            }
            if (aNum > bNum) {
                return 1;
            }
            return 0;
        })

        // Add functionality to combine same dice
        // element: [ 1 || -1 , object( normalExpression || diceRollExpression) ]
        /* parsedDiceExpression:
        [ 
            [1, diceRollExpression(diceType = 6, numDice = 3) ],
            [1, diceRollExpression(diceType = 6, numDice = 5) ],
            [1, normalExpression(number = 3) ],
            [1, normalExpression(number = 8) ],
            [1, diceRollExpression(diceType = 20, numDice = 2) ],
            [-1, diceRollExpression(diceType = 4, numDice = 2) ],
            [-1, diceRollExpression(diceType = 8, numDice = 3) ],
            [-1, diceRollExpression(diceType = 6, numDice = 1) ],
            [-1, normalExpression(number = 5) ],
            [-1, normalExpression(number = 2) ]
        ]
        */

        if (options == DiceExpressionOptions.SimplifyDiceExpression) {

            // diceTypes = all dice Expressions
            const diceTypes = new Set(diceRolls.filter(dice => {
                const [_, value] = [...dice][0] as [number, iDiceExpression];
                return value instanceof diceRollExpression;
            }).map(dice => {
                const [_, value] = [...dice][0] as [number, diceRollExpression];
                return value.DiceType;
            }));
            // simplify dices
            let normalizedDice = [];
            for (const diceType of diceTypes) {
                let numDiceOfdiceType = 0;
                for (const dice of diceRolls) {
                    const [multiplierOfEachDie, die] = [...dice][0] as [number, diceRollExpression];
                    if (die.DiceType === diceType) {
                        numDiceOfdiceType += multiplierOfEachDie * die.NumberOfDice;
                    }
                }
                normalizedDice.push(new Map([[(numDiceOfdiceType > 0 ? 1 : -1), new diceRollExpression(Math.abs(numDiceOfdiceType), diceType)]]));
            }
            // simplify normal number expressions

            let normalizedNumber = 0;
            for (const roll of normalRolls) {
                const [key, value] = [...roll][0] as [number, normalExpression];
                normalizedNumber += key * value.Number;
            }

            //set to new simplified list [dicerolls first, number]
            this.parsedDiceExpressions = normalizedNumber === 0 ? normalizedDice 
            : [...normalizedDice, new Map<number, iDiceExpression>([[(normalizedNumber > 0 ? 1: -1), new normalExpression(Math.abs(normalizedNumber))]])];
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

        /*
        const evaluations = this.parsedDiceExpressions.flatMap(map => {
    return Array.from(map.entries(), ([multiplier, evaluate]) => {
      const evaluated = evaluate.Evaluate().value;
      dices.push([multiplier, Array.isArray(evaluated[1]) ? evaluated[1] : evaluated]);
      return multiplier * (Array.isArray(evaluated) ? evaluated[0] : evaluated);
    });
  });

  result = evaluations.reduce((acc, curr) => acc + curr, 0);
        */


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