import { CommandInteraction, SlashCommandBuilder } from "discord.js";
import { complimentGenerator } from "../classes/complimentGenerator/complimentGenerator";
import { Result } from "../classes/other/Result";
import { Command } from "../interfaces";

const command : Command = {
    command: new SlashCommandBuilder()
    .setName("nice")
    .setDescription("generates random compliment")
    ,
    execute: async (interaction: CommandInteraction) => {
        const result = await new complimentGenerator().getCompliment();

        if (result.isFailure) {
            interaction.reply({content:"```" + `${result.error}` + "```", ephemeral: true});
            return Result.fail(`Failed to execute ${interaction.commandName}, Error: ${result.error}`);
        }
        
        interaction.reply(result.value as string);
    },
};

export default command;