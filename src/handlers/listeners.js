const fs = require('fs');
const path = require('path');

module.exports = {
    async execute(client) {
        const listenersPath = path.join(__dirname, '../listeners');
        const listeners = fs.readdirSync(listenersPath).filter((file) => file.endsWith(".js"));

        for (const file of listeners) {
            const listenerPath = path.join(listenersPath, file);
            const listener = require(listenerPath);
            if (listener.once) {
                client.once(
                    listener.name,
                    (...args) => listener.execute(...args, client)
                );
                console.log(`Listener Loaded: ${listener.name} (once)`);
            } else {
                client.on(
                    listener.name,
                    async (...args) => await listener.execute(...args, client)
                );
                console.log(`Listener Loaded: ${listener.name}`);
            }
        }
    }
}