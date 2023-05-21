const { Collection, REST, Routes } = require('discord.js');
const fs = require('fs');
const path = require('path');
const config = require(path.resolve("./src/config.json"));

module.exports = {
    async execute(client) {
        const cmdFolderPath = path.join(__dirname, '../commands');
        const commandFolder = fs.readdirSync(cmdFolderPath);

        client.commands = new Collection();

        for (const folder of commandFolder) {
            const commandPath = path.join(cmdFolderPath, folder);
            const commandFiles = fs.readdirSync(commandPath).filter((file) => file.endsWith(".js"));
            for (const file of commandFiles) {
                const filePath = path.join(commandPath, file);
                const command = require(filePath);
                client.commands.set(command.data.name, command);
                console.log(`Command Loaded: ${command.data.name}`)
            }
        }

        const commandData = [
            ...Array.from(client.commands.values()).map((cmd) => cmd.data.toJSON()),
        ];

        const rest = new REST().setToken(process.env.TOKEN);

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
    }
}