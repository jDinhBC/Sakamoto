import { Collection } from "typescript";
import { SlashCommandBuilder, Client, AutocompleteInteraction, CommandInteraction } from 'discord.js';

export interface Command {
    command: SlashCommandBuilder | any,
    execute: (interaction : CommandInteraction) => void,
    autocomplete?: (interaction: AutocompleteInteraction) => void
}

declare module 'discord.js' {
    export interface Client {
        commands: Collection<string, Command>
    }
}