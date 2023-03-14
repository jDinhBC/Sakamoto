import { BotEvents } from "../interfaces"
import { Interaction } from "discord.js"
import { Result } from "../classes/other/Result";

const event: BotEvents = {
    name: "interactionCreate",
    execute: async (interaction: Interaction) => {
        if (interaction.isChatInputCommand()) {
            const command = interaction.client.commands.get(interaction.commandName);
            if (!command) {
                return Result.fail(`No command matching ${interaction.commandName} was found.`);
            }

            try {
                await command.execute(interaction);
            } catch (error) {
                return Result.fail(`Error executing ${interaction.commandName}. Error: \n\n${error}`);
            }
        } else if (interaction.isAutocomplete()) {
            const command = interaction.client.commands.get(interaction.commandName);

            if (!command) {
                return Result.fail(`No command matching ${interaction.commandName} was found.`);
            }

            try {
                if (!command.autocomplete) return;
                command.autocomplete(interaction);
            } catch (error) {
                return Result.fail(`Autocomplete Error: \n\n ${error}`)
            }
        }
    }
}

export default event;