import { Client } from "discord.js";
import { readdirSync } from "fs";
import { join } from "path";
import { BotEvents } from "../interfaces";

module.exports = (client: Client) => {
    let eventsdir = join(__dirname, '../events');

    readdirSync(eventsdir).forEach(file => {
        let event: BotEvents = require(`${eventsdir}/${file}`).default;
        event.once ?
            client.once(event.name, (...args) => event.execute(...args))
            :
            client.on(event.name, (...args) => event.execute(...args));
        console.log(`Successfully loaded event ${event.name}.`);
    })
}