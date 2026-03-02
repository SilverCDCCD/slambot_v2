const { REST, Routes } = require("discord.js");
const fs = require("node:fs");
const path = require("node:path");
require("dotenv").config();

module.exports = {
    deploy: () => {
        const commands = [];
        const foldersPath = path.join(__dirname, "commands");
        const commandFolders = fs.readdirSync(foldersPath);
        
        for (const folder of commandFolders) {
            const commandsPath = path.join(foldersPath, folder);
            const commandFiles = fs.readdirSync(commandsPath).filter((it) => it.endsWith(".js"));
            
            for (const file of commandFiles) {
                const filePath = path.join(commandsPath, file);
                const command = require(filePath);
                if (!('data' in command))
                    console.log(`[WARNING] The command at ${filePath} is missing necessary "data" property.`);
                else if (!('execute' in command))
                    console.log(`[WARNING] The command at ${filePath} is missing necessary "execute" property.`);
                else
                    commands.push(command.data.toJSON());
            }
            
            const rest = new REST().setToken(process.env.DISCORD_TOKEN);
            (async() => {
                try {
                    console.log(`Started refreshing ${commands.length} application slash commands.`);
                    const data = await rest.put(Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID), { body: commands });
                    console.log(`Successfully reloaded ${data.length} commands.`);
                } catch (ex) {
                    console.error(ex);
                }
            }) ();
        }
    }
} 