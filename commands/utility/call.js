const { SlashCommandBuilder, MessageFlags } = require("discord.js");

module.exports = {
    "data": new SlashCommandBuilder()
        .setName("call")
        .setDescription("Call Slambot"),
    async execute(interaction) {
        await interaction.reply({content: "Slambot, reporting for duty!", flags: MessageFlags.Ephemeral});
    }
}
