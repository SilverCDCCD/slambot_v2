const { SlashCommandBuilder } = require("discord.js");
const chars = require("./_chars_sf6.json");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("show-char-codes-sf6")
        .setDescription("Shows all character codes for Street Fighter 6."),
    async execute(interaction) {
        let result = "";
        Object.keys(chars).forEach((key) => result += `${chars[key]}: ${key}\n`);
        await interaction.reply(result);
    }
}
