/*

imports

*/
import { Client, Collection, Events, GatewayIntentBits} from "discord.js";
import { readdirSync } from "fs";
import { join } from "path";
import { Command } from "./interfaces";

// Creates client instance with client permissions
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ]
});

client.commands = new Collection<string, Command>();

client.login(process.env.CLIENT_TOKEN);