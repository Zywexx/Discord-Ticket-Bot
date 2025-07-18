module.exports = {
    name: 'interactionCreate',
    once: false,
    execute: async (interaction) => {
        if (!interaction.isChatInputCommand()) return;

        const cmd = interaction.client.slashCommands.get(interaction.commandName);
        if (!cmd) {
            return interaction.reply({ content: 'Komut bulunamadı.', ephemeral: true });
        }

        const args = [];

        for (let option of interaction.options.data) {
            if (option.type === "SUB_COMMAND") {
                if (option.name) args.push(option.name);
                option.options?.forEach(x => {
                    if (x.value) args.push(x.value);
                });
            } else if (option.value) {
                args.push(option.value);
            }
        }

        try {
            await cmd.execute(interaction);
            console.log(`[SLASH COMMANDS] /${cmd.data.name} komutu başarıyla çalıştırıldı.`);
        } catch (error) {
            console.error(error);
            if (!interaction.replied) {
                await interaction.reply({ content: 'Komut çalıştırılırken bir hata oluştu.', ephemeral: true });
            }
        }
    }
};
