import { DiceExpression } from "../src/classes/diceParser/diceExpression";

/*
[
    total,
    [ 
        [multiplier, dicesRolled[] ],
        [multiplier, number ]
    ]
] 

ex.

[
    16, 
    [
        [+, [2,5,6,2] ], 
        [+, [2,3,4] ],
        [+, 1 ]
    ]
]

*/
const expressionSuccess = "5d1-2d1-3+5";
const expressionFailure = "3d5+5*2-1%";
const diceExpFailure = "35d+3d1-32d123-d2";

const success = [
    5, //total
    [
        [1, [1,1,1,1,1]], //1st dice
        [-1,[1,1]],  //2nd dice
        [-1,3], //3rd expression
        [1,5] //4th expression
    ]
];
const noDiceFailure = "Dice Expression was not processed.";
const regexFailure = "Dice Expression contained illegal characters.";
const diceRegexFailure = "Dice expression was in a invalid format.";

test("Dice Expression Success Test", () => {
    expect(new DiceExpression().DiceExpressionParsing(expressionSuccess).value).toEqual(success);
});

test("Empty Input Failure Test", () => {
    expect(new DiceExpression().DiceExpressionParsing("").error).toEqual(noDiceFailure);
});

test("Regex Failure Test", () => {
    expect(new DiceExpression().DiceExpressionParsing(expressionFailure).error).toEqual(regexFailure);
})

test("Dice Regex Failure Test", () => {
    expect(new DiceExpression().DiceExpressionParsing(diceExpFailure).error).toEqual(diceRegexFailure);
})
