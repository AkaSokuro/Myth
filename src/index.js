/**
 * @author AkaSokuro
 */

process.title = "Myth"

require('dotenv').config();

const fs = require('fs');
const path = require('path');
const { Client, GatewayIntentBits, Partials, Collection, REST, Routes } = require('discord.js');

const config = require('./config.json');

const client = new Client({ 
    intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.DirectMessages,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent,
	],
	partials: [Partials.Channel]
});

client.commands = new Collection();

const cmdFolderPath = path.join(__dirname, 'commands')
const commandFolder = fs.readdirSync(cmdFolderPath);

for (const folder of commandFolder) {
    const commandPath = path.join(cmdFolderPath, folder)
	const commandFiles = fs.readdirSync(commandPath).filter((file) => file.endsWith(".js"));
	for (const file of commandFiles) {
        const filePath = path.join(commandPath, file)
		const command = require(filePath);
		client.commands.set(command.data.name, command);
        console.log(`Command Loaded: ${command.data.name}`)
	}
}

const listenersPath = path.join(__dirname, 'listeners')
const listeners = fs.readdirSync(listenersPath).filter((file) => file.endsWith(".js"));

for (const file of listeners) {
    const listenerPath = path.join(listenersPath, file)
	const listener = require(listenerPath);
	if (listener.once) {
		client.once(
            listener.name, 
            (...args) => listener.execute(...args, client));
        console.log(`Listener Loaded: ${listener.name} (once)`)
	} else {
		client.on(
			listener.name,
			async (...args) => await listener.execute(...args, client)
		);
        console.log(`Listener Loaded: ${listener.name}`)
	}
}

const rest = new REST().setToken(process.env.TOKEN);

const commandData = [
	...Array.from(client.commands.values()).map((c) => c.data.toJSON()),
];

(async () => {
	try {
		console.log(`Started refreshing ${commandData.length} application (/) commands.`);

		const data = await rest.put(
			Routes.applicationGuildCommands(config.client_id, config.dev_guild_id),
			{ body: commandData },
		);

		console.log(`Successfully reloaded ${data.length} application (/) commands.`);
	} catch (error) {
		console.error(error);
	}
})();

client.login(process.env.TOKEN);