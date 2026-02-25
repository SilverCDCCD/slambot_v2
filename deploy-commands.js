const { REST, Routes, Collection } = require("discord.js");
const fs = require("node:fs");
const path = require("node:path");
require("dotenv").config();

module.exports = {
    deploy: (client) => {
        client.commands = new Collection();

        const foldersPath = path.join(__dirname, "commands");
        const commandFolders = fs.readdirSync(foldersPath);
        
        for (const folder of commandFolders) {
            const commandsPath = path.join(foldersPath, folder);
            const commandFiles = fs.readdirSync(commandsPath).filter((file) => file.endsWith(".js"));

            for (const file of commandFiles) {
                const filePath = path.join(commandsPath, file);
                const command = require(filePath);

                if (!("data" in command))
                    console.log(`WARNING: Command at ${filePath} is missing necessary 'data' field.`);
                else if (!("execute" in command))
                    console.log(`WARNING: Command at ${filePath} is missing necessary 'execute' field.`);
                else
                    client.commands.set(command.data.name, command);
            }
        }

        const rest = new REST().setToken(process.env.DISCORD_TOKEN);
        (async() => {
            try {
                console.log(`Started refreshing ${commands.length} slash commands.`);
                const data = await rest.put(Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID));
                console.log(`Successfully reloaded ${data.length} slash commands.`);
            } catch (ex) {
                console.error(ex);
            }
        });
    }
} 