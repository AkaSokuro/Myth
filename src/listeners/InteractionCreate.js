const { Events } = require('discord.js');

module.exports = {
	name: Events.InteractionCreate,

	async execute(interaction) {
        if (!interaction.isChatInputCommand()) return;

		const { client } = interaction;

		const command = client.commands.get(interaction.commandName);

		if (!command) return;

		try {
			await command.execute(interaction);
		} catch (err) {
			console.error(err);
		}
	},
};