import { Client } from "discord.js";
import { BotEvents } from "../interfaces";

const event: BotEvents = {
    name: "Ready",
    once: true,
    execute: async (client: Client) => {
        console.log(`Successfully Logged into Discord as , ${client.user?.tag}`);
    }
};

export default event;