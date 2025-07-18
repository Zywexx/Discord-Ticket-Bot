const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const transcript = require('discord-html-transcripts');
const config = require('../../config.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('transcript')
        .setDescription('Bulunduğun ticket kanalının transkriptini oluşturur ve log kanalına gönderir.')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),

    async execute(interaction) {
        // Komut sadece ticket kanalında çalışsın diye basit kontrol
        if (!interaction.channel.name.startsWith('ticket-')) {
            return interaction.reply({ content: '❌ Bu komut sadece ticket kanallarında kullanılabilir.', ephemeral: true });
        }

        await interaction.deferReply({ ephemeral: true });

        try {
            const transcriptFile = await transcript.createTranscript(interaction.channel, {
                limit: -1,
                returnBuffer: false,
                fileName: `transcript-${interaction.channel.id}.html`,
                saveImages: true,
            });

            const logChannel = interaction.guild.channels.cache.get(config.logChannel);

            if (!logChannel) {
                return interaction.editReply('❌ Log kanalı bulunamadı. Lütfen ayarları kontrol edin.');
            }

            await logChannel.send({
                content: `📁 ${interaction.channel} kanalının transkripti oluşturuldu.`,
                files: [transcriptFile],
            });

            await interaction.editReply('✅ Transkript başarıyla log kanalına gönderildi.');
        } catch (error) {
            console.error(error);
            await interaction.editReply('❌ Transkript oluşturulurken bir hata oluştu.');
        }
    },
};
