const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const config = require('../../config.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ticket-kisi-ekle')
        .setDescription('Ticket kanalına bir kullanıcı ekler.')
        .addUserOption(option =>
            option.setName('kullanici')
                .setDescription('Eklenecek kullanıcı')
                .setRequired(true)
        ),

    async execute(interaction) {
        const member = interaction.options.getUser('kullanici');
        const channel = interaction.channel;

        // Sadece belirli roldekiler kullanabilsin
        if (!interaction.member.roles.cache.has(config.roleStaffId)) {
            return interaction.reply({ content: "❌ Bu komutu kullanmak için yetkin yok.", ephemeral: true });
        }

        // Ticket kanalında mı çalışıyor?
        if (!channel.name.startsWith("ticket-")) {
            return interaction.reply({ content: "❌ Bu komut sadece ticket kanallarında kullanılabilir.", ephemeral: true });
        }

        // Kullanıcı zaten erişime sahipse uyar
        const permissions = channel.permissionOverwrites.cache.get(member.id);
        if (permissions && permissions.allow.has(PermissionFlagsBits.ViewChannel)) {
            return interaction.reply({ content: "❗ Bu kullanıcı zaten bu ticket'a erişebiliyor.", ephemeral: true });
        }

        // İzin ver
        await channel.permissionOverwrites.edit(member.id, {
            ViewChannel: true,
            SendMessages: true,
            ReadMessageHistory: true
        });

        interaction.reply({ content: `✅ ${member} ticket'a eklendi.` });
    }
};
