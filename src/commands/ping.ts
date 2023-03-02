import { SlashCommandBuilder } from "discord.js";
import { Command } from "../interfaces";

const command : Command = {
    command: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("pong")
    ,
    execute: interaction => {
        interaction.reply("pong");
    },
};

export default command;