import { Collection } from "typescript";
import { SlashCommandBuilder, Client, AutocompleteInteraction, CommandInteraction } from 'discord.js';

export interface Command {
    command: SlashCommandBuilder | any;
    execute: (interaction: CommandInteraction) => void;
    autocomplete?: (interaction: AutocompleteInteraction) => void;
}

export interface iDiceExpression {
    Evaluate(...args): any;
    GetAverage(): number;
}

export interface BotEvents {
    name: string;
    once?: boolean | false;
    async execute: (...args?) => Promise<void>;
}

declare global {
    namespace NodeJS {
        interface ProcessEnv {
            CLIENT_TOKEN: string;
            CLIENT_ID: string;
            GUILD_ID: string;
        }
    }
}

declare module 'discord.js' {
    export interface Client {
        commands: Collection<string, Command>;
    }
}