const { Routes } = require('discord-api-types/v9');
const { REST } = require('@discordjs/rest');
const { readdirSync } = require('fs');
const colors = require('colors');
const config = require('../config.json');

module.exports = (client) => {
    const arrayOfSlashCommands = [];

    const loadSlashCommands = (dir = './commands/') => {
        readdirSync(dir).forEach(dirs => {
            const commands = readdirSync(`${dir}/${dirs}/`).filter(files => files.endsWith('.js'));

            for (const file of commands) {
                const command = require(`../${dir}/${dirs}/${file}`);

                if (!command.data || !command.data.name) {
                    console.warn(`[UYARI] Hatalı komut atlandı: ${file}`.yellow);
                    continue;
                }

                client.slashCommands.set(command.data.name, command);
                console.log(`[SLASH COMMAND]`.bold.red + ` Yüklendi: `.bold.white + `${command.data.name}`.bold.green);
                arrayOfSlashCommands.push(command.data.toJSON());
            }
        });

        setTimeout(async () => {
            try {
                const rest = new REST({ version: '10' }).setToken(config.token);
                await rest.put(
                    Routes.applicationCommands(config.clientId),
                    { body: arrayOfSlashCommands }
                );
                console.log(`✅ Discord API ile komutlar başarıyla senkronize edildi.`.bold.green);
            } catch (err) {
                console.error(`❌ Komutları yüklerken hata:`, err);
            }
        }, 5000);
    };

    loadSlashCommands();

    console.log(`•----------•`.bold.black);

    const loadEvents = (dir = './events/') => {
        readdirSync(dir).forEach(dirs => {
            const events = readdirSync(`${dir}/${dirs}`).filter(files => files.endsWith('.js'));

            for (const file of events) {
                const event = require(`../${dir}/${dirs}/${file}`);
                if (!event.name || !event.execute) {
                    console.warn(`[UYARI] Hatalı event atlandı: ${file}`.yellow);
                    continue;
                }

                client.on(event.name, (...args) => event.execute(...args, client));
                console.log(`[EVENT]`.bold.red + ` Yüklendi: `.bold.white + `${event.name}`.bold.green);
            }
        });
    };

    loadEvents();
    console.log(`•----------•`.bold.black);
};
