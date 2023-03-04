import { CommandInteraction, SlashCommandBuilder } from "discord.js";
import { DiceExpression } from "../classes/DiceParser/diceExpression";
import { Command } from "../interfaces";

const command : Command = {
    command: new SlashCommandBuilder()
    .setName("roll")
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
            throw new Error('Could not access input.');
        };
        // result = [total, [multiplier, dicesRolled[]]] ex. [15, [[1, [2,5,6,2]], [1,[2,3,4]]]]
        const result = new DiceExpression(option.value.toString()).Evaluate();
        if (typeof result === 'string') {
            interaction.reply(result);
        };
        const diceReply = DiceExpression.diceReply(result[1]);
        interaction.reply("```Dice: "+option.value+"\nRoll: "+ diceReply + "= " + result[0] + "```");
    },
};

export default command;