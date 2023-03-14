import { CommandInteraction, SlashCommandBuilder } from "discord.js";
import { insultGenerator } from "../classes/insultGenerator/insultGenerator";
import { Result } from "../classes/other/Result";
import { Command } from "../interfaces";

const command : Command = {
    command: new SlashCommandBuilder()
    .setName("insult")
    .setDescription("generates random insult")
    ,
    execute: async (interaction: CommandInteraction) => {
        const result = await new insultGenerator().getInsult();

        if (result.isFailure) {
            interaction.reply({content:"```" + `${result.error}` + "```", ephemeral: true});
            return Result.fail(`Failed to execute ${interaction.commandName}, Error: ${result.error}`);
        }
        
        interaction.reply(result.value as string);
    },
};

export default command;