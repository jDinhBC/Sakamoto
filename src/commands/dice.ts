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
        let option = interaction.options.get('dice');
        if (!option || !option.value) {
            throw new Error('Could not access input.');
        }
        let result = new DiceExpression(option.value.toString()).Evaluate();
        interaction.reply(`${result}`);
    },
};

export default command;