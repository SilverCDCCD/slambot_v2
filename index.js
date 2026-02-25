require("dotenv").config();
const { Client, Collection, Events, GatewayIntentBits, MessageFlags, Message } = require("discord.js");
const fs = require("node:fs");
const path = require("node:path");
const {deploy} = require("./deploy-commands.js");

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.once(Events.ClientReady, (readyClient) => {
	console.log("Slambot at the ready!");
});


client.on(Events.InteractionCreate, async (interaction) => {
	if (!interaction.isChatInputCommand()) return;
	
	const command = interaction.client.commands.get(interaction.commandName);
	
	if (!command) {
		console.error(`ERROR: Command ${interaction.commandName} not found.`)
		return;
	}
	try {
		await command.execute(interaction);
	} catch (ex) {
		console.error(ex);
		if (interaction.replied || interaction.deferred) {
			await interaction.followUp({
				content: `Error while running command: ${interaction.commandName}.`,
				flags: MessageFlags.Ephemeral
			});
		} else {
			await interaction.reply({
				content: `Error while running command: ${interaction.commandName}.`,
				flags: MessageFlags.Ephemeral
			});
		}
	}
});

deploy(client);
client.login(process.env.DISCORD_TOKEN);