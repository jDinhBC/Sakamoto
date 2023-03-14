import { CommandInteraction, SlashCommandBuilder } from "discord.js";
import { DiceExpression } from "../classes/diceParser/diceExpression";
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
    ,
    execute: async (interaction: CommandInteraction) => {
        const option = interaction.options.get('dice');

        if (!option || !option.value) {
            interaction.reply('Could not access input.');
            return Result.fail('Could not access input.');
        };

        // result = [total, [multiplier, dicesRolled[]]] ex. [15, [[1, [2,5,6,2]], [1,[2,3,4]]]]
        const result = new DiceExpression(option.value.toString()).DiceExpressionParsing();
        if (result.isFailure) {
            interaction.reply({content:"```" + `${result.error}` + "```", ephemeral: true});
            return Result.fail(`Failed to execute ${interaction.commandName}, Error: ${result.error}`);
        };

        const diceReply = DiceExpression.diceReply(result.value[1]);
        const input = option.value.toString().trim().replace(/\s/g,'').replace(/\+/g, ' + ').replace(/\-/g, ' - ');

        interaction.reply("```Dice: " + input + "\nRoll: " + diceReply.value + "= " + result.value[0] + "```");
    },
};

export default command;