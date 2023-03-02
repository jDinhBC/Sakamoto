import { Client, SlashCommandBuilder, Routes, REST } from "discord.js";
import { readdirSync } from "fs";
import { join } from "path";
import { Command } from "../interfaces";


module.exports = (client: Client) => {
    const commands : SlashCommandBuilder[] = [];
    let commandsDir = join(__dirname, "../commands");
    //reads command folder, for each file, grab command, add to commands array, 
    readdirSync(commandsDir).forEach(file => {
        //if (!file.endsWith(".js")) return;
        let command : Command = require(`${commandsDir}/${file}`).default;
        commands.push(command.command);
        client.commands.set(command.command.name, command);
    });

    // Deploy commands
    const rest = new REST({ version:'10'}).setToken(process.env.CLIENT_TOKEN);
    rest.put(
        Routes.applicationCommands(process.env.CLIENT_ID),
        {
            body: commands.map(command => command.toJSON())
        }).then( (data: any) => {
            console.log(`Successfully reloaded ${data.length} application (/) commands.`);
        }).catch( error => {
            console.log(error);
        })    
}