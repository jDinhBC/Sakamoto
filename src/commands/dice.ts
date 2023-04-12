import { CommandInteraction, SlashCommandBuilder } from "discord.js";
import { DiceExpression, DiceExpressionOptions} from "../classes/diceParser/diceExpression";
import { Result } from "../classes/other/Result";
import { Command } from "../interfaces";

const command : Command = {
    command: new SlashCommandBuilder()
    .setName("r")
    .setDescription("Rolls dice. Format ([x]d[x] +/- [x]d[x] +/- [0-9])")
    .addStringOption(option =>
        // NAME CANNOT HAVE UPPERCASE
        option.setName('dice')
        .setDescription('Dice expression to be rolled.')
        .setRequired(true))
    .addBooleanOption(option => 
        option.setName('simplify').setDescription('simplifies dice, combines same dice and numbers')
        .setRequired(false)
    )
    ,
    execute: async (interaction: CommandInteraction) => {
        const diceOption = interaction.options.get('dice')?.value;
        let simplifyOption = interaction.options.get('simplify')?.value;

        if (!diceOption) {
            interaction.reply('Could not access input.');
            return Result.fail('Could not access input.');
        };

        let diceExpressionOptions: DiceExpressionOptions;
        switch (simplifyOption) {
            case true:
                diceExpressionOptions = DiceExpressionOptions.SimplifyDiceExpression;
                break;
            case false:
                diceExpressionOptions = DiceExpressionOptions.none;
                break;
            default:
                diceExpressionOptions = DiceExpressionOptions.none;
                break;
        }

        const result = new DiceExpression().DiceExpressionParsing(diceOption.toString(), diceExpressionOptions);
        // result = [total, [multiplier, dicesRolled[]]] ex. [15, [[1, [2,5,6,2]], [1,[2,3,4]]]]
        if (result.isFailure) {
            interaction.reply({content:"```" + `${result.error}` + "```", ephemeral: true});
            return Result.fail(`Failed to execute ${interaction.commandName}, Error: ${result.error}`);
        };

        const diceReply = DiceExpression.diceReply(result.value[1]);
        const input = diceOption.toString().trim().replace(/\s/g,'').replace(/\+/g, ' + ').replace(/\-/g, ' - ');

        interaction.reply("```Dice: " + input + "\nRoll: " + diceReply.value + "= " + result.value[0] + "```");
    },
};

export default command;