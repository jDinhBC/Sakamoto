import { SlashCommandBuilder } from "discord.js";
import { Command } from "../interfaces";

const command : Command = {
    command: new SlashCommandBuilder()
    .setName("roll")
    .setDescription("Rolls dice. Format ([x]d[x] +/- [x]d[x] +/- [0-9])")
    ,
    execute: interaction => {
        // get command
        // call dice
        // get response
        // reply
        interaction.reply("dice!");
    },
};

export default command;