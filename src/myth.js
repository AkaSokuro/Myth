/**
 * @author AkaSokuro
 */

process.title = "Myth"

require('dotenv').config();

const fs = require('fs');
const path = require('path');
const { Client, GatewayIntentBits, Partials } = require('discord.js');

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

/*************************************************************/
// Register all Handlers

/**
 * @description All handler files
 */

const handlerFolder = path.join(__dirname, 'handlers');
const handlers = fs.readdirSync(handlerFolder).filter((file) => file.endsWith(".js"));

// Load each handler

(async () => {
	for (const file of handlers) {
		const handlerFile = path.join(handlerFolder, file);
		let handlerName = file.match(/[^\\/]+(?=\.)(?!([^\\/]+[\\/]))/)[0];
	
		console.log(`Loading handler ${handlerName}`)

		const handler = require(handlerFile);
		handler.execute(client)

		console.log(`Handler Loaded: ${handlerName}`)
	}
})()

/*************************************************************/

client.login(process.env.TOKEN);