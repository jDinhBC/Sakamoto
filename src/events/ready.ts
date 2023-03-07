import { Client } from "discord.js";
import { BotEvents } from "../interfaces";

const event: BotEvents = {
    name: "ready",
    once: true,
    execute: async (client: Client) => {
        console.log(`\nSuccessfully logged in as ${client.user?.tag}`);
    }
};

export default event;