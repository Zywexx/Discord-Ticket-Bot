const { 
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    Colors,
    PermissionsBitField,
    SlashCommandBuilder
} = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ticket')
        .setDescription('(🔧) By Zywexx Ticket sistemini gönderin.'),

    async execute(interaction) {
        // Komut sadece sunucuda çalışsın
        if (!interaction.guild) {
            return interaction.reply({ content: "Bu komut sadece sunucularda kullanılabilir.", ephemeral: true });
        }

        // Üyeyi sunucudan al
        const member = interaction.guild.members.cache.get(interaction.user.id);

        // Yetki kontrolü (Yönetici izni)
        if (!member.permissions.has(PermissionsBitField.Flags.Administrator)) {
            return interaction.reply({ content: 'Bu komutu çalıştırmak için yetkiniz yok!', ephemeral: true });
        }

        // Ticket mesajını gönder
        await interaction.reply({
            embeds: [{
                title: "Ticket Aç",
                description: `**__Ticket Nasıl Açılır :__**\nLütfen açmak istediğiniz destek talebi türünü seçin.`,
                footer: { text: "Ticket Support" },
                color: Colors.Blurple
            }],
            components: [
                new ActionRowBuilder().addComponents(
                    new ButtonBuilder()
                        .setCustomId('staff')
                        .setLabel(' | Yetkili ile iletişim')
                        .setEmoji('🎓')
                        .setStyle(ButtonStyle.Primary),

                    new ButtonBuilder()
                        .setCustomId('answer')
                        .setLabel(' | Bir soruyu yanıtla')
                        .setEmoji('⁉')
                        .setStyle(ButtonStyle.Secondary),

                    new ButtonBuilder()
                        .setCustomId('other')
                        .setLabel(' | Diğer')
                        .setEmoji('🔧')
                        .setStyle(ButtonStyle.Success)
                )
            ]
        });
    }
};
